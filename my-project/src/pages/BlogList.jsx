// src/pages/BlogList.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function BlogList() {
  const { fetchPosts } = useContext(ShopContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const { posts: list } = await fetchPosts({
        page: 1,
        limit: 20,
        status: "published",
      });
      setPosts(list);
    })();
  }, [fetchPosts]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-semibold mb-6">Our Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available yet.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post._id} className="border-b pb-6">
              <Link to={`/blog/${post.slug}`}>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-64 object-cover mb-4 rounded"
                  />
                )}
                <h2 className="text-2xl font-medium hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <p className="text-sm text-gray-500 mt-1">
                By {post.author} on{" "}
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
