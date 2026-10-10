import {
  Activity,
  Bell,
  CreditCard,
  Home,
  Landmark,
  LogOut,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import type { PageName, UserInfo } from '../../types';
import { BrandLogo } from '../ui/BrandMark';

const NAV_ITEMS: { name: PageName; icon: typeof Home }[] = [
  { name: 'Overview', icon: Home },
  { name: 'Accounts', icon: Landmark },
  { name: 'Transactions', icon: Activity },
  { name: 'Savings goals', icon: Target },
  { name: 'Virtual card', icon: CreditCard },
  { name: 'Notifications', icon: Bell },
  { name: 'Settings', icon: ShieldCheck },
];

interface SidebarProps {
  user: UserInfo;
  currentPage: PageName;
  unreadCount: number;
  isOpen: boolean;
  onNavigate: (page: PageName) => void;
  onClose: () => void;
  onSignOut: () => void;
  onSafetyInfo: () => void;
}

export function Sidebar({
  user,
  currentPage,
  unreadCount,
  isOpen,
  onNavigate,
  onClose,
  onSignOut,
  onSafetyInfo,
}: SidebarProps) {
  const userInitial = (user.name || 'G').charAt(0).toUpperCase();

  return (
    <aside className={'sidebar ' + (isOpen ? 'sidebar-open' : '')}>
      <div className="sidebar-brand">
        <BrandLogo />
        <button
          className="mobile-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <div className="demo-banner" role="status">
        <span className="green-dot" aria-hidden="true" />
        SIMULATED ENVIRONMENT
      </div>

      <div className="nav-caption" aria-hidden="true">YOUR SPACE</div>

      <nav aria-label="Main navigation">
        {NAV_ITEMS.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={'nav-item ' + (currentPage === name ? 'active' : '')}
            onClick={() => onNavigate(name)}
            aria-current={currentPage === name ? 'page' : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{name}</span>
            {name === 'Notifications' && unreadCount > 0 && (
              <i aria-label={`${unreadCount} unread`}>{unreadCount}</i>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="support-card">
          <strong>Demo, by design</strong>
          <span>Fictional funds. No real payments.</span>
          <button onClick={onSafetyInfo} type="button">
            Safety information ↗
          </button>
        </div>

        <div className="profile-row">
          <div className="avatar" aria-hidden="true">{userInitial}</div>
          <div className="profile-text">
            <strong>{user.name || 'GenZ member'}</strong>
            <span>{user.email}</span>
          </div>
          <button onClick={onSignOut} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
