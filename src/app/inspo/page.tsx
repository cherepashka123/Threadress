"use client";

import { useState } from "react";

export default function InspoPage() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [inspo, setInspo] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !city) {
      setError("Please fill in your email and city.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("city", city);
      formData.append("inspo", inspo);
      formData.append("notes", notes);

      const res = await fetch("/api/inspo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong.");
      }

      setSuccess("Submitted! We’ll use this for our pilot matching.");
      setEmail("");
      setCity("");
      setInspo("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-10">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">
          Send us any outfit you love — we’ll find similar pieces at local
          boutiques.
        </h1>

        <p className="text-sm text-neutral-300 mb-6">
          Early pilot: tell us what you&apos;re looking for. You can paste an image
          link (Pinterest, Instagram, etc.) or just describe the outfit.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-neutral-700 rounded-xl p-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-neutral-900 border border-neutral-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-neutral-900 border border-neutral-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Inspo (URL or description, optional)
            </label>
            <textarea
              value={inspo}
              onChange={(e) => setInspo(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-neutral-900 border border-neutral-700 h-20"
              placeholder="Paste a link or describe the outfit you have in mind…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-neutral-900 border border-neutral-700 h-20"
              placeholder="Budget, size, timing, occasion, preferred stores…"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-700 text-sm font-medium"
          >
            {isSubmitting ? "Submitting..." : "Submit inspo"}
          </button>
        </form>
      </div>
    </main>
  );
}
