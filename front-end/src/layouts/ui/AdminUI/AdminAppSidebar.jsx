import { cn } from "@/lib/utils"
import {Button} from "../../../components/ui/button.tsx";
import { Link, useLocation } from "react-router-dom";
import {
    ADMIN_DASHBOARD_ROUTE,
    ADMIN_MANAGE_CLIENTS_ROUTE,
    ADMIN_MANAGE_AGENTS_ROUTE,
    ADMIN_MANAGE_OWNERS_ROUTE
} from "../../../router/index.jsx";
import { LayoutPanelLeft, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminAppSidebar({ className}) {
    const location = useLocation();
    const [ActiveRoute, setActiveRoute] = useState(location.pathname)
    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);
    return (
        <div className={cn("", className)}>
            <div >
                <div className="px-3 py-4">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Administration
                    </h2>

                    <div className="space-y-1">
                        <Link to={ADMIN_DASHBOARD_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_DASHBOARD_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <LayoutPanelLeft className={'mx-1'} />
                                Dashboard
                            </Button>
                        </Link>
                        <Link to={ADMIN_MANAGE_CLIENTS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_MANAGE_CLIENTS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <UsersRound className={'mx-1'} />
                                Clients
                            </Button>
                        </Link>
                        <Link to={ADMIN_MANAGE_OWNERS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_MANAGE_OWNERS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <UsersRound className={'mx-1'} />
                                Owners
                            </Button>
                        </Link>
                        <Link to={ADMIN_MANAGE_AGENTS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_MANAGE_AGENTS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <UsersRound className={'mx-1'} />
                                Agents
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
