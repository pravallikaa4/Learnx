import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"LearnX Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Mail sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📨 Sent to:", to);

    return true;

  } catch (error) {
    console.error("❌ Mail sending failed!");
    console.error(error.message);
    return false;
  }
};