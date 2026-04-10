import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

const AuthRestrictedRoute = ({ children, ownerId }: { children: ReactNode; ownerId: string | undefined }) => {
  const { user: userId } = useAuth();

  if (ownerId === undefined) return null; // still loading, don't redirect yet
  if (userId !== ownerId) return <Navigate to="/" replace />;

  return children;
};

export default AuthRestrictedRoute;