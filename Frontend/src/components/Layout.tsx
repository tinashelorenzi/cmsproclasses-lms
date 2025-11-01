import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authHelpers } from '@/lib/auth';
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

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
      icon: HomeIcon,
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
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar - Canvas-style Left Sidebar - Narrow with vertical icon layout */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-20 bg-cms-dark flex-col shadow-lg z-50">
        {/* Logo at Top */}
        <div className="flex items-center justify-center h-20 border-b border-gray-800">
          <div className="w-12 h-12 bg-cms-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
        </div>

        {/* Navigation - Canvas-style vertical icons with labels */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const href = `${getBaseRoute()}${item.href.replace('/dashboard', '') || '/dashboard'}`;
            return (
              <Link
                key={item.name}
                to={href}
                className={cn(
                  'flex flex-col items-center justify-center py-4 px-2 text-xs font-medium transition-all hover:bg-gray-900',
                  item.current
                    ? 'bg-gray-900 text-cms-secondary border-l-4 border-cms-primary'
                    : 'text-gray-400'
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-center leading-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account and Logout at Bottom */}
        <div className="border-t border-gray-800">
          <Link
            to={`${getBaseRoute()}/account`}
            className={cn(
              'flex flex-col items-center justify-center py-4 px-2 text-xs font-medium transition-all hover:bg-gray-900',
              location.pathname.includes('/account')
                ? 'bg-gray-900 text-cms-secondary border-l-4 border-cms-primary'
                : 'text-gray-400'
            )}
          >
            <UserCircleIcon className="h-6 w-6 mb-1" />
            <span className="text-center leading-tight">Account</span>
          </Link>
          
          <button
            onClick={() => {
              authHelpers.clearAuth();
              window.location.href = '/';
            }}
            className="w-full flex flex-col items-center justify-center py-4 px-2 text-xs font-medium text-gray-400 hover:bg-gray-900 hover:text-cms-secondary transition-all"
          >
            <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            <span className="text-center leading-tight">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-cms-dark border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const href = `${getBaseRoute()}${item.href.replace('/dashboard', '') || '/dashboard'}`;
            return (
              <Link
                key={item.name}
                to={href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-all',
                  item.current
                    ? 'text-cms-primary'
                    : 'text-gray-400'
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-center leading-tight">{item.name}</span>
              </Link>
            );
          })}
          <Link
            to={`${getBaseRoute()}/account`}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-all',
              location.pathname.includes('/account')
                ? 'text-cms-primary'
                : 'text-gray-400'
            )}
          >
            <UserCircleIcon className="h-5 w-5 mb-1" />
            <span className="text-center leading-tight">Account</span>
          </Link>
        </div>
      </div>

      {/* Main Content - Offset by sidebar width on desktop, bottom nav on mobile */}
      <div className="md:ml-20 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}