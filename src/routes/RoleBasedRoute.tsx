import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import Loader from "../components/ui/Loader";
import { useGetMeQuery } from "../redux/features/users/userApi";

interface RoleBasedRouteProps {
    children: ReactNode;
    allowedRoles: ('student' | 'teacher' | 'admin')[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps): JSX.Element => {
    const location = useLocation();
    const { user, loading: authLoading } = useAppSelector((state) => state.auth);

    // Fetch user role from backend
    const { data: userData, isLoading: roleLoading } = useGetMeQuery(undefined, {
        skip: !user, // Skip query if no user is logged in
    });

    // Show loader while checking auth or fetching role
    if (authLoading || roleLoading) return <Loader />;

    // If no user, redirect to account page
    if (!user) {
        return <Navigate state={location.pathname} to="/account" />;
    }

    // If user doesn't have required role, redirect to home with unauthorized message
    if (!userData?.role || !allowedRoles.includes(userData.role)) {
        return <Navigate to="/" state={{ unauthorized: true }} replace />;
    }

    return <>{children}</>;
};

export default RoleBasedRoute;
