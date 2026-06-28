import FeatureCard from "./FeatureCard";
import { featureList } from "../../utils/mockData";

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
      <div className="max-w-xl mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Everything you need, nothing you don't
        </h2>
        <p className="mt-3 text-ink-soft">
          Four tools that turn a raw bank statement into a plan you can act on.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featureList.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
