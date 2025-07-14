'use client';

import { useLoading } from '../context/LoadingContext';

export default function LoaderDemo() {
  const { showLoader } = useLoading();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => showLoader(3000)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
      >
        Show Thread Loader
      </button>
    </div>
  );
}
