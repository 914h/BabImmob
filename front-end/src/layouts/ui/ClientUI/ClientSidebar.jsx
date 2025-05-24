import { cn } from "@/lib/utils"
import {Button} from "../../../components/ui/button.tsx";
import {ScrollArea} from "../../../components/ui/scroll-area.tsx";
import { Home, Building2, FileText, User, Calendar, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ClientSidebar({ className}) {
    const navigate = useNavigate();

    return (
        <div className={cn("", className)}>
            <div >
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Dashboard
                    </h2>
                    <div className="space-y-1">
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/client/dashboard')}
                        >
                            <Home/> Dashboard
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/client/properties')}
                        >
                            <Building2/> Properties
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/client/contracts')}
                        >
                            <FileText/> My Contracts
                        </Button>
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/client/visits')}
                        >
                            <Calendar/> My Visits
                        </Button>
                    </div>
                </div>
                <div className="px-3 ">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Account
                    </h2>
                    <div className="space-y-1">
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/client/profile')}
                        >
                            <User/> My Profile
                        </Button>
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/client/settings')}
                        >
                            <Settings/> Settings
                        </Button>
                         <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/logout')}
                        >
                            <LogOut/> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 