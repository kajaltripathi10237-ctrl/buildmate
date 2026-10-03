export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard title="Revenue" value="$184,220" />
        <StatCard title="Open jobs" value="427" />
        <StatCard title="Attendance" value="96.4%" />
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
