import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Building2, FileText, Settings, LogOut } from 'lucide-react';

export default function OwnerSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/owner/dashboard',
      icon: Home
    },
    {
      title: 'Properties',
      href: '/owner/properties',
      icon: Building2
    },
    {
      title: 'Contracts',
      href: '/owner/contracts',
      icon: FileText
    },
    {
      title: 'Settings',
      href: '/owner/settings',
      icon: Settings
    }
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  location.pathname === item.href && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto">
        <Link
          to="/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </div>
    </div>
  );
} 