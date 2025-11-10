import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  id: { type: Number, required: false, unique: false },
  type: { type: String, required: true }, // admin/student
  unique_id: { type: String, required: true, unique: true },
  userurl: { type: String, required: true },
  videoUrl: { type: String },
  videoPath: { type: String }
}, { timestamps: true });

export default mongoose.models.LiveSession || mongoose.model('LiveSession', sessionSchema);
