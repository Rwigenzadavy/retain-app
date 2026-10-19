import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" />;
    return <>{children}</>;
};
