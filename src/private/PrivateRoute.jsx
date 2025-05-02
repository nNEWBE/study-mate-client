import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../animation/Loader";

const PrivateRoute = ({ children }) => {
  const locaiton = useLocation();
  const { user, loading } = useAuth();

  if (loading) return <Loader></Loader>;

  if (user) {
    return children;
  }
  return <Navigate state={locaiton.pathname} to="/account"/>;
};

PrivateRoute.propTypes = {
  children: PropTypes.object,
};

export default PrivateRoute;
