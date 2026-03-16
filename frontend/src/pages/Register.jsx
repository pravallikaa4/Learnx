import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    role: "student",
    year: "1",
    password: "",
    confirmPassword: "",
  });

  // Track specific errors for real-time display
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.includes("@")) error = "Please enter a valid email address.";
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        error = "8+ chars, 1 uppercase, 1 number, 1 symbol.";
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) error = "Passwords do not match.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate the field being changed
    validateField(name, value);
    
    // If user changes password, re-validate confirmPassword automatically
    if (name === "password" && form.confirmPassword) {
        setErrors(prev => ({
            ...prev, 
            confirmPassword: value !== form.confirmPassword ? "Passwords do not match." : ""
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Final check before submission
    const hasErrors = Object.values(errors).some((err) => err !== "");
    if (hasErrors) return setServerError("Please fix the errors before submitting.");

    try {
      const res = await apiRequest("/api/auth/register", "POST", form);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (err) {
      setServerError("Registration failed.");
    }
  };

  // Helper to style inputs based on error state
  const inputStyle = (fieldName) => `
    w-full border rounded-lg p-2.5 outline-none transition-all
    ${errors[fieldName] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-400 focus:ring-2"}
  `;

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 bg-gray-50 flex-col justify-center px-16 lg:px-24 border-r border-gray-100">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">LearnX</h1>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Start Your Learning <br />
            <span className="text-blue-500">Journey Today</span>
          </h2>
          <p className="text-gray-600 mb-8">Join thousands of learners sharing knowledge.</p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
          </div>

          {serverError && (
            <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input type="text" name="name" placeholder="Full Name" required className={inputStyle("name")} onChange={handleChange} />
            </div>

            <div>
                <input type="email" name="email" placeholder="Email" required className={inputStyle("email")} onChange={handleChange} />
                {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
                <input type="text" name="college" placeholder="College Name" required className={inputStyle("college")} onChange={handleChange} />
            </div>

            <div>
                <input type="password" name="password" placeholder="Password" required className={inputStyle("password")} onChange={handleChange} />
                {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            <div>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" required className={inputStyle("confirmPassword")} onChange={handleChange} />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={Object.values(errors).some(e => e !== "")}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition shadow-sm mt-2 disabled:bg-gray-300"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-purple-500 font-semibold cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
