import nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";

export const sendEmail = async (options) => {
  try {
    const templateFile = fs
      .readFileSync("H:\\case_study\\Case5\\Instagram\\BackEnd\\src\\utils\\email.html", "utf-8")
      .toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_MAIL,
      subject: "Chúng tôi giúp bạn dễ dàng đăng nhập lại trên Instagram",
      to: options.email,
      html: templateFile.replace("{{link}}", options.data.reset_url),
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
