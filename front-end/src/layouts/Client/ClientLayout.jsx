import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../../index.css'
import Logo from '../../assets/logo/logo.png'
import { LOGIN_ROUTE, CLIENT_PROPERTIES_ROUTE } from '../../router'
import { useUserContext } from '../../context/UserContext'
import { useEffect, useState } from 'react'
import { Building2, Bell, Settings, Search, Menu, X } from 'lucide-react'
import { ModeToggle } from '../../components/dark-mode/mode-toggle'
import { Button } from '../../components/ui/button'
import { ClientDropdownmenu } from '../ui/ClientUI/ClientDropdownmenu'
import { ClientSidebar } from '../ui/ClientUI/ClientSidebar'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { NotificationDropdown } from '../../components/ui/notification-dropdown'

export default function ClientLayout(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

    return (
        <div className="min-h-screen bg-background">
            {/* Modern Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                            <div className="flex items-center space-x-3">
                                <img src={Logo} alt="Logo" className="w-10 h-10 object-contain dark:invert" />
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-primary-modern">
                                        Bab-Immobilier
                                    </h1>
                                    <p className="text-xs text-muted-foreground">Your Dream Home Awaits</p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search properties..."
                                    className="pl-10 bg-muted/50 border-0 focus:bg-background focus:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Mobile Search Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden hover-primary transition-all duration-300"
                                onClick={() => {/* Add mobile search functionality */}}
                            >
                                <Search className="h-4 w-4" />
                            </Button>

                            {/* Properties Link */}
                            <Link to={CLIENT_PROPERTIES_ROUTE}>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="hidden sm:flex items-center space-x-2 hover-primary transition-all duration-300"
                                >
                                    <Building2 className="h-4 w-4" />
                                    <span>Properties</span>
                                </Button>
                            </Link>

                            {/* Notifications */}
                            <NotificationDropdown />

                            {/* Settings */}
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover-secondary transition-all duration-300"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>

                            {/* User Menu */}
                            <ClientDropdownmenu />
                            
                            {/* Theme Toggle */}
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                </div>
            )}

            {/* Main Content */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <ClientSidebar />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}