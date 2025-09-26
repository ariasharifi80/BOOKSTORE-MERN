// src/pages/BlogDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function BlogDetail() {
  const { slug } = useParams();
  const { fetchPostBySlug } = useContext(ShopContext);
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await fetchPostBySlug(slug);
      setPost(result);
    })();
  }, [slug, fetchPostBySlug]);

  if (!post) {
    return <div className="text-center py-10">Loading…</div>;
  }

  return (
    <article className="prose lg:prose-xl mx-auto py-8 px-4">
      <Link
        to="/blog"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Blog
      </Link>
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {post.author} on {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-96 object-cover rounded mb-6"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
