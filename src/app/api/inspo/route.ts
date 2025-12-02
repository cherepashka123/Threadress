import { NextResponse } from "next/server";
import { appendInspoUserRow } from "@/lib/googleUserSheet";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = String(formData.get("email") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const inspo = String(formData.get("inspo") || "").trim(); // URL or description (optional)
    const notes = String(formData.get("notes") || "").trim(); // optional

    if (!email || !city) {
      return NextResponse.json(
        { error: "Missing required fields (email, city)." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Row: [timestamp, email, city, inspo, notes]
    await appendInspoUserRow([
      timestamp,
      email,
      city,
      inspo || "",
      notes || "",
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error handling /api/inspo POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
