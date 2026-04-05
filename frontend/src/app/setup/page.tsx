'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useInterviewStore } from '@/store/useInterviewStore';

export default function SetupPage() {
  const router = useRouter();
  const setInterview = useInterviewStore((s) => s.setInterview);
  const [type, setType] = useState<'Tech' | 'HR'>('Tech');
  const [difficulty, setDifficulty] = useState('Medium');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiFetch<{ interview: { id: string }; questions: any[] }>('/interviews/start', {
        method: 'POST',
        body: JSON.stringify({
          type,
          difficulty,
          resume_text: resumeText,
          job_description: jobDescription || undefined,
        }),
      });
      setInterview(res.interview.id, res.questions);
      router.push('/interview');
    } catch (err: any) {
      setError(err.message || 'Failed to start interview');
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-ink">Interview Setup</h1>
        <p className="text-slate">Customize your session and jump in.</p>

        <form className="mt-6 space-y-5" onSubmit={handleStart}>
          <div>
            <label className="text-sm text-slate">Interview Type</label>
            <div className="mt-2 flex gap-2">
              {(['Tech', 'HR'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`btn ${type === t ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate">Difficulty</label>
            <select className="input mt-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate">Resume</label>
            <textarea
              className="input mt-2 min-h-[140px]"
              placeholder="Paste your resume content here"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate">Job Description (optional)</label>
            <textarea
              className="input mt-2 min-h-[120px]"
              placeholder="Paste job description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error ? <p className="text-red-600 text-sm">{error}</p> : null}

          <button className="btn btn-primary w-full" type="submit">
            Start Interview
          </button>
        </form>
      </div>
    </main>
  );
}
