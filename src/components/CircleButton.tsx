interface GlassCircleButtonProps {
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCircleButton({
  icon,
  className = '',
  onClick,
}: GlassCircleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-15 h-15 
        flex items-center justify-center
        rounded-full text-xl
        shadow-lg 
        border border-white/30
        bg-white 
        ${className}
      `}
    >
      {icon}
    </button>
  );
}
