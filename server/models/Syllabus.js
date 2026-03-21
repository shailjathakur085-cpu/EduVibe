import mongoose from 'mongoose';

const syllabusSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Syllabus', syllabusSchema);
