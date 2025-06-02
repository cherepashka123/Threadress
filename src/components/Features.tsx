// src/components/Features.tsx
'use client';

export default function Features() {
  const features = [
    {
      title: 'Real-Time Inventory',
      description:
        'View live boutique stock levels instantly—no more wasted trips or guesswork.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#8b6f5f]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h18v18H3V3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9h18M9 21V9M15 21V9"
          />
        </svg>
      ),
    },
    {
      title: 'Seamless Checkout',
      description: 'One-click payments and flexible terms—checkout in seconds.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#8b6f5f]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h18M3 11h18M5 15h.01M9 15h.01M13 15h.01M17 15h.01M21 15H3m0-8v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Sustainable Shopping',
      description:
        'Discover eco-innovative boutiques—shop smart, reduce waste, support green.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#8b6f5f]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a7 7 0 00-7 7c0 4.25 6 11 7 11s7-6.75 7-11a7 7 0 00-7-7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 10l3 3 3-3"
          />
        </svg>
      ),
    },
    {
      title: 'AI-Powered Match',
      description:
        'Our AI engine suggests sizes & styles based on your profile—no more returns.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#8b6f5f]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.343 17.657A8 8 0 0112 13a8 8 0 015.657 4.657M8.464 16.243a4 4 0 016.97 0"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#f9f5f0]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-4xl font-heading font-bold text-center text-neutral-900 mb-12 tracking-tight">
          Key Features
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="
                relative 
                bg-white 
                rounded-3xl 
                p-6 
                overflow-hidden 
                hover:shadow-2xl 
                transform hover:-translate-y-2 
                transition 
                duration-300
                group
              "
            >
              {/* Subtle tech-grid background pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('/patterns/hexgrid.svg')]"></div>

              {/* Icon Circle with neutral beige background */}
              <div className="relative z-10 mb-6">
                <div className="bg-[#e0d7ca] p-4 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                  {f.icon}
                </div>
              </div>

              {/* Title with animated underline (neutral accent) */}
              <h3 className="relative z-10 text-xl font-semibold text-neutral-900 mb-2">
                {f.title}
                <span className="block h-1 w-0 bg-[#8b6f5f] transition-all duration-300 group-hover:w-full"></span>
              </h3>

              {/* Description */}
              <p className="relative z-10 text-neutral-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
