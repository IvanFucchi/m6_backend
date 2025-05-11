import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cognome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dataDiNascita: {
    type: String,
    required: true,
  },
    avatar: {
        type: String,
        required: true,
    },
})

const Author = mongoose.model('Author', authorSchema);
export default Author;
// This code defines a Mongoose schema and model for an Author entity.
// The schema includes fields for name, email, and password, with validation rules.
// The model is then exported for use in other parts of the application.
// The Author model can be used to create, read, update, and delete author records in the MongoDB database.
// The schema is defined using Mongoose, a popular ODM (Object Data Modeling) library for MongoDB and Node.js.