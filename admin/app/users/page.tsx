const users = [
  { name: 'Alicia Reed', role: 'Admin', status: 'Verified' },
  { name: 'Marcus Lee', role: 'Contractor', status: 'Active' },
  { name: 'Sonia Shah', role: 'Worker', status: 'Onboarding' },
];

export default function UsersPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-slate-900">Users</h1>
      <div className="mt-8 space-y-4">
        {users.map((user) => (
          <div key={user.name} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.role}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">{user.status}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
