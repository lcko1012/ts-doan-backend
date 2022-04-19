import { Service } from "typedi";
import nodemailer from "nodemailer";
import { info } from "console";

@Service()
export default class MailSender {

    readonly mailSender = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SENDER_EMAIL_ADDRESS as string,
            pass: process.env.SENDER_EMAIL_PASSWORD as string,
        }
    });

    private sendMail = (to: string, subject: string, html: string) => {
        const mailOptions = {
            from: "LCKO.com",
            to,
            subject,
            html
        }

        this.mailSender.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("loi mail")
                return err
            }});
            return info;

        // if (process.env.NODE_ENV == "production") {
            
        // }
    }

    public sendActivationLink = async (email: string, activationLink: string) => {
        const subject = "Register Confirmation";
        const html = `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Hi Guys</h2>
        <p>Congratulations! You're almost set to start using LCKO.
            Just click the button below to validate your email address.
        </p>
        
        <a href=${activationLink} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
            Activate Account
        </a>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <div>${activationLink}</div>
        </div>
        `

        this.sendMail(email, subject, html);
    }

    
    public sendPasswordResetLink = async (email: string, resetLink: string) => {
        const subject = "Lấy lại mật khẩu";
        const html = `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Chào bạn</h2>
        <p>Nhấn vào nút bên dưới để lấy lại mật khẩu</p>
        <a href=${resetLink} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
            Lấy lại mật khẩu
        </a>
        <p>Nếu nút bấm không hoạt động, bạn có thể nhấn vào đường dẫn bên dưới</p>
        <div>${resetLink}</div>
        <p style="color: red;">Lưu ý: Đường dẫn có hiệu lực trong vòng 30 phút, nếu đã hết hiếu lực, vui lòng gửi lại mail mới</p>
        </div>
        `
        this.sendMail(email, subject, html);
    }
}