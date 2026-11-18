interface SlidingSwitchOption<T extends string> {
  value: T;
  label: string;
}

interface SlidingSwitchProps<T extends string> {
  value: T;
  options: [SlidingSwitchOption<T>, SlidingSwitchOption<T>];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  showIndicatorDot?: boolean;
  className?: string;
}

export function SlidingSwitch<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  showIndicatorDot = false,
  className = '',
}: SlidingSwitchProps<T>) {
  const isRightActive = value === options[1].value;
  const textSize = size === 'sm' ? 'text-[11px] py-1 px-3' : 'text-[12px] py-1.5 px-3.5';

  return (
    <div
      role="group"
      className={`relative inline-grid grid-cols-2 items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-1 select-none ${className}`}
    >
      {/* Sliding Burgundy Switch Thumb */}
      <span
        aria-hidden="true"
        data-surface="accent"
        className={`btn-accent pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-transform duration-200 ease-out ${
          isRightActive ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            data-surface={active ? 'accent' : undefined}
            className={`relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-center font-semibold transition-colors ${textSize} ${
              active
                ? 'text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {showIndicatorDot && (
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity ${
                  active ? 'bg-white opacity-100' : 'bg-current opacity-35'
                }`}
              />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
