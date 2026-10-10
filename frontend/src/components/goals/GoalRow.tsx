import { Plus, Target } from 'lucide-react';
import type { SavingsGoal } from '../../types';
import { formatMoney } from '../../lib/format';

interface GoalRowProps {
  goal: SavingsGoal;
  onContribute: () => void;
}

export function GoalRow({ goal, onContribute }: GoalRowProps) {
  const pct = goal.targetPaisa > 0
    ? Math.min(100, (goal.savedPaisa / goal.targetPaisa) * 100)
    : 0;

  return (
    <div className="goal-row">
      <div className="goal-row-top">
        <div className="goal-mini-icon">
          <Target size={16} />
        </div>
        <div className="goal-row-name">
          <strong>{goal.name}</strong>
          <span>
            {formatMoney(goal.savedPaisa)} of {formatMoney(goal.targetPaisa)}
          </span>
        </div>
        <button
          className="goal-add-btn"
          onClick={onContribute}
          aria-label={`Add contribution to ${goal.name}`}
        >
          <Plus size={15} />
        </button>
      </div>
      <div className="goal-track" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: pct + '%' }} />
      </div>
      <div className="goal-row-bottom">
        <span>{Math.round(pct)}% saved</span>
        <span>
          {formatMoney(Math.max(0, goal.targetPaisa - goal.savedPaisa))} to go
        </span>
      </div>
    </div>
  );
}
