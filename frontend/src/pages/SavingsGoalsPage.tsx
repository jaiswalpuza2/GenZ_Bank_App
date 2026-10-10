import { Plus, Target } from 'lucide-react';
import type { AccountData, ModalKind } from '../types';
import { formatMoney, formatDate } from '../lib/format';
import { PageTitle } from '../components/ui/PageTitle';

interface SavingsGoalsPageProps {
  data: AccountData;
  onOpenModal: (kind: Exclude<ModalKind, null>, goalId?: string) => void;
}

export function SavingsGoalsPage({ data, onOpenModal }: SavingsGoalsPageProps) {
  return (
    <>
      <PageTitle
        title="Savings goals"
        subtitle="Give your plans a name and watch your progress grow."
        action={
          <button
            className="btn-primary compact"
            onClick={() => onOpenModal('goal')}
            type="button"
          >
            <Plus size={15} aria-hidden="true" /> New goal
          </button>
        }
      />

      {data.goals.length === 0 ? (
        <div className="empty-state">
          <div>
            <Target size={22} />
          </div>
          <p>No goals yet. Create your first one to start saving.</p>
        </div>
      ) : (
        <div className="goals-grid">
          {data.goals.map(goal => {
            const pct = goal.targetPaisa > 0
              ? Math.min(100, (goal.savedPaisa / goal.targetPaisa) * 100)
              : 0;

            return (
              <section className="panel goal-card-large" key={goal.id} aria-label={`Goal: ${goal.name}`}>
                <div className="goal-large-icon" aria-hidden="true">
                  <Target />
                </div>
                <div className="goal-card-top">
                  <div>
                    <h2>{goal.name}</h2>
                    <p>
                      {goal.targetDate
                        ? 'Target · ' + formatDate(goal.targetDate)
                        : 'Your personal savings target'}
                    </p>
                  </div>
                  <span className="goal-percent" aria-label={`${Math.round(pct)}% saved`}>
                    {Math.round(pct)}%
                  </span>
                </div>
                <div className="goal-big-numbers">
                  <strong>{formatMoney(goal.savedPaisa)}</strong>
                  <span>of {formatMoney(goal.targetPaisa)}</span>
                </div>
                <div
                  className="goal-track"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ width: pct + '%' }} />
                </div>
                <button
                  className="outline-wide"
                  onClick={() => onOpenModal('contribute', goal.id)}
                  type="button"
                >
                  Add demo contribution ↗
                </button>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
