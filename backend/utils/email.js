import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendMail = async(to,subject,html) =>{

    const traspoter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : to,
        subject : subject,
        html: html
    
    }

    await traspoter.sendMail(mailOptions);
}

export default sendMail;