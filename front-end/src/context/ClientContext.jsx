import { createContext, useContext, useState, useEffect } from "react"
import UserApi from "../services/api/UserApi"

export const ClientStateContext = createContext({
    user: {},
    setUser: () => {},
    login: (email, password) => {},
    logout: () => {},
    Authenticated: false,
    setAuthenticated: () => {},
    setToken: () => {},
})

export default function ClientContext({children}) {
    const [user, setUser] = useState({})
    const [Authenticated, _setAuthenticated] = useState('true' === window.localStorage.getItem('AUTHENTICATED'))

    useEffect(() => {
        // Check if we have a token and user data on mount
        const token = window.localStorage.getItem('token');
        const storedUser = window.localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role === 'client') {
                    setUser(parsedUser);
                    _setAuthenticated(true);
                } else {
                    // Clear invalid data if user is not a client
                    window.localStorage.removeItem('token');
                    window.localStorage.removeItem('user');
                    window.localStorage.removeItem('AUTHENTICATED');
                }
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear invalid data
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('user');
                window.localStorage.removeItem('AUTHENTICATED');
            }
        }
    }, []);

    const login = async (email, password) => {
        console.log('Context: Attempting login');
        const response = await UserApi.login(email, password);
        console.log('Context: Login response received', response);
        
        if (response.status === 200 && response.data.user.role === 'client') {
            // Store user data in localStorage
            window.localStorage.setItem('user', JSON.stringify(response.data.user));
            window.localStorage.setItem('token', response.data.token);
            window.localStorage.setItem('AUTHENTICATED', 'true');
            
            setUser(response.data.user);
            _setAuthenticated(true);
        }
        
        return response;
    }

    const logout = () => {
        console.log('Context: Logging out');
        setUser({});
        _setAuthenticated(false);
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('AUTHENTICATED');
    }

    const setAuthenticated = (isAuthenticated) => {
        console.log('Context: Setting authenticated state to', isAuthenticated);
        _setAuthenticated(isAuthenticated);
        window.localStorage.setItem('AUTHENTICATED', isAuthenticated);
    }

    const setToken = (token) => {
        console.log('Context: Setting token');
        window.localStorage.setItem('token', token);
    }

    return (
        <ClientStateContext.Provider value={{
            user,
            login,
            logout,
            setUser,
            Authenticated,
            setAuthenticated,
            setToken
        }}>
            {children}
        </ClientStateContext.Provider>
    )
}

export const useClientContext = () => useContext(ClientStateContext) 