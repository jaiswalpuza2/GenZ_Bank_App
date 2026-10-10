import { useEffect, useRef, useState } from 'react';
import type { AccountData, ModalKind, PageName } from './types';
import {
  fetchAccountData,
  getAuthUser,
  signIn,
  signOut,
  recordMoneyMovement,
  createSavingsGoal,
  contributeToGoal,
  updateCardSettings,
  markAllNotificationsRead,
} from './lib/api';
import { extractErrorMessage } from './lib/format';

import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Toast } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ActionModal } from './components/modals/ActionModal';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { AccountsPage } from './pages/AccountsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SavingsGoalsPage } from './pages/SavingsGoalsPage';
import { VirtualCardPage } from './pages/VirtualCardPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

// ─── Bootstrap screen ────────────────────────────────────────────────────────

function BootScreen() {
  return (
    <div className="boot" role="status" aria-label="Loading GenZ Bank">
      <div className="brand-mark large">G</div>
      <p>Preparing your GenZ experience…</p>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageName>('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal state
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [activeGoalId, setActiveGoalId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(''), 3500);
  };

  const refreshData = async () => {
    const fresh = await fetchAccountData();
    setData(fresh);
  };

  const openModal = (kind: Exclude<ModalKind, null>, goalId = '') => {
    setModalKind(kind);
    setActiveGoalId(goalId);
    setAmount('');
    setDescription('');
  };

  const closeModal = () => setModalKind(null);

  // ── Initialisation ─────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const user = await getAuthUser();
        if (user) await refreshData();
      } catch {
        showToast('Could not load account. Sign in again.');
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // ── Auth actions ───────────────────────────────────────────────────────────

  const handleSignIn = async () => {
    setIsBusy(true);
    try {
      await signIn();
      await refreshData();
      showToast('Welcome to your demo account.');
    } catch (error) {
      const err = error as { code?: string };
      if (err.code === 'popup_blocked') {
        showToast('Allow pop-ups to sign in.');
      } else if (err.code === 'popup_closed') {
        showToast('Sign-in cancelled.');
      } else {
        showToast('Sign-in could not be completed.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setData(null);
    setCurrentPage('Overview');
    showToast('Signed out.');
  };

  // ── Money movement ─────────────────────────────────────────────────────────

  const handleMoneyMovement = async () => {
    if (modalKind !== 'deposit' && modalKind !== 'withdrawal') return;
    const amountNpr = Number(amount);
    if (!amountNpr || amountNpr <= 0) {
      showToast('Enter a valid amount.');
      return;
    }
    setIsBusy(true);
    try {
      const result = await recordMoneyMovement(modalKind, amountNpr, description);
      await refreshData();
      closeModal();
      showToast('Demo operation recorded: ' + result.transaction.reference);
    } catch (error) {
      showToast(extractErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreateGoal = async () => {
    const amountNpr = Number(goalTarget);
    if (!goalName.trim()) {
      showToast('Enter a name for your goal.');
      return;
    }
    if (!amountNpr || amountNpr <= 0) {
      showToast('Enter a valid target amount.');
      return;
    }
    setIsBusy(true);
    try {
      await createSavingsGoal(goalName.trim(), amountNpr, goalTargetDate);
      await refreshData();
      closeModal();
      setGoalName('');
      setGoalTarget('');
      setGoalTargetDate('');
      showToast('Savings goal created.');
    } catch (error) {
      showToast(extractErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  };

  const handleContribute = async () => {
    const amountNpr = Number(amount);
    if (!amountNpr || amountNpr <= 0) {
      showToast('Enter a valid contribution amount.');
      return;
    }
    setIsBusy(true);
    try {
      await contributeToGoal(activeGoalId, amountNpr);
      await refreshData();
      closeModal();
      showToast('Demo contribution recorded.');
    } catch (error) {
      showToast(extractErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  };

  // Modal confirm dispatcher
  const handleModalConfirm = () => {
    if (modalKind === 'deposit' || modalKind === 'withdrawal') {
      void handleMoneyMovement();
    } else if (modalKind === 'goal') {
      void handleCreateGoal();
    } else if (modalKind === 'contribute') {
      void handleContribute();
    }
  };

  // ── Card & notifications ───────────────────────────────────────────────────

  const handleCardUpdate = async (changes: Record<string, unknown>) => {
    try {
      await updateCardSettings(
        changes as Partial<{
          frozen: boolean;
          onlineEnabled: boolean;
          dailyLimit: number;
        }>
      );
      await refreshData();
      showToast('Demo card settings saved.');
    } catch (error) {
      showToast(extractErrorMessage(error));
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllNotificationsRead();
      await refreshData();
    } catch (error) {
      showToast(extractErrorMessage(error));
    }
  };

  const navigate = (page: PageName) => {
    setCurrentPage(page);
    setMobileNavOpen(false);
  };

  const unreadCount = data?.notifications.filter(n => !n.read).length ?? 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) return <BootScreen />;

  if (!data) {
    return (
      <ErrorBoundary>
        <LandingPage
          isDark={isDark}
          isBusy={isBusy}
          onToggleTheme={() => setIsDark(d => !d)}
          onSignIn={() => void handleSignIn()}
        />
        {toastMessage && (
          <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
        )}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={'bank-app ' + (isDark ? 'theme-dark' : 'theme-light')}>
        <Sidebar
          user={data.user}
          currentPage={currentPage}
          unreadCount={unreadCount}
          isOpen={mobileNavOpen}
          onNavigate={navigate}
          onClose={() => setMobileNavOpen(false)}
          onSignOut={() => void handleSignOut()}
          onSafetyInfo={() =>
            showToast('Never enter real payment credentials in this demo.')
          }
        />

        {mobileNavOpen && (
          <button
            className="nav-backdrop"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <main className="main-area">
          <Topbar
            user={data.user}
            currentPage={currentPage}
            unreadCount={unreadCount}
            isDark={isDark}
            onToggleTheme={() => setIsDark(d => !d)}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onOpenNotifications={() => navigate('Notifications')}
          />

          <div className="page-content">
            {currentPage === 'Overview' && (
              <OverviewPage
                data={data}
                balanceHidden={balanceHidden}
                onToggleBalanceVisibility={() => setBalanceHidden(h => !h)}
                onNavigate={navigate}
                onOpenModal={openModal}
              />
            )}
            {currentPage === 'Accounts' && (
              <AccountsPage data={data} balanceHidden={balanceHidden} />
            )}
            {currentPage === 'Transactions' && (
              <TransactionsPage data={data} />
            )}
            {currentPage === 'Savings goals' && (
              <SavingsGoalsPage data={data} onOpenModal={openModal} />
            )}
            {currentPage === 'Virtual card' && (
              <VirtualCardPage data={data} onCardUpdate={handleCardUpdate} />
            )}
            {currentPage === 'Notifications' && (
              <NotificationsPage
                data={data}
                onMarkAllRead={() => void handleMarkAllNotificationsRead()}
              />
            )}
            {currentPage === 'Settings' && (
              <SettingsPage
                data={data}
                isDark={isDark}
                balanceHidden={balanceHidden}
                onToggleTheme={() => setIsDark(d => !d)}
                onToggleBalanceVisibility={() => setBalanceHidden(h => !h)}
                onSignOut={() => void handleSignOut()}
                onSafetyInfo={() =>
                  showToast(
                    'Never enter real payment credentials in this demo.'
                  )
                }
              />
            )}
          </div>

          <footer className="app-footer">
            <span>© 2026 GenZ Bank</span>
            <span>
              Banking at Your Speed{' '}
              <i aria-hidden="true" />{' '}
              Demo platform only
            </span>
            <button
              type="button"
              onClick={() =>
                showToast('GenZ Bank is not a licensed financial institution.')
              }
            >
              About this demo ↗
            </button>
          </footer>
        </main>

        {modalKind && (
          <ActionModal
            kind={modalKind}
            busy={isBusy}
            amount={amount}
            description={description}
            goalName={goalName}
            target={goalTarget}
            targetDate={goalTargetDate}
            onAmountChange={setAmount}
            onDescriptionChange={setDescription}
            onGoalNameChange={setGoalName}
            onTargetChange={setGoalTarget}
            onTargetDateChange={setGoalTargetDate}
            onConfirm={handleModalConfirm}
            onClose={closeModal}
          />
        )}

        {toastMessage && (
          <Toast
            message={toastMessage}
            onDismiss={() => setToastMessage('')}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
