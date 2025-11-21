import { useState } from 'react';

interface GlassCircleButtonProps {
  icon: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export default function GlassCircleButton({
  icon,
  label = '',
  className = '',
  onClick,
}: GlassCircleButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-center
        rounded-full text-base font-medium
        shadow-lg border border-white/30 bg-white
        overflow-hidden transition-all duration-300
        h-15
        ${hovered ? 'px-4 w-37 gap-2' : 'w-15 justify-center'}
        ${className}
      `}
      style={{ whiteSpace: 'nowrap' }}
    >
      <div className="text-xl">{icon}</div>

      <span
        className={`
          transition-opacity duration-500
          ${hovered ? 'opacity-100 ml-2' : 'opacity-0 w-0'}
        `}
      >
        {label}
      </span>
    </button>
  );
}
