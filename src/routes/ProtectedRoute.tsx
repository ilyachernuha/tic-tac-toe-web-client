import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PropsWithChildren } from "react";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { authToken } = useAuth();
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
