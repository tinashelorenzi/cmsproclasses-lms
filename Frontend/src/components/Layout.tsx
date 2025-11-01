import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authHelpers } from '@/lib/auth';
import {
  Squares2X2Icon,
  BookOpenIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = authHelpers.getAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Squares2X2Icon,
      current: location.pathname.includes('/dashboard') || location.pathname.endsWith('/student') || location.pathname.endsWith('/tutor') || location.pathname.endsWith('/parent'),
    },
    {
      name: 'My Classes',
      href: '/classes',
      icon: BookOpenIcon,
      current: location.pathname.includes('/classes'),
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: CalendarIcon,
      current: location.pathname.includes('/calendar'),
    },
    {
      name: 'Support',
      href: '/support',
      icon: QuestionMarkCircleIcon,
      current: location.pathname.includes('/support'),
    },
    {
      name: 'War Room',
      href: '/war-room',
      icon: UserGroupIcon,
      current: location.pathname.includes('/war-room'),
    },
  ];

  // Determine base route based on user type
  const getBaseRoute = () => {
    if (user?.user_type === 'STUDENT') return '/student';
    if (user?.user_type === 'TUTOR') return '/tutor';
    if (user?.user_type === 'PARENT') return '/parent';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left Sidebar - Canvas-inspired dark navigation */}
      <div className="fixed inset-y-0 left-0 w-72 bg-gray-800 text-white flex flex-col shadow-xl">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center px-4 py-6 border-b border-gray-700">
          <img src={logo} alt="CMS Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation - Large icons like Canvas */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const href = `${getBaseRoute()}${item.href.replace('/dashboard', '') || '/dashboard'}`;
            return (
              <Link
                key={item.name}
                to={href}
                className={cn(
                  'flex items-center px-4 py-4 text-base font-medium rounded-lg transition-all',
                  item.current
                    ? 'bg-cms-primary text-white shadow-lg'
                    : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className="mr-4 h-7 w-7 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-cms-primary flex items-center justify-center text-white font-semibold text-lg">
              {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              authHelpers.clearAuth();
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 flex-1">
        {children}
      </div>
    </div>
  );
}

