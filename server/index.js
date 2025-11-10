import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import LiveSession from "./models/LiveSession.js";
import { v4 as uuidv4 } from "uuid";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//commenting every thing to understand properly


const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Connect to MongoDB and only start the HTTP server after a successful connection.
// Note: useNewUrlParser/useUnifiedTopology options are no longer necessary with modern drivers.
async function start() {
  try {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/live_sessions';
    console.log('Connecting to MongoDB at', mongoUrl);
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected.');

    // start HTTP server after DB connection
    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    // give some info to help debugging
    console.error('Make sure MongoDB is running and reachable at the URL above (or set MONGODB_URI / MONGO_URL).');
    process.exit(1);
  }
}

start();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create session API
app.post("/api/sessions", upload.single("video"), async (req, res) => {
  try {
    const unique_id = uuidv4();
    // Use CLIENT_URL env var (set on Render) or default to localhost for local dev
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const userurl = `${clientUrl}/session/${unique_id}`;
    const videoPath = req.file ? `/uploads/${req.file.filename}` : null;
    const newSession = new LiveSession({
      type: "admin",
      unique_id,
      userurl,
      videoPath,
    });
    await newSession.save();

    // Build a response that includes a full URL to the uploaded video 
    const response = newSession.toObject ? newSession.toObject() : newSession;
    response.videoUrl = videoPath ? `${req.protocol}://${req.get('host')}${videoPath}` : null;

    res.json(response);
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session API
app.get("/api/sessions/:uniqueId", async (req, res) => {
  try {
    const session = await LiveSession.findOne({ unique_id: req.params.uniqueId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const obj = session.toObject ? session.toObject() : session;
    obj.videoUrl = obj.videoPath ? `${req.protocol}://${req.get('host')}${obj.videoPath}` : obj.videoUrl || null;

    // If the file referenced by videoPath doesn't exist, warn and return without videoUrl
    if (obj.videoPath) {
      const fileOnDisk = path.join(__dirname, obj.videoPath.replace(/^\//, ''));
      if (!fs.existsSync(fileOnDisk)) {
        console.warn('Requested video file not found on disk:', fileOnDisk);
        obj.videoUrl = null;
      }
    }

    res.json(obj);
  } catch (err) {
    console.error('Error fetching session:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
