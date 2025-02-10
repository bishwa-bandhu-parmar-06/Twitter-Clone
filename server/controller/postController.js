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
    const { caption } = req.body;
    let mediaUrl = null;

    if (req.file) {
      try {
        const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        const result = await uploadStream(req.file.buffer, resourceType);
        mediaUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: 'Failed to upload media' });
      }
    }

    const newPost = new Post({
      user: req.user._id,
      caption,
      media: mediaUrl ? [mediaUrl] : []
    });

    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate('user', 'username avatar name');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username avatar name')
      .populate('comments.user', 'username avatar name')
      .populate('comments.replies.user', 'username avatar name')
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Update a post
// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    let updatedData = { caption };

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // If a new file (image/video) is uploaded, replace the old one
    if (req.file) {
      try {
        const resourceType = req.file.mimetype.startsWith("video") ? "video" : "image";
        const result = await uploadStream(req.file.buffer, resourceType);
        updatedData.media = [result.secure_url]; // ✅ Fix: Update the media field correctly
      } catch (uploadError) {
        return res.status(500).json({ message: "Failed to upload media" });
      }
    } else {
      // If no new media, retain old media
      updatedData.media = post.media;
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true })
      .populate("user", "username avatar name");

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete post from the database
    await Post.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .populate('user', 'username avatar name')
      .populate('comments.user', 'username avatar name')
      .populate('comments.replies.user', 'username avatar name')
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
