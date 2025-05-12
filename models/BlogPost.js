import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Schema per i Commenti
const CommentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true }, // Possiamo salvare l'email o il nome
  date: { type: Date, default: Date.now },
});

const BlogPostSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String },
  readTime: {
    value: { type: Number },
    unit: { type: String }
  },
  author: { type: String, required: true }, // email dell'autore
  content: { type: String, required: true },
  comments: [CommentSchema], // Array di commenti-->embedding
}, { timestamps: true});

export default model("BlogPost", BlogPostSchema);
