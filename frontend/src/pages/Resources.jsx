import { useState } from "react";

export default function Resources() {
  const GOOGLE_API_KEY = "AIzaSyCJTZ_YDb8HYSBqtHm38Tad61WSxaHzcwk"; // keep restricted in Google Console

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=12&printType=books&key=${GOOGLE_API_KEY}`
      );

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("API quota exceeded. Try again later.");
        }
        throw new Error("Failed to fetch books.");
      }

      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10">
          Book Learning Hub
        </h2>

        {/* SEARCH BAR */}
        <form
          onSubmit={searchBooks}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            Search
          </button>
        </form>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 mb-6">
            Searching...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-500 mb-6">
            {error}
          </p>
        )}

        {/* RESULTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((book) => {
            const info = book.volumeInfo || {};

            return (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={
                    info.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/300x400?text=No+Image"
                  }
                  alt={info.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {info.title || "No Title"}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4">
                    {info.authors?.join(", ") || "Unknown Author"}
                  </p>

                  {info.previewLink && (
                    <button
                      onClick={() =>
                        window.open(info.previewLink, "_blank")
                      }
                      className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition"
                    >
                      Read Preview
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!loading && results.length === 0 && !error && (
          <p className="text-center text-gray-400 mt-16">
            Start searching to discover books.
          </p>
        )}
      </div>
    </div>
  );
}