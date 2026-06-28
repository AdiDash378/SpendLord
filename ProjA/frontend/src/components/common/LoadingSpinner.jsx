export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-20"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-accent-light" />
        <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
      <p className="text-ink-soft font-medium tracking-tight">{label}</p>
    </div>
  );
}
