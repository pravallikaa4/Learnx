import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Matches", path: "/matches" },
    { name: "Scheduler", path: "/scheduler" },
    { name: "Chat", path: "/chat" },
  ];

  return (
    <div className="w-64 bg-white border-r border-border p-6">
      <h2 className="text-xl font-semibold mb-10">LearnX</h2>

      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              location.pathname === link.path
                ? "bg-black text-white"
                : "text-muted hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
