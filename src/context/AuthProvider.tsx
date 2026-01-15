import { createContext, useEffect, useState, ReactNode } from "react";
import auth from "../config/firebase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import { AuthContextType } from "../types";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser, logout as logoutReduxUser } from "../redux/features/auth/authSlice";
import { useLogoutMutation } from "../redux/features/auth/authApi";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [serverLogout] = useLogoutMutation();

  const createUser = (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const githubProvider = new GithubAuthProvider();
  githubProvider.setCustomParameters({ prompt: "select_account" });

  const signInWithGoogle = (): Promise<UserCredential> => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithub = (): Promise<UserCredential> => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  const signInUser = (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (name: string, image: string): Promise<void> => {
    setLoading(true);
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user logged in"));
    }
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: image,
    });
  };

  const logoutUser = (): void => {
    serverLogout(); // Clear server-side cookies
    signOut(auth);
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
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const isPending = sessionStorage.getItem("google_pending_password");
      if (currentUser && isPending === "true") {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        console.log(currentUser);
        const token = await currentUser.getIdToken();
        dispatch(setReduxUser({
          user: {
            email: currentUser.email,
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          token
        }));
      } else {
        dispatch(logoutReduxUser());
      }
    });
    return () => {
      unSubscribe();
    };
  }, [dispatch]);

  return (
    <div>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
