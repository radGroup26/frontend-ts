// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GuestRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuth();


  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default GuestRoute;