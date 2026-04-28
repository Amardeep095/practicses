import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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

      await API.post("/auth/signup", form);

      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      login(res.data);
      navigate("/");
    } catch {
      setError("Signup failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* Container */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
          <h1 className="text-3xl font-bold mb-4">Join Notes App</h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Create your account and start organizing your thoughts in a smarter way.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Get started in a few seconds
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            {/* Footer */}
            <p className="text-sm text-gray-600 text-center mt-2">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;