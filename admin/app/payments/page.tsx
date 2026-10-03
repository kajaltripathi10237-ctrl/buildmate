export default function PaymentsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Stat title="Gross volume" value="$248k" />
        <Stat title="Pending" value="$18.4k" />
        <Stat title="Settled" value="$213k" />
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
