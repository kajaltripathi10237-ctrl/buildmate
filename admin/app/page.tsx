import Link from 'next/link';

const cards = [
  { title: 'Users', value: '2,480', href: '/users' },
  { title: 'Active jobs', value: '427', href: '/jobs' },
  { title: 'Payments', value: '$184k', href: '/payments' },
  { title: 'Disputes', value: '12', href: '/dashboard' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl bg-slate-900 p-6 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">BuildMate</p>
            <h1 className="mt-2 text-3xl font-bold">Admin Portal</h1>
          </div>
          <Link href="/dashboard" className="rounded-xl bg-sky-500 px-4 py-2 font-semibold text-white">
            Open dashboard
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg">
              <p className="text-sm text-slate-500">{card.title}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">{card.value}</h2>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
