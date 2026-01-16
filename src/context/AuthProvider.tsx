
import { createContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../config/supabase";
import { AuthContextType, User, UserCredential } from "../types";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser, logout as logoutReduxUser } from "../redux/features/auth/authSlice";
import { useLogoutMutation, useRefreshTokenMutation, useLoginMutation } from "../redux/features/auth/authApi";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [serverLogout] = useLogoutMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const [backendLogin] = useLoginMutation();

  // Helper to map Supabase user to our App's User format
  const mapUser = (sbUser: SupabaseUser): User => {
    const { id, email, user_metadata, app_metadata, identities } = sbUser;

    // Extract provider info. Supabase auth response usually puts provider in app_metadata
    const providerId = app_metadata?.provider || 'email';

    // Extract the original provider ID (e.g., Google ID) if available
    const identity = identities?.find(i => i.provider === providerId) || identities?.[0];
    const providerUid = identity?.id || id;

    return {
      uid: id,
      email: email || null,
      displayName: user_metadata?.full_name || user_metadata?.name || null,
      photoURL: user_metadata?.avatar_url || user_metadata?.picture || null,
      providerData: [
        {
          uid: providerUid, // Use the provider's original ID for socialId matching
          displayName: user_metadata?.full_name || user_metadata?.name || null,
          email: email || null,
          photoURL: user_metadata?.avatar_url || user_metadata?.picture || null,
          providerId: providerId,
        }
      ]
    };
  };

  // Supabase Auth implementations
  const createUser = async (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    if (data.user) {
      return {
        user: mapUser(data.user),
        providerId: 'email'
      };
    } else {
      setLoading(false);
      throw new Error("User creation failed");
    }
  };

  const signInUser = async (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    if (data.user) {
      return {
        user: mapUser(data.user),
        providerId: 'email'
      };
    } else {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;

    // This will never be reached because of redirect, but types might demand return
    // We return a dummy object to satisfy TypeScript until redirect happens
    return {} as UserCredential;
  };

  const signInWithGithub = async (): Promise<UserCredential> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
        scopes: 'user:email read:user' // Explicitly request email and profile scopes
      }
    });

    if (error) throw error;
    return {} as UserCredential;
  };

  const updateUserProfile = async (name: string, image: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, avatar_url: image }
    });
    if (error) throw error;
  };

  const logoutUser = async (): Promise<void> => {
    dispatch(logoutReduxUser());
    serverLogout();
    await supabase.auth.signOut();
    localStorage.removeItem("isAuthenticated");
    setUser(null);
  };

  const authInfo: AuthContextType = {
    user,
    loading,
    setUser,
    createUser,
    signInUser,
    logoutUser,
    signInWithGoogle,
    signInWithGithub,
    updateUserProfile,
  };

  useEffect(() => {
    // Helper function to sync social login with backend
    const syncSocialLoginWithBackend = async (appUser: User, provider: string) => {
      if (localStorage.getItem("isAuthenticated")) return; // Already authenticated

      const isSocialProvider = provider === 'google' || provider === 'github';
      if (!isSocialProvider) return;

      try {
        // Use regular login endpoint with just email (no password) for social users
        const loginResult = await backendLogin({
          email: appUser.email || ""
        }).unwrap();

        if (loginResult.success && loginResult.data) {
          // Update Redux state
          dispatch(setReduxUser({
            user: {
              email: loginResult.data.user?.email || appUser.email,
              uid: loginResult.data.user?._id || null,
              displayName: loginResult.data.user?.name || appUser.displayName,
              photoURL: loginResult.data.user?.profileImage || appUser.photoURL,
              role: (loginResult.data.user?.role as 'student' | 'teacher' | 'admin') || "student",
            },
            token: loginResult.data.accessToken,
          }));

          // Update context user with backend photo/name for navbar
          setUser({
            ...appUser,
            displayName: loginResult.data.user?.name || appUser.displayName,
            photoURL: loginResult.data.user?.profileImage || appUser.photoURL,
          });

          localStorage.setItem("isAuthenticated", "true");
          console.log("Social login synced with backend!");

          // Call refresh-token to establish server session and set HTTP-only cookies
          try {
            await refreshToken().unwrap();
            console.log("Session cookies established!");
          } catch (refreshError) {
            console.log("Refresh token not available yet, but login succeeded.");
          }
        }
      } catch (error) {
        // New user - needs password setup
        console.log("New social user detected, needs password setup.");
        const userInfo = {
          name: appUser.displayName || "User",
          email: appUser.email || null,
          photoURL: appUser.photoURL || "",
          uid: appUser.uid,
          provider: provider as 'google' | 'github',
          socialId: appUser.providerData[0]?.uid
        };
        sessionStorage.setItem("pendingSocialUser", JSON.stringify(userInfo));
        window.location.href = "/account";
      }
    };

    // 1. Check active session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        console.log("Session found:", session.user);
        const appUser = mapUser(session.user);
        setUser(appUser);
        setLoading(false);

        const provider = session.user.app_metadata?.provider;

        // If already authenticated with backend, restore session
        if (localStorage.getItem("isAuthenticated") === "true") {
          restoreBackendSession();
        } else if (provider && (provider === 'google' || provider === 'github')) {
          // New social login - sync with backend immediately
          await syncSocialLoginWithBackend(appUser, provider);
        }
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes (Redirect return, Logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Supabase Auth Event:", event);

      if (session?.user) {
        const appUser = mapUser(session.user);
        setUser(appUser);
        setLoading(false);

        // Only process SIGNED_IN if not already handled by getSession
        if (event === 'SIGNED_IN' && !localStorage.getItem("isAuthenticated")) {
          const provider = session.user.app_metadata?.provider;
          // Use the shared helper function
          if (provider) {
            await syncSocialLoginWithBackend(appUser, provider);
          }
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // 3. Backend Session Restoration
    const restoreBackendSession = async () => {
      try {
        const result = await refreshToken().unwrap();
        if (result.success && result.data && result.data.user) {
          const { user: userData, accessToken } = result.data;
          dispatch(setReduxUser({
            user: {
              email: userData.email,
              uid: userData._id,
              displayName: userData.name,
              photoURL: userData.profileImage || null,
              role: (userData.role as 'student' | 'teacher' | 'admin') || "student"
            },
            token: accessToken
          }));
          localStorage.setItem("isAuthenticated", "true");

          // Re-map backend user to context user to ensure consistency
          const mappedUser = {
            displayName: userData.name,
            email: userData.email,
            uid: userData._id,
            photoURL: userData.profileImage,
            providerData: [] // Backend user might not have provider data handy here, but that's ok
          } as unknown as User;
          setUser(mappedUser);
        }
      } catch (error) {
        localStorage.removeItem("isAuthenticated");
      }
    };

    // If backend authenticated flag exists, try to restore
    if (localStorage.getItem("isAuthenticated") === "true") {
      restoreBackendSession();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, refreshToken]);

  return (
    <div>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
