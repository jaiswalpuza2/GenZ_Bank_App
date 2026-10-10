import { Download, Search } from 'lucide-react';
import { useState } from 'react';
import type { AccountData } from '../types';
import { PageTitle } from '../components/ui/PageTitle';
import { TransactionList } from '../components/transactions/TransactionList';
import { exportTransactionsCsv } from '../lib/csv';

interface TransactionsPageProps {
  data: AccountData;
}

export function TransactionsPage({ data }: TransactionsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = data.transactions.filter(tx =>
    (tx.description + tx.reference + tx.type)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageTitle
        title="Transactions"
        subtitle="Search and export your simulated account history."
      />

      <section className="panel">
        <div className="transaction-toolbar">
          <div className="search-box">
            <Search size={16} aria-hidden="true" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search description or reference…"
              aria-label="Search transactions"
            />
          </div>
          <button
            className="btn-secondary compact"
            onClick={() => exportTransactionsCsv(data.transactions)}
            type="button"
          >
            <Download size={15} aria-hidden="true" /> Export CSV
          </button>
        </div>

        <TransactionList transactions={filteredTransactions} />

        <div className="list-footer" aria-live="polite">
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? 's' : ''} shown · Amounts in NPR
        </div>
      </section>
    </>
  );
}
