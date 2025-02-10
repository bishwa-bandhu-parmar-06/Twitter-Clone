// routes/postRoutes.js
const express = require('express');
const postController = require('../controller/postController');
const userAuth = require('../middleware/userAuth'); // Authentication middleware
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

// Route to create a new post with file upload
router.post('/create', userAuth, upload.single('media'), postController.createPost);

// Route to get all posts
router.get('/', postController.getPosts);

// Route to edit a post (caption & media)
router.put('/:id', userAuth, upload.single('media'), postController.updatePost);


// Route to delete a post
router.delete("/:id", userAuth, postController.deletePost);

router.get('/user/:userId', postController.getPostsByUser);

module.exports = router;
