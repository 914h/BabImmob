import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu"
import { Button } from "./button"
import { Badge } from "./badge"
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react"

const notifications = [
    {
        id: 1,
        type: 'success',
        title: 'Property Viewing Confirmed',
        message: 'Your viewing for "Modern Apartment in Casablanca" has been confirmed for tomorrow at 2:00 PM.',
        time: '2 hours ago',
        read: false
    },
    {
        id: 2,
        type: 'info',
        title: 'New Property Available',
        message: 'A new property matching your criteria has been listed in Rabat.',
        time: '5 hours ago',
        read: false
    },
    {
        id: 3,
        type: 'warning',
        title: 'Contract Update',
        message: 'Your rental contract is expiring in 30 days. Please review and renew.',
        time: '1 day ago',
        read: true
    }
];

const getNotificationIcon = (type) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'warning':
            return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        case 'error':
            return <AlertCircle className="h-4 w-4 text-red-500" />;
        default:
            return <Info className="h-4 w-4 text-blue-500" />;
    }
};

export function NotificationDropdown() {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative hover-success transition-all duration-300"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary-modern">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary-modern">Notifications</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover-secondary transition-all duration-300">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem 
                                key={notification.id}
                                className={`cursor-pointer p-3 hover-info transition-all duration-300 group ${!notification.read ? 'bg-success-modern/10' : ''}`}
                            >
                                <div className="flex items-start space-x-3 w-full">
                                    {getNotificationIcon(notification.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none group-hover:text-white">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-white/80">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 group-hover:text-white/60">
                                            {notification.time}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-primary-modern rounded-full flex-shrink-0 mt-1" />
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    )}
                </div>
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-center justify-center hover-primary transition-all duration-300">
                            <span className="text-sm text-primary-modern group-hover:text-white">View all notifications</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 