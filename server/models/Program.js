import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['c', 'cpp', 'java', 'dsa', 'html', 'css', 'javascript', 'react', 'sql'] 
  },
  code: {
    type: String, 
  },
  output: {
    type: String 
  }
}, { timestamps: true });

export default mongoose.model('Program', programSchema);