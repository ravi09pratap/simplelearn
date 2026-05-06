const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/blogdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Blog Schema
const blogSchema = new mongoose.Schema({
  blogName: { type: String, required: true },
  authorName: { type: String, required: true },
  blogText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Create a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const { blogName, authorName, blogText } = req.body;
    const blog = new Blog({ blogName, authorName, blogText });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Delete a blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
