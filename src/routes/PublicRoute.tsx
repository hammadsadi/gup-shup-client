import { Navigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { getTokenFromCookie } from "@/utils/getTokenFromCookie";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getTokenFromCookie();

  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
