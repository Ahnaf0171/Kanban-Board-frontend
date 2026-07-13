export function About() {
  return (
    <section id="about" className="border-t border-line bg-paper-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            About us
          </h2>
          <p className="mt-4 text-ink-muted">
            We built this board because task tracking and visual review usually
            live in two different tools. Ours puts them in one — so a task can
            carry an image, and that image can carry annotations, without a
            context switch.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-6">
          {[
            { label: "Boards created", value: "12k+" },
            { label: "Images annotated", value: "48k+" },
            { label: "Avg. setup time", value: "< 2 min" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-line p-4">
              <dt className="mono text-2xl font-semibold text-signal">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-ink-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
