const cloudinary = require("cloudinary").v2;

// Function to upload an image to Cloudinary
module.exports.uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new Error("Failed to upload image"));
        }
        resolve(result.secure_url); // Return Cloudinary URL
      }
    );
    uploadStream.end(fileBuffer);
  });
};
