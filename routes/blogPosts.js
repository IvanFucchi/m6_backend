import express from "express";
import upload from "../middleware/cloudinary.js";
import BlogPost from "../models/BlogPost.js";
import mongoose from "mongoose";

const router = express.Router();

//  GET all blog posts con paginated response
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "" } = req.query;
    const query = search
      ? { title: { $regex: search, $options: "i" } } // Ricerca case-insensitive
      : {};

    const posts = await BlogPost.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await BlogPost.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei post" });
  }
});

// Rotta per ottenere tutti i post di un autore specifico
router.get("/author/:authorEmail", async (req, res) => {
  try {
    const { authorEmail } = req.params;
    const posts = await BlogPost.find({ author: authorEmail });

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "Nessun post trovato per questo autore" });
    }
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei post dell'autore" });
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

// POST new blog post
router.post("/", async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Modifica un post esistente
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Errore durante la modifica del post" });
  }
});

//  DELETE - Elimina un post esistente
router.delete("/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'eliminazione del post" });
  }
});

// rotta per l'upload della copertina del post
router.patch("/:blogPostId/cover", upload.single("cover"), async (req, res) => {
  try {
    console.log("File ricevuto:", req.file); // Debug
    const coverUrl = req.file.path; // URL generato da Cloudinary
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.blogPostId,
      { cover: coverUrl },
      { new: true }
    );

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: "Post non trovato" });
    }
  } catch (error) {
    console.error("Errore durante l'upload della copertina:", error.message);
    res.status(500).json({ message: "Errore durante l'upload della copertina" });
  }
});

// Rotta per l'upload della copertina del post
router.patch("/:blogPostId/cover", upload.single("cover"), async (req, res) => {
  try {
    console.log("File ricevuto:", req.file); // Debug
    const coverUrl = req.file.path; // URL generato da Cloudinary
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.blogPostId,
      { cover: coverUrl },
      { new: true }
    );

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: "Post non trovato" });
    }
  } catch (error) {
    console.error("Errore durante l'upload della copertina:", error.message);
    res.status(500).json({ message: "Errore durante l'upload della copertina" });
  }
});

// GET Tutti i commenti di un post
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID non valido" });
    }

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


    // GET Singolo commento di un post

router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Aggiungi un commento
router.post("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    const newComment = { text, author };
    post.comments.push(newComment);

    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT Modifica un commento
router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text, author } = req.body;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }

    comment.text = text;
    comment.author = author;

    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


    // DELETE Elimina un commento

router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    post.comments.pull(commentId);// Rimuove il commento dall'array
    
    await post.save();// Salva le modifiche al post

    res.status(204).send();
    res.status(200).json({ message: "Commento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
