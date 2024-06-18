import { ContactUs } from "../../../DB/models/contactus.model.js";
import { User } from "../../../DB/models/user.model.js";
import { CatchError } from "../../../utils/catch_error.js";
import { sendMail } from "../../../utils/contactus.mailer.js";

export const contactus = CatchError(async (req, res, next) => {
    const { Name, Email, Phone, Message } = req.body;
    if (!Name || !Email || !Phone || !Message) {
        return res.status(400).send("All fields are required.");
    }
    const contactUs = new ContactUs(req.body);
    await contactUs.save();

    // Find all admins
    const admins = await User.find({ Role: 'admin' });
    const adminEmails = admins.map(admin => admin.Email);
    console.log(adminEmails, 'adminEmails', admins, 'admins');

    // HTML email content
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #4CAF50;text-align:center">New Contact Us Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Field</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Details</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Name</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${Name}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${Email}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Phone</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${Phone}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Message</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${Message}</td>
            </tr>
        </table>
        <p>Thank you!</p>
    </div>
    `;

    await sendMail({
        from: Email,
        to: adminEmails.join(','),
        subject: 'New Contact Us Form Submission',
        html: emailHtml // Use the HTML content instead of plain text
    });

    res.status(200).json({ status: 200, result: true, message: 'Your message has been sent successfully. We will contact you soon. Thank you!' });
});


export const getContactMessages=CatchError(async(req,res,next)=>{
    const messages = await ContactUs.find();
    res.status(200).json({status:200 , result:true, messages});

})