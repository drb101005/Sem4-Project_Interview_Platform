'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setToken } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiFetch<{ token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-ink">Create your account</h1>
        <p className="text-slate">Start building interview confidence today.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-red-600 text-sm">{error}</p> : null}
          <button className="btn btn-primary w-full" type="submit">
            Sign up
          </button>
        </form>
        <p className="mt-4 text-sm text-slate">
          Already have an account?{' '}
          <Link className="text-ink underline" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
