interface BrandMarkProps {
  size?: 'small' | 'default' | 'large';
}

export function BrandMark({ size = 'default' }: BrandMarkProps) {
  return <div className={'brand-mark ' + (size !== 'default' ? size : '')}>G</div>;
}

export function BrandLogo() {
  return (
    <div className="brand">
      <BrandMark />
      <span>
        genz<span className="brand-light">bank</span>
      </span>
    </div>
  );
}
