import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },

  // stream: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Stream',
  //   required: true
  // }
}, { timestamps: true });

export default mongoose.model('Semester', semesterSchema);