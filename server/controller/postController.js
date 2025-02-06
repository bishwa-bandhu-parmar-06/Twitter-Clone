// controllers/postController.js
const Post = require('../models/postModel');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload to Cloudinary via stream
const uploadStream = (buffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);
    const { caption } = req.body;
    let mediaUrl = null;

    // Handle file upload if present
    if (req.file) {
      try {
        const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        const result = await uploadStream(req.file.buffer, resourceType);
        mediaUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload media' });
      }
    }

    // Create post in DB
    const newPost = new Post({
      user: req.user._id, // Get user ID from auth middleware
      caption,
      media: mediaUrl ? [mediaUrl] : []
    });

    await newPost.save();

    // Populate user data before sending response
    const populatedPost = await Post.findById(newPost._id)
      .populate('user', 'username avatar name')
      .exec();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get all posts with comments
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username avatar') // Populate user data for the post creator
      .populate('comments.user', 'username avatar') // Populate comment user data
      .populate('comments.replies.user', 'username avatar') // Populate replies user data
      .sort({ createdAt: -1 }); // Sort posts by creation date (newest first)
    
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Post comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.body.userId,
      text
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reply to comment
exports.replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newReply = {
      user: req.body.userId,
      text
    };

    comment.replies.push(newReply);
    await post.save();

    res.status(200).json({ message: 'Reply added', reply: newReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
