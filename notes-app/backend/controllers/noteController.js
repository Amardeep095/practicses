const Note = require("../models/Note");

// ➕ Create Note
exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ msg: "Error creating note" });
  }
};

// 📥 Get Notes (Search + Pagination + Pin sorting)
exports.getNotes = async (req, res) => {
  try {
    const { search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(notes);
  } catch {
    res.status(500).json({ msg: "Error fetching notes" });
  }
};

// ✏️ Update Note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(note);
  } catch {
    res.status(500).json({ msg: "Error updating note" });
  }
};

// ❌ Delete Note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ msg: "Note deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting note" });
  }
};