import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";

export default function Profile() {
  const { currentUser, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    image: "",
    skillsKnown: [],
    skillsToLearn: [],
  });

  const [input, setInput] = useState("");
  const [type, setType] = useState("known");

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        image: currentUser.image || "",
        skillsKnown: currentUser.skillsKnown || [],
        skillsToLearn: currentUser.skillsToLearn || [],
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Please log in to view profile.
      </div>
    );
  }

  // ================= IMAGE UPLOAD + COMPRESSION =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          const scale = MAX_WIDTH / width;
          width = MAX_WIDTH;
          height = height * scale;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.7);
        setForm((prev) => ({ ...prev, image: compressedImage }));
      };
    };

    reader.readAsDataURL(file);
  };

  // ================= DELETE PROFILE IMAGE =================
  const removeProfileImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));

    // update context instantly (header refresh)
    updateUser({
      ...currentUser,
      image: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ================= SKILLS =================
  const addSkill = () => {
    if (!input.trim()) return;

    if (type === "known") {
      if (!form.skillsKnown.includes(input.trim())) {
        setForm({
          ...form,
          skillsKnown: [...form.skillsKnown, input.trim()],
        });
      }
    } else {
      if (!form.skillsToLearn.includes(input.trim())) {
        setForm({
          ...form,
          skillsToLearn: [...form.skillsToLearn, input.trim()],
        });
      }
    }

    setInput("");
  };

  const removeSkill = (skill, skillType) => {
    if (skillType === "known") {
      setForm({
        ...form,
        skillsKnown: form.skillsKnown.filter((s) => s !== skill),
      });
    } else {
      setForm({
        ...form,
        skillsToLearn: form.skillsToLearn.filter((s) => s !== skill),
      });
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const data = await apiRequest("/users/profile", "PUT", form);
      if (data?.user) {
        updateUser(data.user);
        alert("Profile saved successfully!");
      }
    } catch {
      alert("Upload failed. Try smaller image.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 py-14 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center text-center h-fit relative">

          {form.image ? (
            <div className="relative">
              <img
                src={form.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-purple-200"
              />

              <button
                onClick={removeProfileImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition"
              >
                <TrashIcon />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 flex items-center justify-center text-4xl shadow-inner">
              👤
            </div>
          )}

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            {form.name || "Your Name"}
          </h2>

          <p className="mt-3 text-gray-600 text-sm leading-relaxed px-3">
            {form.bio || "Add a short bio about yourself..."}
          </p>

          <div className="mt-6 w-full border-t pt-5 text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-semibold text-indigo-600">Skills Known:</span>{" "}
              {form.skillsKnown.length}
            </p>
            <p>
              <span className="font-semibold text-purple-600">Skills Learning:</span>{" "}
              {form.skillsToLearn.length}
            </p>
          </div>
        </div>

        {/* RIGHT EDIT SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-9">

          <h3 className="text-xl font-semibold mb-6 text-gray-700">
            Edit Profile
          </h3>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-300 outline-none transition"
            />

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageUpload}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white"
            />

            <textarea
              placeholder="Short Bio"
              value={form.bio}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-300 outline-none transition resize-none"
            />
          </div>

          {/* Skill Adder */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 outline-none"
              >
                <option value="known">Skill I Know</option>
                <option value="learn">Skill I Want to Learn</option>
              </select>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add new skill"
                className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 outline-none"
              />

              <button
                onClick={addSkill}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-7 py-3 rounded-xl shadow hover:scale-105 transition-transform"
              >
                Add
              </button>
            </div>
          </div>

          {/* Skill Lists */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Section
              title="Skills I Know"
              data={form.skillsKnown}
              remove={(skill) => removeSkill(skill, "known")}
            />

            <Section
              title="Skills I Want to Learn"
              data={form.skillsToLearn}
              remove={(skill) => removeSkill(skill, "learn")}
            />
          </div>

          <div className="mt-10 text-right">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-9 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, data, remove }) {
  return (
    <div>
      <h4 className="font-semibold mb-3 text-gray-700">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm"
          >
            {item}
            <span
              onClick={() => remove(item)}
              className="cursor-pointer text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4h6v3m-8 0l1 13h6l1-13" />
    </svg>
  );
}