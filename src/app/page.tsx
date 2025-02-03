"use client";

import { getTotalPushups } from "@/lib/kv";
import { Post, User, supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [user] = useState<User | null>(null);
  const [totalPushups, setTotalPushups] = useState<number>(0);
  const [newPost, setNewPost] = useState("");
  const [pushupCount, setPushupCount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref, inView } = useInView();

  const fetchPosts = async ({ pageParam = 0 }) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(pageParam, pageParam + 9);

    if (error) throw error;
    return data as Post[];
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 10) return undefined;
        return pages.length * 10;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const fetchTotalPushups = async () => {
      const total = await getTotalPushups();
      setTotalPushups(total);
    };
    fetchTotalPushups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const count = parseInt(pushupCount);
    if (isNaN(count) || count <= 0) return;

    const { error } = await supabase.from("posts").insert({
      id: crypto.randomUUID(),
      user_id: user.id,
      caption: newPost,
      pushup_count: count,
    });

    if (!error) {
      setNewPost("");
      setPushupCount("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 relative">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">One Million Pushups</h1>
          <p className="text-xl text-gray-400">
            Total Pushups: {totalPushups.toLocaleString()}
          </p>
        </div>

        <div className="space-y-4">
          {/* Modal Overlay */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
                {user ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your pushup achievement..."
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      rows={3}
                    />
                    <input
                      type="number"
                      value={pushupCount}
                      onChange={(e) => setPushupCount(e.target.value)}
                      placeholder="Number of pushups"
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Post
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Please sign in to post</p>
                    <button
                      onClick={() => {}}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 z-30"
          >
            +
          </button>
          {data?.pages.map((group, i) => (
            <div key={i} className="space-y-4">
              {group.map((post: Post) => (
                <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 mb-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="mb-2">{post.caption}</p>
                  <p className="text-blue-400">{post.pushup_count} pushups</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div ref={ref} className="h-10" />

        {isFetchingNextPage && (
          <p className="text-center mt-4">Loading more...</p>
        )}
      </div>
    </main>
  );
}
