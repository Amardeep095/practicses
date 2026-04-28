import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* FULL SCREEN GRID */}
      <div className="w-full h-screen grid md:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-10">
          <h1 className="text-4xl font-bold mb-4">Notes App</h1>
          <p className="text-blue-100 text-center max-w-sm leading-relaxed">
            Capture your ideas, organize your thoughts, and stay productive.
            Simple, fast, and powerful.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center bg-gray-50 px-4">

          {/* FORM CARD */}
          <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm">

            {/* TITLE */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please enter your details
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
                {error}
              </div>
            )}

            {/* FORM */}
            <div className="flex flex-col gap-4">

              {/* EMAIL */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {/* PASSWORD */}
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {/* BUTTON */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* FOOTER */}
              <p className="text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 cursor-pointer hover:underline font-medium"
                >
                  Create one
                </span>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;