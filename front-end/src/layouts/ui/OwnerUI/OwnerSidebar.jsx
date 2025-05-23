import { cn } from "@/lib/utils"
import {Button} from "../../../components/ui/button.tsx";
import {ScrollArea} from "../../../components/ui/scroll-area.tsx";
import { 
  BookCheck, 
  HelpCircleIcon, 
  LibraryBig, 
  LogOut, 
  LucideLibraryBig, 
  NotebookIcon, 
  Calendar, 
  FileText,
  UserMinus,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OwnerSidebar({ className}) {
    const navigate = useNavigate();

    return (
        <div className={cn("", className)}>
            <div >
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Dashboard
                    </h2>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start"
                        onClick={() => navigate('/owner/dashboard')}
                        >
                            <LibraryBig/> Dashboard
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/owner/properties')}
                        >
                            <NotebookIcon/> Your Properties
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/owner/contracts')}
                        >
                            <FileText/> My Contracts
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/owner/visits')}
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
                            onClick={() => navigate('/owner/profile')}
                        >
                            <UserMinus/> My Profile
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/owner/notifications')}
                        >
                            <Bell/> Notifications
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/owner/analytics')}
                        >
                            <BarChart3/> Analytics
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/owner/settings')}
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