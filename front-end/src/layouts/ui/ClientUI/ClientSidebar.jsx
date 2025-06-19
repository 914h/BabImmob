import { cn } from "@/lib/utils"
import {Button} from "../../../components/ui/button.tsx";
import {ScrollArea} from "../../../components/ui/scroll-area.tsx";
import { Building2, FileText, User, Calendar, Settings, LogOut, Bell, HelpCircle, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/UserContext";
import { toast } from "sonner";
import SidebarImg from '../../../assets/logo/sidebarimg.png';

export function ClientSidebar({ className}) {
    const navigate = useNavigate();
    const { logout } = useUserContext();

    const handleLogout = async () => {
        try {
            logout();
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <div className={cn("h-full bg-background border-r border-border", className)}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-center items-center py-4">
                    <img src={SidebarImg} alt="Sidebar" className="w-40 h-40 object-contain " />
                </div>
                <div className="p-4 bg-primary-modern text-white">
                    <h2 className="text-lg font-semibold">Welcome back!</h2>
                    <p className="text-sm opacity-90">Explore your dashboard</p>
                </div>

                <div className="flex-1 px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary-modern">
                        Navigation
                    </h2>
                    <div className="space-y-1">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start hover-primary transition-all duration-300 group"
                            onClick={() => navigate('/client/properties')}
                        >
                            <Building2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Properties
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start hover-secondary transition-all duration-300 group"
                            onClick={() => navigate('/client/contracts')}
                        >
                            <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> My Contracts
                        </Button>
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start hover-success transition-all duration-300 group"
                            onClick={() => navigate('/client/visits')}
                        >
                            <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> My Visits
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start hover:bg-yellow-50 transition-all duration-300 group"
                            onClick={() => navigate('/client/notifications')}
                        >
                            <Bell className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Notifications
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start hover:bg-green-50 transition-all duration-300 group"
                            onClick={() => navigate('/client/support')}
                        >
                            <HelpCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Support
                        </Button>
                    </div>
                    <div className="my-4 border-t border-border" />
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-secondary-modern">
                        Account
                    </h2>
                    <div className="space-y-1">
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start hover-info transition-all duration-300 group"
                            onClick={() => navigate('/client/profile')}
                        >
                            <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> My Profile
                        </Button>
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start hover-warning transition-all duration-300 group"
                            onClick={() => navigate('/client/settings')}
                        >
                            <Settings className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Settings
                        </Button>
                    </div>
                    <div className="my-4 border-t border-border" />
                </div>
                
                {/* Logout at bottom */}
                <div className="px-3 py-2 border-t border-border">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-danger-modern hover-danger transition-all duration-300 group"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Logout
                    </Button>
                </div>
            </div>
        </div>
    )
} 