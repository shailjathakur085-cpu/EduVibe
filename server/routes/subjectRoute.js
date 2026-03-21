import express from "express";

import {
  createSubject,
  getAllSubjects,
  getSubjectsBySemester,
  deleteSubject, 
  updateSubject
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", createSubject);

router.get("/", getAllSubjects);

router.get("/semester/:semesterId", getSubjectsBySemester);
router.delete("/delete/:id", deleteSubject);
router.put("/update/:id", updateSubject);

export default router;
