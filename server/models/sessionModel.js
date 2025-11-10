const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // auto-incremented id
  type: { type: String, required: true }, // admin/student
  unique_id: { type: String, required: true, unique: true },
  userurl: { type: String, required: true },
  videoUrl: { type: String } // link to video file (server serves /videos/sample.mp4 by default)
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
