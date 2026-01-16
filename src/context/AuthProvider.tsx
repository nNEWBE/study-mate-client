
import { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "../config/supabase";
import { AuthContextType, User, UserCredential } from "../types";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser, logout as logoutReduxUser, setPendingProvider, clearPendingProvider, setLoading as setReduxLoading } from "../redux/features/auth/authSlice";
import { useLogoutMutation, useRefreshTokenMutation, useLoginMutation, useRegisterMutation, useLazyCheckUserExistsQuery } from "../redux/features/auth/authApi";
import { getRandomAvatar } from "../utils/avatars";
import { User as SupabaseUser } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { useAppSelector } from "../redux/store";

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
  const [registerNewUser] = useRegisterMutation();
  const [checkUserExists] = useLazyCheckUserExistsQuery();

  // Get pending provider from Redux (which button was clicked)
  const pendingProvider = useAppSelector((state) => state.auth.pendingProvider);
  const reduxUser = useAppSelector((state) => state.auth.user);

  // Sync Context user with Redux user
  // This allows components using useAuth() (Context) to stay in sync with Redux
  useEffect(() => {
    if (reduxUser) {
      setUser({
        uid: reduxUser.uid || "",
        email: reduxUser.email,
        displayName: reduxUser.displayName,
        photoURL: reduxUser.photoURL,
        providerData: [] // Redux user doesn't store this, but we mock it for type compatibility
      });
      setLoading(false);
    } else {
      // If Redux has no user, we might still be loading or truly logged out.
      // We don't force null here immediately because Supabase session check (setUserFromSession)
      // might be running in parallel. But usually Redux is the source of truth for "logged in via backend".
      // If we are logged out in Redux, we are likely logged out in Context too.
      // However, be careful not to override initial Supabase check.
    }
  }, [reduxUser]);

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



  const signInWithGoogle = async (): Promise<UserCredential> => {
    setLoading(true);

    // Store which button was clicked in Redux AND localStorage (before OAuth redirect)
    // localStorage is needed because Redux state is lost on page redirect
    // This fixes Supabase returning first provider for linked accounts
    dispatch(setPendingProvider('google'));
    localStorage.setItem('pendingProvider', 'google');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    // NOTE: execution typically STOPS here because the browser redirects to Google.
    // The code below will NOT run.
    // The flow resumes in the useEffect hook (onAuthStateChange) after the user returns to the app.

    if (error) throw error;
    return {} as UserCredential;
  };

  const signInWithGithub = async (): Promise<UserCredential> => {
    setLoading(true);

    // Store which button was clicked in Redux AND localStorage (before OAuth redirect)
    // localStorage is needed because Redux state is lost on page redirect
    // This fixes Supabase returning first provider for linked accounts
    dispatch(setPendingProvider('github'));
    localStorage.setItem('pendingProvider', 'github');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
        scopes: 'user:email read:user'
      }
    });

    // NOTE: execution typically STOPS here because the browser redirects to GitHub.
    // The code below will NOT run.
    // The flow resumes in the useEffect hook (onAuthStateChange) after the user returns to the app.

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
    setUser(null);
  };

  const authInfo: AuthContextType = {
    user,
    loading,
    setUser,
    logoutUser,
    signInWithGoogle,
    signInWithGithub,
    updateUserProfile,
  };

  useEffect(() => {
    let isMounted = true;
    let isCheckingBackend = true;
    let isSyncingSocialLogin = false;

    // Helper function to sync social login with backend
    // ONLY called on fresh SIGNED_IN event with pendingProvider
    const syncSocialLoginWithBackend = async (appUser: User, provider: string) => {
      const isSocialProvider = provider === 'google' || provider === 'github';
      if (!isSocialProvider) return;

      isSyncingSocialLogin = true; // Mark sync in progress

      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
      const loadingToast = toast.loading(`Signing in with ${providerName}...`);

      try {
        // STEP 1: Check if user exists in database
        console.log("STEP 1: Checking if user exists in database...");
        const checkResult = await checkUserExists({
          email: appUser.email || "",
          provider
        }).unwrap();

        const userExistsInDB = checkResult.data?.exists;
        const dbProviders = checkResult.data?.providers || [];

        // Check if clicked provider is already in the DB user's providers array
        const providerExistsInDB = dbProviders.includes(provider as 'google' | 'github' | 'password');

        console.log("Check result:", {
          userExistsInDB,
          clickedProvider: provider,
          dbProviders,
          providerExistsInDB
        });

        // STEP 2: Register only if user doesn't exist OR doesn't have this provider
        if (!userExistsInDB || !providerExistsInDB) {
          console.log("STEP 2: Registering user to backend...");
          console.log(`Provider '${provider}' not found in DB providers [${dbProviders.join(', ')}]`);

          const registerData = {
            name: appUser.displayName || `User-${Date.now()}`,
            email: appUser.email || "",
            profileImageUrl: appUser.photoURL || getRandomAvatar(),
            provider: provider as 'google' | 'github'
          };

          await registerNewUser(registerData).unwrap();
          console.log("Registration successful!");
        } else {
          console.log(`Provider '${provider}' already exists in DB. Skipping registration.`);
        }

        // STEP 3: Login to backend to SET COOKIES
        console.log("STEP 3: Logging in to set cookies...");
        const loginResult = await backendLogin({
          email: appUser.email || ""
        }).unwrap();

        toast.dismiss(loadingToast);

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



          toast.success(`Welcome, ${loginResult.data.user?.name || appUser.displayName}!`);
          console.log("Social login complete! Cookies set.");

          // Clear pending provider
          dispatch(clearPendingProvider());
          localStorage.removeItem('pendingProvider');

          // Set loading false now that social login is complete
          setLoading(false);
          isSyncingSocialLogin = false;
        }
      } catch (error: any) {
        toast.dismiss(loadingToast);
        console.error("Social login failed:", error);
        toast.error(error?.data?.message || "Login failed. Please try again.");
        dispatch(clearPendingProvider());
        localStorage.removeItem('pendingProvider');
        // Set loading false on error too
        setLoading(false);
        isSyncingSocialLogin = false;
      }
    };

    const setUserFromSession = async () => {
      // 1. Try to restore from Backend (HttpOnly Cookie) - This gives the "correct" persistent profile
      try {
        const result = await refreshToken().unwrap();
        if (result.success && result.data && result.data.user) {
          console.log("Session restored from Backend Cookie:", result.data.user);

          dispatch(setReduxUser({
            user: {
              email: result.data.user.email,
              uid: result.data.user._id,
              displayName: result.data.user.name,
              photoURL: result.data.user.profileImage || null,
              role: (result.data.user.role as 'student' | 'teacher' | 'admin') || "student",
            },
            token: result.data.accessToken,
          }));

          if (isMounted) setLoading(false);
          return; // Stop here if backend session is valid
        }
      } catch (error) {
        console.log("Backend session check failed (no cookie or invalid).");
      } finally {
        dispatch(setReduxLoading(false));
        isCheckingBackend = false;
      }

      // 2. If Backend failed, we check Supabase session but do NOT automatically set Redux user
      // to avoid avatar mismatch (User specifically requested consistent avatar).
      // We only log it for debugging.
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        console.log("Supabase session exists but backend cookie failed. Ignoring Supabase session for UI consistency.");
      }

      // Only set loading false if NOT returning from OAuth and not syncing
      const hasPendingProvider = localStorage.getItem('pendingProvider');
      if (isMounted && !hasPendingProvider && !isSyncingSocialLogin) setLoading(false);
    };

    setUserFromSession();

    // Listen for auth changes - ONLY sync on fresh SIGNED_IN with pendingProvider
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Supabase Auth Event:", event);

      if (session?.user) {
        // We do NOT set user here directly anymore. 
        // We rely on 'setUserFromSession' (on mount) or 'syncSocialLoginWithBackend' (on login) to update Redux.
        // This prevents overwriting rich Backend User data in Context with basic Supabase User data on events like TOKEN_REFRESHED.

        const appUser = mapUser(session.user);

        // ONLY sync on SIGNED_IN event AND when there's a pendingProvider
        // This prevents re-syncing on page refresh or tab switch
        if (event === 'SIGNED_IN') {
          const clickedProvider = localStorage.getItem('pendingProvider') as 'google' | 'github' | null;
          console.log("SIGNED_IN - pendingProvider:", clickedProvider);

          if (clickedProvider) {
            // Fresh OAuth return - sync with backend (updates Redux -> Context)
            await syncSocialLoginWithBackend(appUser, clickedProvider);
          }
        }

        // Don't set loading false here if sync is in progress
        if (!isCheckingBackend && !isSyncingSocialLogin && isMounted) setLoading(false);
      } else {
        // If we are still checking backend, ignore Supabase "no session" event
        if (isCheckingBackend) return;

        if (isMounted) {
          // Dispatch logout to Redux to clear state (and Context via sync)
          dispatch(logoutReduxUser());
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch, backendLogin, registerNewUser, checkUserExists, refreshToken]);

  return (
    <div>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
