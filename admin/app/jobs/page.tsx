const jobs = [
  { id: 'JOB-104', title: 'Commercial framework', status: 'Open', contractor: 'Apex Builders' },
  { id: 'JOB-122', title: 'Electrical maintenance', status: 'In progress', contractor: 'Northco Build' },
  { id: 'JOB-130', title: 'Roadside masonry', status: 'Review', contractor: 'Atlaslane' },
];

export default function JobsPage() {
  return (
    <main className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
        <button className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Create job</button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full text-left">
          <thead className="bg-slate-100 text-sm uppercase text-slate-600">
            <tr>
              <th className="p-4">Job</th>
              <th className="p-4">Contractor</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-slate-200">
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.id}</p>
                </td>
                <td className="p-4 text-slate-700">{job.contractor}</td>
                <td className="p-4">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">{job.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
