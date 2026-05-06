// routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

// all routes protected
router.post("/", auth, createNote);
router.get("/", auth, getNotes);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

module.exports = router;