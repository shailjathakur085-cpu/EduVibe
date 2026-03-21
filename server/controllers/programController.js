import Program from '../models/Program.js';

// 1. Create New Program
export const createProgram = async (req, res) => {
  try {
    const { title, language, code, output } = req.body;

    const newProgram = new Program({
      title,
      language: language.toLowerCase(), // Save as 'c', 'java' etc.
      code,
      output
    });

    await newProgram.save();
    res.status(201).json({ message: "Program Added Successfully!", data: newProgram });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get Programs by Language (Future ke liye)
export const getProgramsByLang = async (req, res) => {
  try {
    const { lang } = req.params;
    const programs = await Program.find({ language: lang });
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);
    
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// ... (createProgram, getProgramsByLang, getProgramById wahi purane rahenge) ...

// 4. DELETE PROGRAM
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await Program.findByIdAndDelete(id);
    res.status(200).json({ message: "Program Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. UPDATE PROGRAM
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProgram = await Program.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Program Updated", data: updatedProgram });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};