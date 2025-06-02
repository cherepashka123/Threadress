// src/components/Hero.tsx

export default function Hero() {
  return (
    <section className="bg-[#f4efe9] py-16 px-6 md:px-12 rounded-b-3xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Discover Local Fashion, Reimagined
          </h1>
          <p className="text-lg text-gray-700">
            AI-driven style & fit matching, real-time boutique inventory, and
            instant click-to-collect — all in one app.
          </p>
          <a
            href="#waitlist"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:opacity-90 transition"
          >
            Join the Waitlist
          </a>
        </div>

        {/* Mockup Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/mockup.png"
            alt="Threadress app mockup"
            className="w-[320px] md:w-[400px] rounded-xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
