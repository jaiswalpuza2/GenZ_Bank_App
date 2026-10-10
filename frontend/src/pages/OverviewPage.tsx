import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  Target,
} from 'lucide-react';
import type { AccountData, ModalKind, PageName } from '../types';
import { formatMoney } from '../lib/format';
import { TransactionList } from '../components/transactions/TransactionList';
import { GoalRow } from '../components/goals/GoalRow';

interface OverviewPageProps {
  data: AccountData;
  balanceHidden: boolean;
  onToggleBalanceVisibility: () => void;
  onNavigate: (page: PageName) => void;
  onOpenModal: (kind: Exclude<ModalKind, null>, goalId?: string) => void;
}

export function OverviewPage({
  data,
  balanceHidden,
  onToggleBalanceVisibility,
  onNavigate,
  onOpenModal,
}: OverviewPageProps) {
  const displayBalance = balanceHidden
    ? 'NPR ••••••'
    : formatMoney(data.account.balancePaisa);

  const totalDeposits = data.transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amountPaisa, 0);

  const totalAllocated = data.transactions
    .filter(t => t.type !== 'deposit')
    .reduce((sum, t) => sum + t.amountPaisa, 0);

  const allocationRatio = totalDeposits > 0
    ? Math.min(100, (totalAllocated / totalDeposits) * 100)
    : 0;

  const firstName = (data.user.name || 'there').split(' ')[0];

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">✦ YOUR MONEY, IN FOCUS</div>
          <h1>
            Good day, {firstName}{' '}
            <span className="wave" aria-hidden="true">✳</span>
          </h1>
          <p>Here's what's happening with your demo finances.</p>
        </div>
        <div className="date-chip" aria-label="Account active">
          <span className="green-dot" aria-hidden="true" /> Demo account active
        </div>
      </div>

      {/* Balance summary */}
      <div className="balance-grid">
        <section className="balance-card" aria-label="Account balance">
          <div className="balance-card-head">
            <span>Total demo balance</span>
            <button
              className="visibility-btn"
              onClick={onToggleBalanceVisibility}
              aria-label={balanceHidden ? 'Show balance' : 'Hide balance'}
            >
              {balanceHidden ? <Eye size={15} /> : <EyeOff size={15} />}{' '}
              {balanceHidden ? 'Show' : 'Hide'}
            </button>
          </div>
          <div className="balance-amount">{displayBalance}</div>
          <div className="balance-foot">
            <span>
              <span className="balance-pip" aria-hidden="true" />{' '}
              {data.account.nickname}
            </span>
            <span aria-label="Account last 4 digits">
              •• {data.account.id.slice(-4)}
            </span>
          </div>
          <div className="balance-decoration" aria-hidden="true" />
        </section>

        <section className="metric-card" aria-label="Total deposits">
          <div className="metric-top">
            <span>Demo deposits</span>
            <span className="metric-icon mint" aria-hidden="true">
              <ArrowDownLeft size={17} />
            </span>
          </div>
          <strong>{formatMoney(totalDeposits)}</strong>
          <span className="metric-note">Recorded deposits</span>
          <div className="metric-spark" aria-hidden="true">
            <span /><span /><span /><span />
            <span /><span /><span /><span />
          </div>
        </section>

        <section className="metric-card" aria-label="Money allocated">
          <div className="metric-top">
            <span>Money allocated</span>
            <span className="metric-icon purple" aria-hidden="true">
              <Target size={17} />
            </span>
          </div>
          <strong>{formatMoney(totalAllocated)}</strong>
          <span className="metric-note">Withdrawals &amp; contributions</span>
          <div
            className="metric-progress"
            role="progressbar"
            aria-valuenow={Math.round(allocationRatio)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: allocationRatio + '%' }} />
          </div>
        </section>
      </div>

      {/* Quick actions */}
      <div className="section-heading">
        <div>
          <h2>Quick actions</h2>
          <p>Make a move in your demo account.</p>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => onOpenModal('deposit')} type="button">
          <span className="action-icon green" aria-hidden="true">
            <ArrowDownLeft />
          </span>
          <span>
            <strong>Demo deposit</strong>
            <small>Add simulated funds</small>
          </span>
          <ArrowUpRight className="action-arrow" size={16} aria-hidden="true" />
        </button>
        <button onClick={() => onOpenModal('withdrawal')} type="button">
          <span className="action-icon lavender" aria-hidden="true">
            <ArrowUpRight />
          </span>
          <span>
            <strong>Demo withdrawal</strong>
            <small>Withdraw simulated funds</small>
          </span>
          <ArrowUpRight className="action-arrow" size={16} aria-hidden="true" />
        </button>
        <button onClick={() => onNavigate('Savings goals')} type="button">
          <span className="action-icon amber" aria-hidden="true">
            <Target />
          </span>
          <span>
            <strong>Savings goals</strong>
            <small>Build a saving habit</small>
          </span>
          <ArrowUpRight className="action-arrow" size={16} aria-hidden="true" />
        </button>
        <button onClick={() => onNavigate('Transactions')} type="button">
          <span className="action-icon blue" aria-hidden="true">
            <Download />
          </span>
          <span>
            <strong>Statements</strong>
            <small>View or export activity</small>
          </span>
          <ArrowUpRight className="action-arrow" size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Recent activity + goals */}
      <div className="lower-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Your latest demo transactions</p>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate('Transactions')}
              type="button"
            >
              View all ↗
            </button>
          </div>
          <TransactionList transactions={data.transactions.slice(0, 5)} />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Savings goals</h2>
              <p>Small steps add up</p>
            </div>
            <button
              className="round-add"
              onClick={() => onOpenModal('goal')}
              aria-label="Create new savings goal"
              type="button"
            >
              <Plus size={17} />
            </button>
          </div>
          {data.goals.map(goal => (
            <GoalRow
              key={goal.id}
              goal={goal}
              onContribute={() => onOpenModal('contribute', goal.id)}
            />
          ))}
          <button
            className="outline-wide"
            onClick={() => onNavigate('Savings goals')}
            type="button"
          >
            Manage goals ↗
          </button>
        </section>
      </div>

      <div className="disclaimer-line" role="note">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>
          <strong>Demo, by design.</strong> Your balance and transactions are
          fictional and have no cash value. No real deposits or withdrawals occur.
        </span>
      </div>
    </>
  );
}
