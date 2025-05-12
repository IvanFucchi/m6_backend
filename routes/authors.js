import express from 'express';
import upload from '../middleware/cloudinary.js';
import Author from "../models/Author.js";
import mongoose from 'mongoose';
import { sendEmail } from '../services/emailService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get all authors
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Valori di default
    const authors = await Author.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Author.countDocuments();

    res.json({
      authors,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli autori" });
  }
});

// Get author by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// post aggiunge un nuovo autore e invia una email di benvenuto
router.post("/", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();

    // Invia email di benvenuto
    await sendEmail(
      savedAuthor.email,
      "Benvenuto su Strive Blog!",
      `<h1>Benvenuto ${savedAuthor.nome}!</h1>
       <p>Sei stato registrato con successo su Strive Blog. Inizia subito a pubblicare i tuoi articoli!</p>`
    );

    console.log(`Email inviata con successo a: ${savedAuthor.email}`);
    res.status(201).json(savedAuthor);
  } catch (error) {
    console.error("Errore durante la creazione dell'autore:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Put (update) an author
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an author
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    const deletedAuthor = await Author.findByIdAndDelete(id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// rotta per l'upload dell'avatar dell'autore
router.patch("/:authorId/avatar", upload.single("avatar"), async (req, res) => {
  try {
    console.log("File ricevuto:", req.file); // Debug
    const avatarUrl = req.file.path; // URL generato da Cloudinary
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.authorId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (updatedAuthor) {
      res.status(200).json(updatedAuthor);
    } else {
      res.status(404).json({ message: "Autore non trovato" });
    }
  } catch (error) {
    console.error("Errore durante l'upload dell'avatar:", error.message);
    res.status(500).json({ message: "Errore durante l'upload dell'avatar" });
  }
});


export default router;
