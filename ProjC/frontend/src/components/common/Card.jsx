export default function Card({ children, className = "", hover = true, as = "div" }) {
  const Component = as;
  return (
    <Component
      className={`bg-surface border border-border rounded-2xl shadow-card ${
        hover ? "transition-shadow duration-300 hover:shadow-card-hover" : ""
      } ${className}`}
    >
      {children}
    </Component>
  );
}
