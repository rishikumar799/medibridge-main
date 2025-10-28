'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/patient/dashboard');
    } else {
      router.push('/auth/sign-in');
    }
  }, [user, router]);

  return <div>Loading...</div>;
}
