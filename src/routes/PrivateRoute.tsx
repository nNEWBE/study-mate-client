import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import Loader from "../components/ui/Loader";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const location = useLocation();
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) return <Loader />;

  if (user) {
    return <>{children}</>;
  }

  return <Navigate state={location.pathname} to="/account" />;
};

export default PrivateRoute;
