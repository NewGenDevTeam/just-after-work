import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Option A: forward to WordPress via Contact Form 7 REST API
    // Replace FORM_ID with your CF7 form ID
    const wpEndpoint = process.env.WP_CONTACT_FORM_ENDPOINT;

    if (wpEndpoint) {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
      const res = await fetch(wpEndpoint, { method: "POST", body: fd });
      if (!res.ok) throw new Error("WP submission failed");
    } else {
      // Fallback: just log it. Replace with Resend/SendGrid/etc.
      console.log("Contact form submission:", data);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "submission_failed" },
      { status: 500 }
    );
  }
}
