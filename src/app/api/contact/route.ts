import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, company, topic, message } = data;

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const lines = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      company?.trim() ? `Company: ${company.trim()}` : null,
      topic?.trim() ? `What is this about: ${topic.trim()}` : null,
      ``,
      `Message:`,
      message.trim(),
    ].filter((l) => l !== null);

    const smtpPort = parseInt(process.env.SMTP_PORT ?? "465", 10);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email.trim(),
      subject: "New Contact Message from Just After Work Website",
      text: lines.join("\n"),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you. Your message has been sent successfully.",
    });
  } catch (err) {
    console.error("[contact] SMTP send error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or email us directly.",
      },
      { status: 500 }
    );
  }
}
