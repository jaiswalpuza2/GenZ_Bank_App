interface ToggleProps {
  title: string;
  detail: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ title, detail, checked, onChange }: ToggleProps) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        className={'switch ' + (checked ? 'switch-on' : '')}
        onClick={() => onChange(!checked)}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}
