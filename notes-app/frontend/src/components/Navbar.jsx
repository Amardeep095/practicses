import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b sticky top-0 z-10">
      <h1 className="text-xl font-semibold tracking-tight">Notes</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-500">
            {user.name}
          </span>
        )}

        {user ? (
          <button
            onClick={logout}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;