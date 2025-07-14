import { Suspense } from 'react';
import ThreadressApp from '@/components/ThreadressApp';

export default function ThreadressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThreadressApp />
    </Suspense>
  );
}
