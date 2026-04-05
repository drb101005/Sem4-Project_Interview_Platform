'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function ResultsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/interviews/${id}/results`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!data) return <p className="p-6 text-slate">Loading results...</p>;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-ink">Results</h1>
        <p className="text-slate">Overall score</p>
        <p className="text-4xl font-bold text-ink mt-2">{data.total_score.toFixed(1)}</p>
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-ink">Per Question Feedback</h2>
        {data.questions.map((q: any, idx: number) => (
          <div key={idx} className="card p-5">
            <p className="text-sm text-slate">Question</p>
            <p className="font-semibold text-ink">{q.question}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs text-slate">Transcript</p>
                <p className="text-sm text-ink">{q.transcript || 'No transcript available'}</p>
              </div>
              <div>
                <p className="text-xs text-slate">Score</p>
                <p className="text-lg font-semibold text-ink">{q.score.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-slate">Feedback</p>
                <p className="text-sm text-ink">{q.feedback || 'No feedback available yet.'}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-ink">Speech Metrics</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {data.speechMetrics.map((m: any, idx: number) => (
            <div key={idx} className="card p-4">
              <p className="text-sm text-slate">Answer {idx + 1}</p>
              <p className="text-sm text-ink">WPM: {m.wpm}</p>
              <p className="text-sm text-ink">Pauses: {m.pauses}</p>
              <p className="text-sm text-ink">Fillers: {m.fillers}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
