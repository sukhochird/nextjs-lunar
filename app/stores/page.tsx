'use client';

import { StoreListPage } from '@/components/StoreListPage';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function StoresPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStoreClick = (storeId: number, storeName: string) => {
    // Navigate to home with store filter
    router.push(`/?storeId=${storeId}&storeName=${encodeURIComponent(storeName)}`);
  };

  return (
    <StoreListPage
      onBack={() => router.push('/')}
      onStoreClick={handleStoreClick}
    />
  );
}

export default function StoresPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <StoresPageContent />
    </Suspense>
  );
}
