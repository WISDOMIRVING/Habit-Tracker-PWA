'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/auth/SignupForm';
import { storage } from '@/lib/storage';
import { User } from '@/types/auth';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (storage.getSession()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignup = (email: string, password: string) => {
    const users = storage.getUsers();
    if (users.find(u => u.email === email)) {
      setError('User already exists');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString()
    };

    storage.saveUser(newUser);
    storage.saveSession({ userId: newUser.id, email: newUser.email });
    router.push('/dashboard');
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-600">Sign Up</h1>
        <SignupForm onSignup={handleSignup} error={error} />
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
