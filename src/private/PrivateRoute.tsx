import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../animation/Loader";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (user) {
    return <>{children}</>;
  }

  return <Navigate state={location.pathname} to="/account" />;
};

export default PrivateRoute;
