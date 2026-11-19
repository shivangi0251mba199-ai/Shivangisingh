import React from 'react';
import {
  Home,
  CalendarPlus,
  IndianRupee,
  PackageCheck,
  User,
  LayoutDashboard,
  Compass,
} from 'lucide-react';
import { ScreenId } from '../types';

interface NavbarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  userOrdersCount: number;
}

export const QuickWashLogoMark: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="11" fill="#0F172A" />
    <rect
      x="8"
      y="7"
      width="28"
      height="30"
      rx="5"
      stroke="#38BDF8"
      strokeWidth="2.2"
      fill="#1E293B"
    />
    <line x1="8" y1="14" x2="36" y2="14" stroke="#38BDF8" strokeWidth="1.8" />
    <circle cx="13" cy="10.5" r="1.3" fill="#38BDF8" />
    <circle cx="17.5" cy="10.5" r="1.3" fill="#BAE6FD" />
    <circle
      cx="22"
      cy="25.5"
      r="7.5"
      stroke="#F8FAFC"
      strokeWidth="2.2"
      fill="#0284C7"
    />
    <path
      d="M16.5 25.5C18 23.5 20.2 23.5 22 25.5C23.8 27.5 26 27.5 27.5 25.5"
      stroke="#E0F2FE"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  userOrdersCount,
}) => {
  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'book', label: 'Book Pickup' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'orders', label: userOrdersCount > 0 ? `My Orders (${userOrdersCount})` : 'My Orders' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'admin', label: 'Admin Demo' },
  ];

  const mobileTabs: {
    id: ScreenId;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'book', label: 'Book', icon: CalendarPlus },
    { id: 'orders', label: 'Orders', icon: PackageCheck },
    { id: 'pricing', label: 'Pricing', icon: IndianRupee },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Top Navigation Bar - Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            QuickWash Campus
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-sky-600 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={`px-3 py-2 min-h-[40px] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScreen === 'profile'
                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Student Profile
            </button>
            <button
              type="button"
              onClick={() => onNavigate('book')}
              className="px-4 py-2 min-h-[40px] text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Book a Pickup
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      >
        <div className="grid grid-cols-6 items-center h-14 px-1">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              activeScreen === tab.id ||
              (tab.id === 'orders' && activeScreen === 'tracking');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-sky-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap truncate max-w-[54px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
