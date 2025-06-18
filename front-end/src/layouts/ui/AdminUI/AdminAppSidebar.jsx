import { cn } from "@/lib/utils"
import {Button} from "../../../components/ui/button.tsx";
import { Link, useLocation } from "react-router-dom";
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
import { LayoutPanelLeft, UsersRound, Building, FileText, CreditCard, CalendarCheck, Calendar } from "lucide-react";
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
                        <Link to={ADMIN_PROPERTIES_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_PROPERTIES_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Building className={'mx-1'} />
                                Properties
                            </Button>
                        </Link>
                        <Link to={ADMIN_CONTRACTS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_CONTRACTS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <FileText className={'mx-1'} />
                                Contracts
                            </Button>
                        </Link>
                        <Link to={ADMIN_TRANSACTIONS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_TRANSACTIONS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <CreditCard className={'mx-1'} />
                                Transactions
                            </Button>
                        </Link>
                        <Link to={ADMIN_VISIT_REQUESTS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_VISIT_REQUESTS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <CalendarCheck className={'mx-1'} />
                                Visit Requests
                            </Button>
                        </Link>
                        <Link to={ADMIN_EVENTS_ROUTE}>
                            <Button
                                variant={ActiveRoute === ADMIN_EVENTS_ROUTE ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Calendar className={'mx-1'} />
                                Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
