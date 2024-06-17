import mongoose, { Schema, model } from "mongoose";

const contactUsSchema = new Schema({
    Name: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    Email: {
        type: String,
        required: true,
        lowercase: true
    },
    Phone: {
        type: String,
        required: true
    },
    Message: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const ContactUs = model("ContactUs", contactUsSchema);
