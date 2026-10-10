import {
  ArrowUpRight,
  Moon,
  ShieldCheck,
  Sun,
  Target,
  Wallet,
} from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandMark';

interface LandingPageProps {
  isDark: boolean;
  isBusy: boolean;
  onToggleTheme: () => void;
  onSignIn: () => void;
}

export function LandingPage({
  isDark,
  isBusy,
  onToggleTheme,
  onSignIn,
}: LandingPageProps) {
  return (
    <div className={'public-shell ' + (isDark ? 'theme-dark' : 'theme-light')}>
      <header className="public-nav">
        <BrandLogo />
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun /> : <Moon />}
        </button>
      </header>

      <main className="hero">
        <div className="hero-copy">
          <div className="eyebrow">✦ BANKING AT YOUR SPEED</div>
          <h1>
            Your money.
            <br />
            <span>Your rules.</span>
            <br />
            Your future.
          </h1>
          <p>
            A smarter way to explore your finances. Practice everyday money
            habits in a safe, simulated digital banking experience.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              disabled={isBusy}
              onClick={onSignIn}
            >
              {isBusy ? 'Connecting…' : 'Open a demo account'}{' '}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <button
              className="btn-secondary"
              disabled={isBusy}
              onClick={onSignIn}
            >
              Sign in
            </button>
          </div>
          <div className="trust-row">
            <span>
              <ShieldCheck size={15} aria-hidden="true" /> Secure sign-in
            </span>
            <span>Demo only · No real funds</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-card">
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
                <small>ACCOUNT HOLDER</small>
                <strong>GENZ MEMBER</strong>
              </div>
              <strong>◉</strong>
            </div>
          </div>
          <div className="float-note">
            <span className="green-dot" />
            <div>
              <small>Money habits</small>
              <strong>Built around you</strong>
            </div>
          </div>
        </div>
      </main>

      <section className="feature-strip" aria-label="Key features">
        <div>
          <Wallet aria-hidden="true" />
          <strong>Money, made clear</strong>
          <span>See demo balance and activity at a glance.</span>
        </div>
        <div>
          <Target aria-hidden="true" />
          <strong>Goals that feel real</strong>
          <span>Practice saving toward what matters to you.</span>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" />
          <strong>Safe to explore</strong>
          <span>No real funds, cards, or payment networks.</span>
        </div>
      </section>

      <footer className="public-footer">
        <span>© 2026 GenZ Bank · Banking at Your Speed.</span>
        <span>Demo platform · Not a licensed bank</span>
      </footer>
    </div>
  );
}
