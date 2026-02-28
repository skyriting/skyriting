import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  admin?: boolean;
}

export default function ProtectedRoute({ children, admin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const token = admin 
    ? localStorage.getItem('skyriting_admin_token')
    : localStorage.getItem('skyriting_auth_token');

  if (!token) {
    return <Navigate to={admin ? '/3636847rgyuvfu3f/98184t763gvf/login' : '/login'} replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
