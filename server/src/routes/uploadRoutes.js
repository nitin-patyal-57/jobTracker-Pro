import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/resume", requireAuth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ message: "Cloudinary is not configured" });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "jobtracker-resumes",
      resource_type: "raw"
    });

    const resumeUrl = result.secure_url;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl },
      { new: true }
    ).select("-password");

    return res.json({ resumeUrl, user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload resume" });
  }
});

export default router;
