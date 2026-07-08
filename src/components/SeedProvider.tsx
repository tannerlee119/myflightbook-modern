'use client';

import { useEffect } from 'react';
import { seedIfEmpty } from '@/lib/storage';

export default function SeedProvider() {
  useEffect(() => {
    seedIfEmpty();
  }, []);
  return null;
}
