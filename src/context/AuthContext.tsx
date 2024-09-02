import { createContext, useContext, useState, useEffect, ReactNode, Dispatch } from 'react';
import axios from 'axios';
import { Restaurant } from '@/types/retaurant';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    selectedRestaurant: Restaurant | undefined;
    setSelectedRestaurant: Dispatch<Restaurant | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | undefined>(undefined);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
    };

    const refreshAccessToken = async (): Promise<boolean> => {
        try {
            const response = await axios.post('http://localhost:3000/auth/refresh', {}, { withCredentials: true });
            // console.log('Refresh token response:', response.data);
            const { accessToken } = response.data;
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                setIsAuthenticated(true);
                return true;
            } else {
                // console.log('No access token in response');
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            // console.log('Failed to refresh access token', error);
            setIsAuthenticated(false);
            return false;
        }
    };

    useEffect(() => {
        (async () => {
            await refreshAccessToken();
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            selectedRestaurant,
            setSelectedRestaurant,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};