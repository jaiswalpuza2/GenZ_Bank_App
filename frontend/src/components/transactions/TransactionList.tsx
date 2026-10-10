import { ArrowDownLeft, ArrowUpRight, Target } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatMoney, formatDate } from '../../lib/format';

interface TransactionListProps {
  transactions: Transaction[];
}

function transactionIconClass(type: Transaction['type']): string {
  if (type === 'deposit') return 'incoming';
  if (type === 'contribution') return 'goal';
  return 'outgoing';
}

function TransactionIcon({ type }: { type: Transaction['type'] }) {
  const cls = 'transaction-icon ' + transactionIconClass(type);
  if (type === 'deposit') {
    return (
      <div className={cls}>
        <ArrowDownLeft size={17} />
      </div>
    );
  }
  if (type === 'contribution') {
    return (
      <div className={cls}>
        <Target size={17} />
      </div>
    );
  }
  return (
    <div className={cls}>
      <ArrowUpRight size={17} />
    </div>
  );
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div>
          <ArrowDownLeft size={18} />
        </div>
        <p>No transactions yet. Your activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map(tx => (
        <div className="transaction-row" key={tx.id}>
          <TransactionIcon type={tx.type} />
          <div className="transaction-description">
            <strong>{tx.description}</strong>
            <span>
              {formatDate(tx.createdAt)} · {tx.reference}
            </span>
          </div>
          <div className="transaction-amount">
            <strong className={tx.type === 'deposit' ? 'positive' : ''}>
              {tx.type === 'deposit' ? '+' : '−'}
              {formatMoney(tx.amountPaisa)}
            </strong>
            <span>
              <i /> Completed demo
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
