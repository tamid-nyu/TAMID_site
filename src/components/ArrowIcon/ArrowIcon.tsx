interface ArrowIconProps {
  angle?: number;
  className?: string;
  direction?: 'left' | 'right';
}

export const ArrowIcon = ({ angle, className = '', direction = 'right' }: ArrowIconProps) => {
  const resolvedAngle = angle ?? (direction === 'left' ? 180 : 0);

  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={resolvedAngle !== 0 ? { transform: `rotate(${resolvedAngle}deg)` } : undefined}
    >
      <path
        d="M2.5 8h9.5M8.5 4.5L12 8l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
