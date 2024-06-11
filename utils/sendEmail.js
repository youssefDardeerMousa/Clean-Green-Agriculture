import nodemailer from 'nodemailer'
export const sendEmail = async({to,subject,html, attachments})=>{
    // sender 
     const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
<<<<<<< HEAD
        port : 587,
        tls: { rejectUnauthorized: false, minVersion: 'TLSv1' },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        secure:false,
=======
        port : 465,
        secure:true,
>>>>>>> 1a5dd29f58388354726b79b9d3962c79f9ccacf4
        service:'gmail',
        auth:{
            user:process.env.email,
            pass:process.env.password
        },
        requireTLS: true
    })
    // receiver
const EmailInfo = await transporter.sendMail({
    from: `"Clean And Green" <${process.env.email}>`,
    to, 
    subject,  
    html,attachments
  });
  console.log(EmailInfo);
return EmailInfo.accepted.length<1?false:true
}

