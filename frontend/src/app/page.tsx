'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Importación dinámica para evitar problemas de hidratación
const NoticiasList = dynamic(() => import('@/components/NoticiasList'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <NoticiasList />
      </Suspense>
    </div>
  );
}
