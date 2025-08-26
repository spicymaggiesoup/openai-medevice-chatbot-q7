export function MediBotLogo() {
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bot head circle */}
        <circle cx="40" cy="35" r="25" fill="hsl(var(--primary))" className="drop-shadow-sm" />

        {/* Medical cross on forehead */}
        <rect x="37" y="22" width="6" height="16" rx="1" fill="white" />
        <rect x="32" y="27" width="16" height="6" rx="1" fill="white" />

        {/* Eyes */}
        <circle cx="32" cy="32" r="3" fill="white" />
        <circle cx="48" cy="32" r="3" fill="white" />
        <circle cx="32" cy="32" r="1.5" fill="hsl(var(--primary))" />
        <circle cx="48" cy="32" r="1.5" fill="hsl(var(--primary))" />

        {/* Smile */}
        <path d="M 30 42 Q 40 48 50 42" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Body */}
        <rect x="30" y="55" width="20" height="15" rx="8" fill="hsl(var(--secondary))" className="drop-shadow-sm" />

        {/* Heart on body */}
        <path
          d="M 40 62 C 37 59, 32 59, 32 64 C 32 67, 40 72, 40 72 C 40 72, 48 67, 48 64 C 48 59, 43 59, 40 62 Z"
          fill="white"
        />

        {/* Antennas */}
        <circle cx="35" cy="15" r="2" fill="hsl(var(--accent))" />
        <circle cx="45" cy="15" r="2" fill="hsl(var(--accent))" />
        <line x1="35" y1="17" x2="35" y2="25" stroke="hsl(var(--accent))" strokeWidth="2" />
        <line x1="45" y1="17" x2="45" y2="25" stroke="hsl(var(--accent))" strokeWidth="2" />
      </svg>
    </div>
  )
}
