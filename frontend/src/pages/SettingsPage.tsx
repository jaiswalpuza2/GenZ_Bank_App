import type { AccountData } from '../types';
import { PageTitle } from '../components/ui/PageTitle';

interface SettingsPageProps {
  data: AccountData;
  isDark: boolean;
  balanceHidden: boolean;
  onToggleTheme: () => void;
  onToggleBalanceVisibility: () => void;
  onSignOut: () => void;
  onSafetyInfo: () => void;
}

export function SettingsPage({
  data: _data,
  isDark,
  balanceHidden,
  onToggleTheme,
  onToggleBalanceVisibility,
  onSignOut,
  onSafetyInfo,
}: SettingsPageProps) {
  return (
    <>
      <PageTitle
        title="Settings"
        subtitle="Preferences for your GenZ Bank demo."
      />

      <section className="panel settings-panel" aria-label="Settings">
        <div className="settings-item">
          <div className="settings-icon" aria-hidden="true">
            {isDark ? '🌙' : '☀️'}
          </div>
          <div>
            <strong>Appearance</strong>
            <span>Choose a comfortable theme.</span>
          </div>
          <button
            className="btn-secondary compact"
            onClick={onToggleTheme}
            type="button"
          >
            {isDark ? 'Dark mode' : 'Light mode'}
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-icon" aria-hidden="true">
            👁
          </div>
          <div>
            <strong>Balance privacy</strong>
            <span>Hide balances on this screen.</span>
          </div>
          <button
            className="btn-secondary compact"
            onClick={onToggleBalanceVisibility}
            type="button"
          >
            {balanceHidden ? 'Show balances' : 'Hide balances'}
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-icon" aria-hidden="true">
            🛡
          </div>
          <div>
            <strong>Demo &amp; privacy notice</strong>
            <span>
              Never enter real card numbers, PINs, or banking passwords.
            </span>
          </div>
          <button
            className="settings-badge"
            onClick={onSafetyInfo}
            type="button"
          >
            Demo only
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-icon" aria-hidden="true">
            🚪
          </div>
          <div>
            <strong>Sign out</strong>
            <span>End your authenticated session.</span>
          </div>
          <button
            className="btn-danger compact"
            onClick={onSignOut}
            type="button"
          >
            Sign out
          </button>
        </div>
      </section>
    </>
  );
}
