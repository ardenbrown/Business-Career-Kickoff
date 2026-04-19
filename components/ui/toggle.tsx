import { cn } from "@/lib/utils";

type ToggleProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function Toggle({ options, value, onChange }: ToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-white/90 p-1 shadow-sm">
      {options.map((option) => (
        <button
          className={cn(
            "rounded-full px-3 py-2 text-sm font-medium transition",
            value === option.value
              ? "bg-primary text-white shadow-soft"
              : "text-muted hover:text-ink",
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
