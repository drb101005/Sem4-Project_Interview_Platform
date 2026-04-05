import Link from 'next/link';

export function InterviewCard({ id, status, type, score }: { id: string; status: string; type: string; score: number }) {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate">{type} Interview</p>
        <p className="font-semibold text-ink">Status: {status}</p>
        <p className="text-sm text-slate">Score: {score.toFixed(1)}</p>
      </div>
      <Link className="btn btn-ghost" href={`/results/${id}`}>
        View Results
      </Link>
    </div>
  );
}
