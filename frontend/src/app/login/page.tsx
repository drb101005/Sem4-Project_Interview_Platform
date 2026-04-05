'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiFetch<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
        <p className="text-slate">Log in to continue your interview practice.</p>

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
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-slate">
          New here?{' '}
          <Link className="text-ink underline" href="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
