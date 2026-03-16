import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handlePrimaryAction = () => {
    if (!currentUser?.isProfileComplete) {
      navigate("/profile");
    } else {
      const section = document.getElementById("explore-section");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="px-6 md:px-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Learn Smarter with
              <span className="text-primary"> AI Collaboration</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg max-w-lg">
              Connect with peers, book 1-on-1 sessions, and
              track your learning journey — all in one place.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button
                onClick={handlePrimaryAction}
                className="btn-primary"
              >
                {!currentUser?.isProfileComplete
                  ? "Get Started"
                  : "Explore"}
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
              alt="Learning"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-6 left-6 bg-white px-4 py-2 rounded-xl shadow-md text-sm"
            >
              1 on 1 sessions
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded-xl shadow-md text-sm"
            >
              AI matches
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="explore-section"
        className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 py-20 md:py-24"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-14">
            Why LearnX?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <Feature
              title="Smart AI Matching"
              desc="Our algorithm connects you with the best learning partners."
            />

            <Feature
              title="Flexible Scheduling"
              desc=" Scheduling made easy with integrated calendar support."
            />

            <Feature
              title="Track Your Growth"
              desc="Monitor skill progress and improve consistently."
            />

          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-white border-t py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-gray-600">

          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">
              LearnX
            </h3>
            <p>
              A collaborative learning ecosystem built to connect curious
              minds, enable peer-to-peer knowledge exchange, and empower
              continuous self-development through structured interaction.
            </p>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">
              Community Experience
            </h4>
            <ul className="space-y-2">
              <li>Peer Skill Exchange</li>
              <li>Guided Knowledge Sharing</li>
              <li>Interactive Study Circles</li>
              <li>Growth-Based Collaboration</li>
            </ul>
          </div>

          {/* Platform Values */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">
              Our Approach
            </h4>
            <ul className="space-y-2">
              <li>Mutual Learning Partnerships</li>
              <li>Data-Driven Compatibility</li>
              <li>Time-Aligned Study Planning</li>
              <li>Skill Progress Insights</li>
            </ul>
          </div>

        </div>

        <div className="mt-14 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LearnX. Designed for collaborative growth.
        </div>
      </footer>

    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      className="p-8 rounded-2xl shadow-md bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 hover:shadow-xl transition"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}