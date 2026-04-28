'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/shared/SplashScreen';
import { storage } from '@/lib/storage';

export default function BootPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      const session = storage.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 800); // 800ms to meet 800ms-2000ms requirement

    return () => clearTimeout(timer);
  }, [router]);

  if (!mounted) return null;

  return <SplashScreen />;
}
