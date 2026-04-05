'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { TopBar } from '@/components/TopBar';
import { StatCard } from '@/components/StatCard';
import { InterviewCard } from '@/components/InterviewCard';

type Interview = {
  id: string;
  status: string;
  type: string;
  total_score: number;
};

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Interview[]>('/interviews')
      .then(setInterviews)
      .catch((err) => setError(err.message));
  }, []);

  const completed = interviews.filter((i) => i.status === 'completed').length;
  const avg = interviews.length
    ? interviews.reduce((acc, i) => acc + (i.total_score || 0), 0) / interviews.length
    : 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <TopBar title="Dashboard" subtitle="Keep your interview practice on track." />
        <Link className="btn btn-primary" href="/setup">
          Start Interview
        </Link>
      </div>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Total Interviews" value={`${interviews.length}`} />
        <StatCard label="Completed" value={`${completed}`} />
        <StatCard label="Average Score" value={`${avg.toFixed(1)}`} />
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-ink">Previous Interviews</h2>
        {interviews.length === 0 ? (
          <div className="card p-6 text-slate">No interviews yet. Start your first one!</div>
        ) : (
          interviews.map((i) => (
            <InterviewCard key={i.id} id={i.id} status={i.status} type={i.type} score={i.total_score || 0} />
          ))
        )}
      </section>
    </main>
  );
}
