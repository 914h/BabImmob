import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../../index.css'
import Logo from '../../assets/logo/logoo.png'
import { LOGIN_ROUTE, OWNER_DASHBOARD_ROUTE } from '../../router'
import { useUserContext } from '../../context/UserContext'
import { useEffect, useState } from 'react'
import { Building2, Bell, Settings, Search, Menu, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { OwnerSidebar } from '../ui/OwnerUI/OwnerSidebar'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { User, LogOut } from 'lucide-react'
import { toast } from "sonner"

export default function OwnerLayout(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const {setUser, setAuthenticated, Authenticated, user , logout} = useUserContext()

    useEffect(() => {
      if(Authenticated === true){
        setIsLoading(false)
        // Optionally, fetch user and check role here
      }
      else{
        navigate(LOGIN_ROUTE)
      }
    }, [Authenticated])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
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
                                <img src={Logo} alt="Logo" className="w-12 h-12 object-contain rounded-full" />
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-primary-modern">
                                        Bab-Immobilier
                                    </h1>
                                    <p className="text-xs text-muted-foreground">Owner Dashboard</p>
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
                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="hover-secondary transition-all duration-300 relative">
                                <Bell className="h-4 w-4" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
                            </Button>
                            {/* Settings */}
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover-secondary transition-all duration-300"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            {/* User Menu (modern dropdown) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover-primary transition-all duration-300">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.image ? `http://localhost:8000/storage/${user.image}` : undefined} alt={user?.name} />
                                            <AvatarFallback className="bg-primary-modern text-white text-xs font-medium">
                                                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                        </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 shadow-lg" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-primary-modern">{user?.name || 'Owner'}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user?.email || 'owner@example.com'}</p>
                                            <div className="flex items-center mt-1">
                                                <div className="w-2 h-2 bg-success-modern rounded-full mr-2"></div>
                                                <span className="text-xs text-muted-foreground">Online</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        onClick={() => navigate('/owner/profile')}
                                        className="cursor-pointer hover-info transition-all duration-300 group"
                                    >
                                        <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => navigate('/owner/settings')}
                                        className="cursor-pointer hover-warning transition-all duration-300 group"
                                    >
                                        <Settings className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => navigate('/owner/notifications')}
                                        className="cursor-pointer hover-success transition-all duration-300 group"
                                    >
                                        <Bell className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span>Notifications</span>
                                        <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary-modern">
                            3
                        </Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        onClick={() => { logout(); toast.success('Logged out successfully'); navigate('/login'); }}
                                        className="cursor-pointer text-danger-modern hover-danger transition-all duration-300 group"
                                    >
                                        <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                <div
                  className={`
                    fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-30
                  `}
                >
                  <OwnerSidebar />
            </div>
                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}