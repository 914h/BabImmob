import { cn } from "@/lib/utils"
import {Button} from "../../../components/ui/button.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ADMIN_DASHBOARD_ROUTE,
    ADMIN_MANAGE_CLIENTS_ROUTE,
    ADMIN_MANAGE_AGENTS_ROUTE,
    ADMIN_MANAGE_OWNERS_ROUTE,
    ADMIN_PROPERTIES_ROUTE,
    ADMIN_CONTRACTS_ROUTE,
    ADMIN_TRANSACTIONS_ROUTE,
    ADMIN_VISIT_REQUESTS_ROUTE,
    ADMIN_EVENTS_ROUTE
} from "../../../router/index.jsx";
import {
    LayoutPanelLeft,
    UsersRound,
    Building,
    FileText,
    CreditCard,
    CalendarCheck,
    Calendar,
    LogOut,
    Settings
} from "lucide-react";
import { useEffect, useState } from "react";
import SidebarImg from '../../../assets/logo/sidebarimg.png';

export function AdminAppSidebar({ className }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [ActiveRoute, setActiveRoute] = useState(location.pathname);
    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);

    const handleLogout = async () => {
        navigate('/logout');
    };

    return (
        <div className={cn("h-full bg-background border-r border-border", className)}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-center items-center py-4">
                    <img src={SidebarImg} alt="Sidebar" className="w-40 h-40 object-contain" />
                </div>
                <div className="p-4 bg-primary-modern text-white">
                    <h2 className="text-lg font-semibold">Welcome Admin!</h2>
                    <p className="text-sm opacity-90">Manage the platform and users</p>
                </div>
                <div className="flex-1 px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary-modern">
                        Navigation
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant={ActiveRoute === ADMIN_DASHBOARD_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-primary transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_DASHBOARD_ROUTE)}
                        >
                            <LayoutPanelLeft className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Dashboard
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_MANAGE_CLIENTS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-secondary transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_MANAGE_CLIENTS_ROUTE)}
                        >
                            <UsersRound className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Clients
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_MANAGE_OWNERS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-success transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_MANAGE_OWNERS_ROUTE)}
                        >
                            <UsersRound className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Owners
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_MANAGE_AGENTS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-info transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_MANAGE_AGENTS_ROUTE)}
                        >
                            <UsersRound className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Agents
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_PROPERTIES_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-warning transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_PROPERTIES_ROUTE)}
                        >
                            <Building className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Properties
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_CONTRACTS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-success transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_CONTRACTS_ROUTE)}
                        >
                            <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Contracts
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_VISIT_REQUESTS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-primary transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_VISIT_REQUESTS_ROUTE)}
                        >
                            <CalendarCheck className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Visit Requests
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_TRANSACTIONS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-info transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_TRANSACTIONS_ROUTE)}
                        >
                            <CreditCard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Transactions
                        </Button>
                        <Button
                            variant={ActiveRoute === ADMIN_EVENTS_ROUTE ? "secondary" : "ghost"}
                            className="w-full justify-start hover-secondary transition-all duration-300 group"
                            onClick={() => navigate(ADMIN_EVENTS_ROUTE)}
                        >
                            <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Events
                        </Button>
                    </div>
                    <div className="my-4 border-t border-border" />
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-secondary-modern">
                        Account
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start hover-warning transition-all duration-300 group"
                            onClick={() => navigate('/admin/settings')}
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
    );
}
