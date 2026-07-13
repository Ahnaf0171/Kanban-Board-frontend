import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "/forever",
    features: [
      "1 board",
      "Unlimited tasks",
      "Image annotation",
      "Community support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    cadence: "/month",
    features: [
      "Unlimited boards",
      "Unlimited image storage",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-ink-muted">
          Start free. Upgrade when your team needs more room.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-8 ${
                plan.highlighted
                  ? "border-signal bg-signal-soft"
                  : "border-line bg-paper"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute right-6">Most popular</Badge>
              )}

              <h3 className="font-medium text-ink">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="mono text-3xl font-semibold text-ink">
                  {plan.price}
                </span>
                <span className="text-sm text-ink-muted">{plan.cadence}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-ink-muted"
                  >
                    <Check size={16} className="text-moss" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/registration" className="mt-8 block">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
