import { Bell, Menu, Moon, Sun } from 'lucide-react';
import type { PageName, UserInfo } from '../../types';

interface TopbarProps {
  user: UserInfo;
  currentPage: PageName;
  unreadCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenMobileNav: () => void;
  onOpenNotifications: () => void;
}

export function Topbar({
  user,
  currentPage,
  unreadCount,
  isDark,
  onToggleTheme,
  onOpenMobileNav,
  onOpenNotifications,
}: TopbarProps) {
  const userInitial = (user.name || 'G').charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="breadcrumb">
            Your space <span aria-hidden="true">/</span>{' '}
            <strong>{currentPage}</strong>
          </div>
          <div className="topbar-date" aria-hidden="true">
            {new Date().toLocaleDateString('en-NP', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className="icon-btn notification-btn"
          onClick={onOpenNotifications}
          aria-label={
            unreadCount > 0
              ? `Notifications — ${unreadCount} unread`
              : 'Notifications'
          }
        >
          <Bell size={18} />
          {unreadCount > 0 && <i aria-hidden="true" />}
        </button>
        <div className="top-avatar" aria-hidden="true">{userInitial}</div>
      </div>
    </header>
  );
}
