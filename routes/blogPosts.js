import express from "express";
import BlogPost from "../models/BlogPost.js";

const router = express.Router();

//  GET all blog posts
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei post" });
  }
});

// GET blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post non trovato" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero del post" });
  }
});

// ✅ POST new blog post
router.post("/", async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//  PUT update blog post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'aggiornamento" });
  }
});

//  DELETE blog post
router.delete("/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post eliminato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'eliminazione" });
  }
});

export default router;
