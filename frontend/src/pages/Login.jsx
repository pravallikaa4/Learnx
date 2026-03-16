import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      console.log(form.email, form.password)
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 bg-gray-50 flex-col justify-center px-20">
        <h1 className="text-3xl font-bold mb-6 text-blue-500">
          LearnX
        </h1>

        <h2 className="text-4xl font-bold mb-4 leading-tight">
          Welcome Back <br />
          <span className="text-blue-500">Keep Growing</span>
        </h2>

        <p className="text-gray-600 mb-8">
          Continue your journey of learning and teaching.
          Your next opportunity is waiting.
        </p>

        <ul className="space-y-3 text-gray-700">
          <li>✔ Connect with skilled mentors</li>
          <li>✔ Earn credits by teaching</li>
          <li>✔ Flexible scheduling</li>
          <li>✔ Join a global community</li>
        </ul>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-96 bg-white p-10 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-2 text-center">
            Sign in to your account
          </h2>

          <p className="text-sm text-gray-500 mb-6 text-center">
            Access your dashboard and sessions
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-500 cursor-pointer"
            >
              Create Account
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}