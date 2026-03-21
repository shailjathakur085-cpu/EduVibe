import Stream from '../models/Stream.js';

// 1. Create Stream (Naya Stream banana)
export const createStream = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation: Kya ye stream pehle se hai?
    const existingStream = await Stream.findOne({ name });
    if (existingStream) {
      return res.status(400).json({ message: 'Stream already exists' });
    }

    const newStream = new Stream({ name });
    const savedStream = await newStream.save();

    res.status(201).json({
      message: "Stream created successfully",
      data: savedStream
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All Streams (Saari streams dekhna)
export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find();
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};