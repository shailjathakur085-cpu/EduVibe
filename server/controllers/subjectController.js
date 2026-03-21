import Subject from '../models/Subject.js';


export const createSubject = async (req, res) => {
  try {
    const { name, code, semesterId, keyTopics } = req.body;

    const newSubject = new Subject({
      name,
      code,
      semester: semesterId,
      keyTopics: keyTopics || []
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllSubjects = async (req, res) => {
  try {
    
    const subjects = await Subject.find().populate('semester', 'name');
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get subjects specific to a semester ID
export const getSubjectsBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params; // URL se semester ki ID milegi
    
    // Database mein dhundo jahan 'semester' field match kare
    const subjects = await Subject.find({ semester: semesterId });
    
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- 5. UPDATE SUBJECT ---
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Subject Updated", data: updatedSubject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};