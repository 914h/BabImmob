import { useUserContext } from "../../../context/UserContext"
import { useNavigate } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { User, LogOut, Settings, Bell } from "lucide-react"
import { toast } from "sonner"
import logo from "../../../assets/logo/logo.png"

export function ClientDropdownmenu() {
    const { user, logout } = useUserContext()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            logout()
            toast.success("Logged out successfully")
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
            toast.error("Logout failed. Please try again.")
        }
    }

    const getInitials = (name) => {
        if (!name) return "U"
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover-primary transition-all duration-300">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className="bg-primary-modern text-white text-xs font-medium">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-primary-modern">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || 'user@example.com'}
                        </p>
                        <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-success-modern rounded-full mr-2"></div>
                            <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => navigate('/client/profile')}
                    className="cursor-pointer hover-info transition-all duration-300 group"
                >
                    <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => navigate('/client/settings')}
                    className="cursor-pointer hover-warning transition-all duration-300 group"
                >
                    <Settings className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => {/* Add notifications page */}}
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
                    onClick={handleLogout}
                    className="cursor-pointer text-danger-modern hover-danger transition-all duration-300 group"
                >
                    <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 