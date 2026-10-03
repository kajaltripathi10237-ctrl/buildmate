const features = [
  'Job marketplace for contractors and workers',
  'Material and equipment rental marketplace',
  'Attendance, payroll, and escrow workflows',
  'Realtime chat and push notification center',
];

const stats = [
  { label: 'Projects managed', value: '4.8k+' },
  { label: 'Workers onboarded', value: '18k+' },
  { label: 'Escrow protected', value: '$12M+' },
  { label: 'Average response', value: '2.1h' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <div className="text-xl font-black text-slate-900">BuildMate</div>
          <div className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#solutions">Solutions</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white">Get started</button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">Construction workforce platform</p>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-slate-900">Build smarter teams for every jobsite.</h1>
          <p className="mt-6 max-w-lg text-lg text-slate-600">
            BuildMate connects contractors, workers, vendors, and admins through one unified system for jobs, payments, attendance, reporting, and marketplace operations.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="rounded-full bg-sky-700 px-6 py-3 font-semibold text-white">Download app</button>
            <button className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700">Book demo</button>
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-900 p-6 shadow-2xl">
          <div className="rounded-[24px] bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-700" />
              <div>
                <p className="font-bold text-slate-900">BuildMate Control</p>
                <p className="text-sm text-slate-500">Operations overview</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-sky-50 p-4">
                <p className="text-xs uppercase text-sky-700">Open jobs</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">427</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase text-emerald-700">Attendance</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">96.4%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold">Built for every stakeholder</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-700 bg-slate-800 p-5 text-slate-200">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
