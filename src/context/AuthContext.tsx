import { createContext, useContext, useState, useEffect, ReactNode, Dispatch } from 'react';
import axios from 'axios';
import { Restaurant } from '@/types/retaurant';
import fetchRole from '@/lib/api/fetchRole';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

type User = {
    username: string;
    userId: string;
};

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    selectedRestaurant: Restaurant | undefined;
    setSelectedRestaurant: Dispatch<Restaurant | undefined>;
    role: string | undefined;
    user: User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJWT(token: string) {
    try {
        const decoded = jwtDecode<{ UserInfo: { username: string; userId: string } }>(token);
        return decoded.UserInfo;
    } catch (error) {
        console.error('Failed to decode JWT', error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);


    const queryClient = useQueryClient();

    const role = useQuery({
        queryKey: ['role', selectedRestaurant?._id],
        queryFn: fetchRole,
        enabled: !!selectedRestaurant
    });

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


    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['role']
        });
    }, [selectedRestaurant, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decoded = decodeJWT(token);
                if (decoded) {
                    setUser({ username: decoded.username, userId: decoded.userId });
                }
            }
        } else {
            setUser(undefined);
        }
    }, [isAuthenticated]);

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
            role: role.data,
            user
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