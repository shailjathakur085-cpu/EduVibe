import Syllabus from '../models/Syllabus.js';
import Semester from '../models/Semester.js';

// Create Syllabus
export const createSyllabus = async (req, res) => {
  try {
    const { title, semester, pdfUrl, description } = req.body;

    // Check if semester exists
    const semesterExists = await Semester.findById(semester);
    if (!semesterExists) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const syllabus = new Syllabus({
      title,
      semester,
      pdfUrl,
      description
    });

    const savedSyllabus = await syllabus.save();
    res.status(201).json(savedSyllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Syllabi
export const getAllSyllabi = async (req, res) => {
  try {
    const syllabi = await Syllabus.find()
      .populate('semester', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(syllabi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Syllabi by Semester
export const getSyllabiBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const syllabi = await Syllabus.find({ semester: semesterId })
      .populate('semester', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(syllabi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Syllabus
export const updateSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, semester, pdfUrl, description } = req.body;

    // Check if semester exists if provided
    if (semester) {
      const semesterExists = await Semester.findById(semester);
      if (!semesterExists) {
        return res.status(404).json({ message: 'Semester not found' });
      }
    }

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      id,
      { title, semester, pdfUrl, description },
      { new: true, runValidators: true }
    ).populate('semester', 'name');

    if (!updatedSyllabus) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }

    res.status(200).json(updatedSyllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Syllabus
export const deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSyllabus = await Syllabus.findByIdAndDelete(id);

    if (!deletedSyllabus) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }

    res.status(200).json({ message: 'Syllabus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
