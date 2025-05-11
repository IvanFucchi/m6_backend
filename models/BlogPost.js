import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BlogPostSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String },
  readTime: {
    value: { type: Number },
    unit: { type: String }
  },
  author: { type: String, required: true }, // email dell'autore
  content: { type: String, required: true }
}, {
  timestamps: true
});

export default model("BlogPost", BlogPostSchema);
