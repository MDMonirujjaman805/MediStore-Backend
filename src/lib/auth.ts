import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigin: process.env.APP_URL! || "http://localhost:3000",
  user: {
    additionalFields: {
      fullName: {
        type: "string",
        required: false,
      },
    },
    phoneNumber: {
      type: "string",
      required: false,
    },
    status: {
      type: "string",
      defaultValue: "ACTIVE",
      required: false,
    },
  },
  tables: {
    user: "user",
    session: "session",
    account: "account",
    verification: "verification",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log(user, url, token);
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"MediStore" <medistore@gmail.com>',
          to: user.email || "",
          subject: "Verify your email for MediStore",
          text:
            "Please verify your email by clicking the following link: " +
            verificationUrl,
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:20px;text-align:center;color:white;font-size:22px;font-weight:bold;">
              MediStore 💊
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;color:#333;">
              <h2 style="margin-top:0;">Verify your email</h2>
              <p style="font-size:15px;line-height:1.6;">
                Thanks for signing up for <b>MediStore</b>!  
                Please confirm your email address by clicking the button below 👇
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${verificationUrl}"
                   style="background:#16a34a;color:#fff;text-decoration:none;
                   padding:14px 28px;border-radius:6px;
                   font-size:16px;font-weight:600;display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all;font-size:13px;color:#16a34a;">
                // ${url}
                ${verificationUrl}
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:25px 0;">

              <p style="font-size:13px;color:#777;">
                If you didn’t create an account, you can safely ignore this email.
              </p>

              <p style="font-size:13px;color:#777;">
                — Team MediStore 💚
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#999;">
              © 2026 MediStore. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
