"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User;
};

export default function BookmarkForm({ user }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setMessage({ type: "error", text: "Please enter a valid URL" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setUrl("");
      setMessage({ type: "success", text: "Bookmark added successfully!" });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "error", text: error.message });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Add New Bookmark</h2>
      
      <input
        type="text"
        placeholder="Bookmark title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-zinc-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        required
      />
      
      <input
        type="url"
        placeholder="URL (e.g., https://example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-zinc-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        required
      />
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-3 rounded font-semibold transition-colors"
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>

      {message && (
        <div className={`mt-3 p-3 rounded text-sm ${
          message.type === "success"
            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
        }`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
