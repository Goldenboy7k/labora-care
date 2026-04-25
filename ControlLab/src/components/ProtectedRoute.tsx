import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "tecnico" | "usuario";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isTecnico, isUsuario } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "tecnico" && !isTecnico && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "usuario" && !isUsuario && !isTecnico && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
