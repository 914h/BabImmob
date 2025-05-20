import { createContext, useContext, useState, useEffect } from "react"
import UserApi from "../services/api/UserApi"

export const UserStateContext = createContext({
    user: {},
    setUser: () => {},
    login: (email, password) => {},
    logout: () => {},
    Authenticated: false,
    setAuthenticated: () => {},
    setToken: () => {},
})

export default function UserContext({children}) {
    const [user, setUser] = useState({})
    const [Authenticated, _setAuthenticated] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const initializeAuth = async () => {
            const token = window.localStorage.getItem('token');
            const storedUser = window.localStorage.getItem('user');
            const isAuthenticated = window.localStorage.getItem('AUTHENTICATED') === 'true';
            
            if (token && storedUser && isAuthenticated) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    if (['admin', 'owner', 'client'].includes(parsedUser.role)) {
                        try {
                            const { data } = await UserApi.getUser();
                            if (data.role === parsedUser.role) {
                                setUser(data);
                                _setAuthenticated(true);
                            } else {
                                clearAuthData();
                            }
                        } catch (error) {
                            clearAuthData();
                        }
                    } else {
                        clearAuthData();
                    }
                } catch (error) {
                    clearAuthData();
                }
            } else {
                clearAuthData();
            }
            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    const clearAuthData = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('AUTHENTICATED');
        setUser({});
        _setAuthenticated(false);
    };

    const login = async (email, password) => {
        try {
            const response = await UserApi.login(email, password);
            
            if (response.status === 200) {
                const userData = response.data.user;
                if (['admin', 'owner', 'client'].includes(userData.role)) {
                    window.localStorage.setItem('user', JSON.stringify(userData));
                    window.localStorage.setItem('token', response.data.token);
                    window.localStorage.setItem('AUTHENTICATED', 'true');
                    
                    setUser(userData);
                    _setAuthenticated(true);
                    return { success: true, data: response.data };
                } else {
                    return { success: false, error: 'Invalid user role' };
                }
            }
            return { success: false, error: 'Login failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    const logout = () => {
        clearAuthData();
    }

    const setAuthenticated = (isAuthenticated) => {
        _setAuthenticated(isAuthenticated);
        window.localStorage.setItem('AUTHENTICATED', isAuthenticated);
    }

    const setToken = (token) => {
        window.localStorage.setItem('token', token);
    }

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <UserStateContext.Provider value={{
            user,
            login,
            logout,
            setUser,
            Authenticated,
            setAuthenticated,
            setToken
        }}>
            {children}
        </UserStateContext.Provider>
    )
}

export const useUserContext = () => useContext(UserStateContext)
