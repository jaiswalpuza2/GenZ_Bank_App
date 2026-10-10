interface PageTitleProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="page-title-row">
      <div>
        <div className="eyebrow">GENZ BANK · DEMO</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
