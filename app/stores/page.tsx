'use client';

import { StoreListPage } from '@/components/StoreListPage';
import { useRouter, useSearchParams } from 'next/navigation';

export default function StoresPage() {
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
