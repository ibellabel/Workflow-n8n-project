export const Logo = ({ variant = 'default' }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-blue-900">
        HM
      </div>
      <span className={`font-bold tracking-tight ${variant === 'compact' ? 'hidden sm:block text-white' : 'text-white'}`}>
        Hire Match
      </span>
    </div>
  );
};
