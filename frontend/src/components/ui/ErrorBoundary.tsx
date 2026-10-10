import { Component, type ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Top-level error boundary. Catches unexpected render errors and shows a
 * safe fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { hasError: true, message };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="boot">
          <div className="brand-mark large">G</div>
          <p>Something went wrong. Please refresh to continue.</p>
          <p style={{ fontSize: '10px', color: '#555', marginTop: '8px' }}>
            {this.state.message}
          </p>
          <button
            className="btn-secondary compact"
            style={{ marginTop: '16px' }}
            onClick={() => window.location.reload()}
          >
            <ShieldCheck size={14} /> Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
