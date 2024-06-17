import { ContactUs } from "../../../DB/models/contactus.model.js";
import { User } from "../../../DB/models/user.model.js";
import { CatchError } from "../../../utils/catch_error.js";
import { sendMail } from "../../../utils/contactus.mailer.js";

export const contactus=CatchError(async(req,res,next)=>{
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
    await sendMail({
        from: Email,
        to: adminEmails.join(','),
        subject: 'New Contact Us Form Submission',
        text: `You have a new contact us form submission:
               Name: ${req.body.Name}
               Email: ${req.body.Email}
               Phone: ${req.body.Phone}
               Message: ${req.body.Message}`
    });

    res.status(200).json({status:200 , result:true, message: 'Your message has been sent successfully. We will contact you soon. Thank you!'});
})

export const getContactMessages=CatchError(async(req,res,next)=>{
    const messages = await ContactUs.find();
    res.status(200).json({status:200 , result:true, messages});

})