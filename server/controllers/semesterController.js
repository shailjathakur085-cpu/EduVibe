import Semester from '../models/Semester.js';

export const createSemester = async (req, res) => {
  try {
    // Console log lagaya hai taaki pata chale data aa raha hai ya nahi
    console.log("Data Received:", req.body); 

    const { name } = req.body;

    // 1. Validation
    if (!name) {
      return res.status(400).json({ message: "Semester Name is required" });
    }

    // 2. Check agar pehle se bana hai
    const existing = await Semester.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Semester already exists" });
    }

    // 3. Simple Save (Bina Stream ID ke)
    const newSemester = new Semester({ name });
    const savedData = await newSemester.save();

    res.status(201).json(savedData);

  } catch (error) {
    console.error("Error in Create Semester:", error); // Terminal me error dikhega
    res.status(500).json({ error: error.message });
  }
};

// ... baaki getAllSemesters, delete, update wahi purane rahenge ...
// (Lekin ensure karein ki unme bhi 'stream' populate na ho raha ho)
export const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find(); // .populate('stream') hata dein agar laga ho to
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... deleteSemester aur updateSemester bhi export karein ...
export const deleteSemester = async (req, res) => {
  try {
    await Semester.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSemester = async (req, res) => {
  try {
    const updated = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};