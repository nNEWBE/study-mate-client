import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { AuthContextType } from "../types";

const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return auth;
};

export default useAuth;
