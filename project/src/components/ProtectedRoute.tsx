import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  admin?: boolean;
}

export default function ProtectedRoute({ children, admin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getAuthToken();
  const role = localStorage.getItem('skyriting_user_role') || 'user';

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If route is admin-only, ensure logged-in user has admin role
  if (admin && role !== 'admin') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
