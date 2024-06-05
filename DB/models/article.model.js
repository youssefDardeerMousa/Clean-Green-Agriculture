import { Schema, Types, model } from  "mongoose";

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: [
 {  url:{
    type: String,
    required: true
   },
   id:{
    type: String,
    required: true
   }}
  ],
  publishedDate: {
    type: String,
    required: true
  },
  createdBy: { type: Types.ObjectId, ref: "User", required: true }
});

export const Article = model('Article', articleSchema);

