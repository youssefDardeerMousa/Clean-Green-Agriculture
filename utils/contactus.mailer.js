import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Configure the transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',

        port : 465,
        secure:true,
        service:'gmail',
    auth: {
        user:process.env.email,
        pass:process.env.password
    }
});

export const sendMail = (options) => {
    return transporter.sendMail(options);
};
