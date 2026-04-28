'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { storage } from '@/lib/storage';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (storage.getSession()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (email: string, password: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      storage.saveSession({ userId: user.id, email: user.email });
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Login</h1>
        <LoginForm onLogin={handleLogin} error={error} />
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
