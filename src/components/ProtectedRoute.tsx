import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('admin_token');
  const location = useLocation();

  if (!token) {
    // Save the attempted path to redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      // Token is expired
      localStorage.removeItem('admin_token');
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('admin_token');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
