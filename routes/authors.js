import express from 'express';
import Author from "../models/Author.js";
import mongoose from 'mongoose';

const router = express.Router();

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Post a new author

router.post("/", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
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

export default router;
