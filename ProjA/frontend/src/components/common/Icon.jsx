const paths = {
  sparkles:
    "M9 2l1.2 3.6L13.8 7 10.2 8.4 9 12l-1.2-3.6L4.2 7l3.6-1.4L9 2zM17 12l.8 2.4L20.2 15l-2.4.8L17 18.2l-.8-2.4L13.8 15l2.4-.6L17 12z",
  lightbulb:
    "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.3.2.5.6.5 1v.6h6v-.6c0-.4.2-.8.5-1A6 6 0 0 0 12 3z",
  chart: "M4 19V10M10 19V5M16 19v-7M22 19H2",
  target:
    "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2z",
  upload: "M12 16V4M12 4l-4 4M12 4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  trendUp: "M3 17l6-6 4 4 8-8M21 7h-6v6",
  wallet:
    "M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 13h2",
  alert: "M12 9v4M12 17h.01M10.3 3.9 2.7 17a1.7 1.7 0 0 0 1.5 2.6h15.6a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0z",
  piggy: "M19 9V7a2 2 0 0 0-2-2h-1.2A5 5 0 0 0 9 6H7a2 2 0 0 0-2 2v1l-2 2 2 1v3a2 2 0 0 0 2 2h1v2h3v-2h3v2h3v-2.5A4 4 0 0 0 19 13v-1h1z",
  check: "M20 6 9 17l-5-5",
};

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 1.8 }) {
  const d = paths[name] || paths.sparkles;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
