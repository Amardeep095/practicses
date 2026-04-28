function NoteCard({ note, onEdit, onDelete, onPin, onFavorite }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-yellow-200">
          {note.title}
        </h2>

        <div className="flex gap-2 text-sm">
          <button onClick={() => onPin(note)} className="hover:scale-110 transition">
            {note.isPinned ? "📌" : "📍"}
          </button>

          <button onClick={() => onFavorite(note)} className="hover:scale-110 transition">
            {note.isFavorite ? "⭐" : "☆"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <p className="text-gray-400 text-sm mt-2 line-clamp-3">
        {note.content}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-3">
        {note.tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 bg-white/10 text-blue-200 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-500">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>

        <div className="flex gap-3">
          <button className="text-purple-400 hover:text-purple-300" onClick={() => onEdit(note)}>
            Edit
          </button>

          <button className="text-pink-400 hover:text-pink-300" onClick={() => onDelete(note)}>
            Delete
          </button>
        </div>
      </div>

    </div>
  );
}

export default NoteCard;