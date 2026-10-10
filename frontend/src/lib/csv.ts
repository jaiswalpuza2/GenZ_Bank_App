import type { Transaction } from '../types';

/**
 * Generate a CSV statement from a transaction list and trigger a browser download.
 * Amounts are written in NPR (divided by 100 from paisa).
 */
export function exportTransactionsCsv(transactions: Transaction[]): void {
  const header = ['Reference', 'Date', 'Type', 'Description', 'Amount NPR', 'Status'];
  const rows = transactions.map(tx => [
    tx.reference,
    tx.createdAt,
    tx.type,
    tx.description,
    (tx.amountPaisa / 100).toFixed(2),
    tx.status,
  ]);

  const csv = [header, ...rows]
    .map(row =>
      row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'genz-bank-demo-statement.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}
