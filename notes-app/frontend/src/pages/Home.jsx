import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

function Home() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 🔄 Fetch Notes
  const fetchNotes = async () => {
    try {
      const res = await API.get(
        `/notes?search=${search}&page=${page}`,
        getAuthHeader()
      );
      setNotes(res.data);
    } catch {
      alert("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, page]);

  // ➕ Add Note
  const handleAdd = async () => {
    try {
      await API.post(
        "/notes",
        {
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()),
        },
        getAuthHeader()
      );
      setForm({ title: "", content: "", tags: "" });
      fetchNotes();
    } catch {
      alert("Error adding note");
    }
  };

  // ✏️ Edit Note
  const handleEdit = (note) => {
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    });
    setEditingId(note._id);
  };

  // 🔄 Update Note
  const handleUpdate = async () => {
    try {
      await API.put(
        `/notes/${editingId}`,
        {
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()),
        },
        getAuthHeader()
      );
      setForm({ title: "", content: "", tags: "" });
      setEditingId(null);
      fetchNotes();
    } catch {
      alert("Error updating note");
    }
  };

  // ❌ Delete Note
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`, getAuthHeader());
      fetchNotes();
    } catch {
      alert("Error deleting note");
    }
  };

  // 📌 Toggle Pin
  const togglePin = async (note) => {
    try {
      await API.put(
        `/notes/${note._id}`,
        { isPinned: !note.isPinned },
        getAuthHeader()
      );
      fetchNotes();
    } catch {
      alert("Error updating pin");
    }
  };

  // ⭐ Toggle Favorite
  const toggleFavorite = async (note) => {
    try {
      await API.put(
        `/notes/${note._id}`,
        { isFavorite: !note.isFavorite },
        getAuthHeader()
      );
      fetchNotes();
    } catch {
      alert("Error updating favorite");
    }
  };

  return (
<>
  <Navbar />

  <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] px-4 py-10">

    <div className="max-w-6xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-semibold text-gray-100 mb-8 text-center">
        My Notes
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search notes..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full mb-8 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      {/* FORM */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-10 hover:shadow-2xl transition">

        <div className="flex flex-col gap-4">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            placeholder="Tags"
            value={form.tags}
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value })
            }
            className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <button
            onClick={editingId ? handleUpdate : handleAdd}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>

        </div>
      </div>

      {/* NOTES */}
      {notes.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No notes yet — start writing ✨
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={togglePin}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

    </div>
  </div>
</>
  );
}

export default Home;