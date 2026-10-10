import { Download } from 'lucide-react';
import type { AccountData } from '../types';
import { formatMoney, formatDate } from '../lib/format';
import { PageTitle } from '../components/ui/PageTitle';
import { TransactionList } from '../components/transactions/TransactionList';
import { exportTransactionsCsv } from '../lib/csv';

interface AccountsPageProps {
  data: AccountData;
  balanceHidden: boolean;
}

export function AccountsPage({ data, balanceHidden }: AccountsPageProps) {
  const displayBalance = balanceHidden
    ? 'NPR ••••••'
    : formatMoney(data.account.balancePaisa);

  return (
    <>
      <PageTitle
        title="Your accounts"
        subtitle="Manage your fictional GenZ Bank demo account."
      />

      <section className="panel account-detail" aria-label="Account details">
        <div className="account-visual" aria-hidden="true">
          <div className="brand">
            <div className="brand-mark small">G</div>
            <span>genzbank</span>
          </div>
          <span className="demo-pill">DEMO</span>
          <div className="account-visual-number">{data.account.id}</div>
          <span className="account-visual-label">DEMO ACCOUNT IDENTIFIER</span>
        </div>

        <div className="account-properties">
          <div>
            <span>Nickname</span>
            <strong>{data.account.nickname}</strong>
          </div>
          <div>
            <span>Available demo balance</span>
            <strong>{displayBalance}</strong>
          </div>
          <div>
            <span>Currency</span>
            <strong>NPR · Nepalese rupee</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>
              <span className="status-dot" aria-hidden="true" />{' '}
              {data.account.status}
            </strong>
          </div>
          <div>
            <span>Opened</span>
            <strong>{formatDate(data.account.createdAt)}</strong>
          </div>
        </div>

        <p className="fine-print">
          This identifier is fictional and is not connected to a real bank or
          payment network.
        </p>
      </section>

      <div className="section-heading">
        <div>
          <h2>Account activity</h2>
          <p>Transactions for this demo account.</p>
        </div>
        <button
          className="btn-secondary compact"
          onClick={() => exportTransactionsCsv(data.transactions)}
          type="button"
        >
          <Download size={15} aria-hidden="true" /> Export CSV
        </button>
      </div>

      <section className="panel">
        <TransactionList transactions={data.transactions.slice(0, 10)} />
      </section>
    </>
  );
}
