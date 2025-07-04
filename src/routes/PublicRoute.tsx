import { Navigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // Already logged in, redirect to dashboard or home
    return <Navigate to="/" replace />;
  }

  //  Not logged in, allow access
  return <>{children}</>;
};

export default PublicRoute;
