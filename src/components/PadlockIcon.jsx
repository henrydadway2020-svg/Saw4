export default function PadlockIcon({ locked = true, className = '', animate = false }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`${className} ${animate ? 'animate-unlock' : ''}`}
      style={{ transformOrigin: '38px 20px' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="20" width="32" height="24" rx="3"
        fill={locked ? 'var(--color-steel)' : 'var(--color-toxin)'}
        stroke={locked ? 'var(--color-muted-2)' : 'var(--color-toxin-bright)'}
        strokeWidth="1.5" />
      {locked ? (
        <path d="M16 20V13a8 8 0 0 1 16 0v7" stroke="var(--color-muted)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M16 20V13a8 8 0 0 1 16 0" stroke="var(--color-toxin-bright)" strokeWidth="3.5" strokeLinecap="round" fill="none" transform="rotate(-25 32 13)" />
      )}
      <circle cx="24" cy="30" r="3" fill={locked ? 'var(--color-blood)' : 'var(--color-void)'} />
      <rect x="22.5" y="30" width="3" height="7" rx="1.5" fill={locked ? 'var(--color-blood)' : 'var(--color-void)'} />
    </svg>
  );
}
