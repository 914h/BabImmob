import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../../index.css'
import Logo from '../../assets/logo/logo.png'
import { LOGIN_ROUTE, CLIENT_DASHBOARD_ROUTE } from '../../router'
import { useUserContext } from '../../context/UserContext'
import { useEffect, useState } from 'react'
import { LayoutPanelLeft, Home, Building2, User, Bell, Settings } from 'lucide-react'
import { ModeToggle } from '../../components/dark-mode/mode-toggle'
import { Button } from '../../components/ui/button'
import { ClientDropdownmenu } from '../ui/ClientUI/ClientDropdownmenu'
import { ClientSidebar } from '../ui/ClientUI/ClientSidebar'
import { Badge } from '../../components/ui/badge'

export default function ClientLayout(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const { user, Authenticated, logout } = useUserContext()

    useEffect(() => {
        const checkAuth = async () => {
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
            } finally {
                 setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate, Authenticated]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Only render if authenticated and is a client
    if (!Authenticated || user?.role !== 'client') {
         // This case should ideally be handled by the initial checkAuth and redirect
         // But as a fallback, return null or a message
        return null; 
    }

    return <>
        <header className="sticky top-0 z-50">
            <div className="items-center bg-gray-800 justify-between flex bg-opacity-90 px-12 py-4 mb-4 mx-auto">
                <div className="flex items-center space-x-4">
                    <img src={Logo} alt="Logo" className="w-24 h-24 object-contain dark:invert" />
                    <div className="text-2xl text-white font-semibold">
                        Bab-Immobilier
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to={CLIENT_DASHBOARD_ROUTE}>
                         <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 text-lg px-6 py-2 rounded-xl">
                            <LayoutPanelLeft className="mr-2 h-6 w-6" />
                            Dashboard
                         </Button>
                    </Link>
                     <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 relative text-lg px-6 py-2 rounded-xl">
                        <Bell className="mr-2 h-6 w-6" />
                         <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-sm">
                            5 {/* Replace with actual notification count */}
                        </Badge>
                    </Button>
                     <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 text-lg px-6 py-2 rounded-xl">
                        <Settings className="mr-2 h-6 w-6" />
                    </Button>
                    <ClientDropdownmenu/>
                    <ModeToggle/>
                </div>
            </div>
        </header>
        <main className={'mx-auto px-10 space-y-4 py-4'}>
            <div className="flex">
                <div className={'w-100 md:w-1/6'}>
                    <ClientSidebar/>
                </div>
                <div className={'w-100 md:w-5/6'}>
                    <Outlet/>
                </div>
            </div>
        </main>
    </>;
}