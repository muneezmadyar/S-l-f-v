import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
    tls: {
    rejectUnauthorized: false, // 🟢 Yeh line add karna zaroori hai
  },
});

export const sender = {
  email: process.env.SMTP_USER,
  name: "Muneez",
};
