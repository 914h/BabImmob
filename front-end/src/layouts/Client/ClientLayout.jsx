import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../../index.css'
import Logo from '../../assets/logo/logo.png'
import { LOGIN_ROUTE } from '../../router'
import { useUserContext } from '../../context/UserContext'
import { useEffect } from 'react'
import { LayoutPanelLeft, Home, Building2, User } from 'lucide-react'
import { ModeToggle } from '../../components/dark-mode/mode-toggle'
import { Button } from '../../components/ui/button'
import { ClientDropdownmenu } from '../ui/ClientUI/ClientDropdownmenu'

export default function ClientLayout(){
    const navigate = useNavigate()
    const { user, Authenticated } = useUserContext()

    useEffect(() => {
        const checkAuth = () => {
            const token = window.localStorage.getItem('token');
            const storedUser = window.localStorage.getItem('user');
            const isAuthenticated = window.localStorage.getItem('AUTHENTICATED') === 'true';
            
            if (!token || !storedUser || !isAuthenticated) {
                navigate(LOGIN_ROUTE);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role !== 'client') {
                    navigate(LOGIN_ROUTE);
                }
            } catch (error) {
                navigate(LOGIN_ROUTE);
            }
        };

        checkAuth();
    }, [navigate]);

    // Show loading state while checking authentication
    if (!Authenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Only render if authenticated and is a client
    if (user.role !== 'client') {
        return null;
    }

    return <>
        <header>
            <div className="items-center bg-gray-800 justify-between flex bg-opacity-90 px-12 py-4 mb-4 mx-auto">
                <div className="text-2xl text-white font-semibold inline-flex items-center">
                    <img src={Logo} alt="Logo" className="w-16 h-16" />
                </div>
                <div>
                    <ul className="flex text-white place-items-center">
                        <li className="ml-5 px-2 py-1">
                            <Link className={'flex'} to="/client/dashboard">
                                <Button><LayoutPanelLeft className={'mx-1'} /> Dashboard</Button>
                            </Link>
                        </li>
                        <li className="ml-5 px-2 py-1">
                            <ClientDropdownmenu/>
                        </li>
                        <li className="ml-5 px-2 py-1">
                            <ModeToggle/>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
        <main className={'mx-auto px-10 space-y-4 py-4'}>
            <div className="flex">
                <div className={'w-100 md:w-1/6'}>
                    <nav className="space-y-2">
                        <Link to="/client/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                            <Home className="h-5 w-5" />
                            <span>Home</span>
                        </Link>
                        <Link to="/client/properties" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                            <Building2 className="h-5 w-5" />
                            <span>Properties</span>
                        </Link>
                        <Link to="/client/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                        </Link>
                    </nav>
                </div>
                <div className={'w-100 md:w-5/6'}>
                    <Outlet/>
                </div>
            </div>
        </main>
    </>;
}