import VectorSearchDemo from '@/components/VectorSearchDemo';

export default function VectorSearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Smart Fashion Discovery
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find your perfect style across our network of boutiques and
              stores. Our AI-powered search understands fashion and helps you
              discover similar items nearby.
            </p>
          </div>

          <VectorSearchDemo />

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-medium mb-3">
                  Style Understanding
                </h3>
                <p className="text-gray-400">
                  Our AI analyzes your search to understand style, cut, fabric,
                  and occasion preferences.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-medium mb-3">Smart Matching</h3>
                <p className="text-gray-400">
                  We find similar items by comparing style features across our
                  partner stores' inventory.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-medium mb-3">Local Availability</h3>
                <p className="text-gray-400">
                  See real-time availability and locations of matching items in
                  stores near you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
