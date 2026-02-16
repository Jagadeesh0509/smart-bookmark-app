"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
};

type Props = {
  user: User;
};

export default function BookmarkList({ user }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookmarks(data);
      }
      setLoading(false);
    };

    fetchBookmarks();

    // Subscribe to real-time changes
    const channel: RealtimeChannel = supabase
      .channel(`bookmarks:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [
              payload.new as Bookmark,
              ...prev,
            ]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? (payload.new as Bookmark) : b
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  if (loading) {
    return <p className="text-center py-8">Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500">
        No bookmarks yet. Create one to get started!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-zinc-800"
        >
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-black dark:text-white wrap-break-word">
                {bookmark.title}
              </p>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm break-all"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shrink-0"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
