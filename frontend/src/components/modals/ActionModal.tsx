import { ShieldCheck, X } from 'lucide-react';
import type { ModalKind } from '../../types';

interface ActionModalProps {
  kind: Exclude<ModalKind, null>;
  busy: boolean;
  // deposit / withdrawal / contribute fields
  amount: string;
  description: string;
  // goal fields
  goalName: string;
  target: string;
  targetDate: string;
  onAmountChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onGoalNameChange: (v: string) => void;
  onTargetChange: (v: string) => void;
  onTargetDateChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

const MODAL_TITLES: Record<Exclude<ModalKind, null>, string> = {
  deposit: 'Demo deposit',
  withdrawal: 'Demo withdrawal',
  goal: 'Create a savings goal',
  contribute: 'Add a contribution',
};

export function ActionModal({
  kind,
  busy,
  amount,
  description,
  goalName,
  target,
  targetDate,
  onAmountChange,
  onDescriptionChange,
  onGoalNameChange,
  onTargetChange,
  onTargetDateChange,
  onConfirm,
  onClose,
}: ActionModalProps) {
  const confirmLabel = busy
    ? 'Processing…'
    : kind === 'deposit'
      ? 'Confirm demo deposit'
      : kind === 'withdrawal'
        ? 'Confirm demo withdrawal'
        : kind === 'goal'
          ? 'Create goal'
          : 'Confirm demo contribution';

  return (
    <div
      className="modal-backdrop"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            <div className="eyebrow">SIMULATED OPERATION</div>
            <h2 id="modal-title">{MODAL_TITLES[kind]}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <p className="modal-disclaimer">
          This changes simulated demo data only. No real money moves.
        </p>

        {kind === 'goal' ? (
          <GoalForm
            goalName={goalName}
            target={target}
            targetDate={targetDate}
            busy={busy}
            onGoalNameChange={onGoalNameChange}
            onTargetChange={onTargetChange}
            onTargetDateChange={onTargetDateChange}
            onConfirm={onConfirm}
            confirmLabel={confirmLabel}
          />
        ) : (
          <MovementForm
            kind={kind}
            amount={amount}
            description={description}
            busy={busy}
            onAmountChange={onAmountChange}
            onDescriptionChange={onDescriptionChange}
            onConfirm={onConfirm}
            confirmLabel={confirmLabel}
          />
        )}

        <div className="modal-secure">
          <ShieldCheck size={14} /> Recorded only in your simulated account ledger
        </div>
      </section>
    </div>
  );
}

// ─── Sub-forms ────────────────────────────────────────────────────────────────

interface MovementFormProps {
  kind: 'deposit' | 'withdrawal' | 'contribute';
  amount: string;
  description: string;
  busy: boolean;
  onAmountChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onConfirm: () => void;
  confirmLabel: string;
}

function MovementForm({
  kind,
  amount,
  description,
  busy,
  onAmountChange,
  onDescriptionChange,
  onConfirm,
  confirmLabel,
}: MovementFormProps) {
  return (
    <div className="form-stack">
      <label>
        Amount (NPR)
        <div className="amount-input">
          <span>Rs.</span>
          <input
            autoFocus
            type="number"
            min="0.01"
            step="0.01"
            max="500000"
            value={amount}
            onChange={e => onAmountChange(e.target.value)}
            placeholder="0.00"
            aria-label="Amount in NPR"
          />
        </div>
      </label>

      {kind !== 'contribute' && (
        <label>
          Description (optional)
          <input
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            maxLength={100}
            placeholder="What is this for?"
          />
        </label>
      )}

      <div className="amount-shortcuts" role="group" aria-label="Quick amount shortcuts">
        {QUICK_AMOUNTS.map(v => (
          <button key={v} type="button" onClick={() => onAmountChange(String(v))}>
            Rs. {v.toLocaleString('en-NP')}
          </button>
        ))}
      </div>

      <button
        className="btn-primary full"
        disabled={busy}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </button>
    </div>
  );
}

interface GoalFormProps {
  goalName: string;
  target: string;
  targetDate: string;
  busy: boolean;
  onGoalNameChange: (v: string) => void;
  onTargetChange: (v: string) => void;
  onTargetDateChange: (v: string) => void;
  onConfirm: () => void;
  confirmLabel: string;
}

function GoalForm({
  goalName,
  target,
  targetDate,
  busy,
  onGoalNameChange,
  onTargetChange,
  onTargetDateChange,
  onConfirm,
  confirmLabel,
}: GoalFormProps) {
  return (
    <div className="form-stack">
      <label>
        Goal name
        <input
          value={goalName}
          onChange={e => onGoalNameChange(e.target.value)}
          maxLength={60}
          placeholder="e.g. New laptop"
          autoFocus
        />
      </label>
      <label>
        Target amount (NPR)
        <input
          type="number"
          min="1"
          value={target}
          onChange={e => onTargetChange(e.target.value)}
          placeholder="50000"
        />
      </label>
      <label>
        Target date
        <input
          type="date"
          value={targetDate}
          onChange={e => onTargetDateChange(e.target.value)}
        />
      </label>
      <button
        className="btn-primary full"
        disabled={busy}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
