import type { AccountData } from '../types';
import { PageTitle } from '../components/ui/PageTitle';
import { Toggle } from '../components/ui/Toggle';

interface VirtualCardPageProps {
  data: AccountData;
  onCardUpdate: (changes: Record<string, unknown>) => void;
}

// Daily limit options in paisa with NPR display labels
const DAILY_LIMIT_OPTIONS = [
  { paisa: 10000, label: 'NPR 100' },
  { paisa: 50000, label: 'NPR 500' },
  { paisa: 100000, label: 'NPR 1,000' },
  { paisa: 500000, label: 'NPR 5,000' },
  { paisa: 1000000, label: 'NPR 10,000' },
];

export function VirtualCardPage({ data, onCardUpdate }: VirtualCardPageProps) {
  const cardholderName = (data.user.name || 'GENZ MEMBER').toUpperCase();

  return (
    <>
      <PageTitle
        title="Your virtual card"
        subtitle="A visual card demo with persisted controls."
      />

      <div className="card-settings-grid">
        {/* Visual card display */}
        <div className="virtual-card" role="img" aria-label="GenZ Bank demo card">
          <div className="card-top">
            <div className="brand">
              <div className="brand-mark small">G</div>
              <span>genzbank</span>
            </div>
            <span className="demo-pill">DEMO</span>
          </div>
          <div className="chip">
            <span />
          </div>
          <div className="hero-card-number">
            •••• &nbsp; •••• &nbsp; •••• &nbsp; 2048
          </div>
          <div className="card-bottom">
            <div>
              <small>CARDHOLDER</small>
              <strong>{cardholderName}</strong>
            </div>
            <div>
              <small>EXPIRES</small>
              <strong>•• / ••</strong>
            </div>
          </div>
          <div className="card-watermark" aria-hidden="true">G</div>
        </div>

        {/* Card controls */}
        <section className="panel card-controls">
          <h2>Card controls</h2>
          <p>Settings are saved to your demo profile.</p>

          <Toggle
            title="Freeze card"
            detail="Temporarily lock this demo card."
            checked={data.card.frozen}
            onChange={frozen => onCardUpdate({ frozen })}
          />

          <Toggle
            title="Online spending"
            detail="Enable simulated online spending."
            checked={data.card.onlineEnabled}
            onChange={onlineEnabled => onCardUpdate({ onlineEnabled })}
          />

          <div className="limit-row">
            <div>
              <strong>Daily demo limit</strong>
              <span>Adjust the simulated card limit.</span>
            </div>
            <select
              value={data.card.dailyLimitPaisa}
              onChange={e =>
                onCardUpdate({ dailyLimit: Number(e.target.value) / 100 })
              }
              aria-label="Daily spending limit"
            >
              {DAILY_LIMIT_OPTIONS.map(opt => (
                <option key={opt.paisa} value={opt.paisa}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>

      <div className="disclaimer-line" role="note">
        This fictional card cannot be used for purchases, ATM access, or real
        payments.
      </div>
    </>
  );
}
