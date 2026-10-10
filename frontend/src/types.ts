// ─── Domain types ────────────────────────────────────────────────────────────
// All monetary amounts are stored in paisa (integer 1/100 NPR) to avoid
// floating-point arithmetic errors in financial calculations.

export type TransactionType = 'deposit' | 'withdrawal' | 'contribution';

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Amount in paisa (integer). Divide by 100 for NPR display. */
  amountPaisa: number;
  description: string;
  /** Unique reference code, e.g. GZ1A2B3C4D */
  reference: string;
  createdAt: string;
  status: 'completed';
}

export interface SavingsGoal {
  id: string;
  name: string;
  /** Target amount in paisa */
  targetPaisa: number;
  /** Amount saved so far in paisa */
  savedPaisa: number;
  /** ISO date string, empty string if no target date */
  targetDate: string;
}

export interface Notification {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
}

export interface CardSettings {
  frozen: boolean;
  onlineEnabled: boolean;
  /** Daily spending limit in paisa */
  dailyLimitPaisa: number;
}

export interface AccountInfo {
  id: string;
  nickname: string;
  /** Current balance in paisa */
  balancePaisa: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface AccountData {
  user: UserInfo;
  account: AccountInfo;
  transactions: Transaction[];
  goals: SavingsGoal[];
  notifications: Notification[];
  card: CardSettings;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type PageName =
  | 'Overview'
  | 'Accounts'
  | 'Transactions'
  | 'Savings goals'
  | 'Virtual card'
  | 'Notifications'
  | 'Settings';

export type ModalKind =
  | 'deposit'
  | 'withdrawal'
  | 'goal'
  | 'contribute'
  | null;
