import React, { useEffect, useMemo, useState } from "react";
import { TbStar, TbStarFilled } from "react-icons/tb";

const ProductReviews = ({ bookId, bookTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`reviews:${bookId}`);
      setReviews(raw ? JSON.parse(raw) : []);
    } catch {
      setReviews([]);
    }
  }, [bookId]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(`reviews:${bookId}`, JSON.stringify(reviews));
    } catch {}
  }, [bookId, reviews]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (rating < 1 || rating > 5) return setError("Please select a rating.");
    if (!comment.trim()) return setError("Please write a short review.");

    const newReview = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setRating(0);
    setHover(0);
    setComment("");
  };

  return (
    <div className="mt-12 ring-1 ring-slate-900/10 rounded-lg p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h4 className="h4">Customer Reviews</h4>
        <div className="flex items-center gap-2">
          <StarBar value={avg} />
          <span className="text-sm text-gray-300">
            {avg ? avg.toFixed(1) : "No ratings yet"}
          </span>
        </div>
      </div>

      {/* Review form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="bg-transparent ring-1 ring-slate-700 rounded-md px-3 py-2 outline-none focus:ring-secondary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Your rating</label>
          <div className="flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => {
              const idx = i + 1;
              const filled = idx <= (hover || rating);
              const Icon = filled ? TbStarFilled : TbStar;
              return (
                <Icon
                  key={idx}
                  className="cursor-pointer transition-transform duration-150 hover:scale-110"
                  onMouseEnter={() => setHover(idx)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(idx)}
                  aria-label={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
                  title={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
                />
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm">Your review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder={`What did you think about "${bookTitle}"?`}
            className="bg-transparent ring-1 ring-slate-700 rounded-md px-3 py-2 outline-none focus:ring-secondary resize-y"
          />
        </div>

        {error && (
          <div className="md:col-span-2 text-red-400 text-sm">{error}</div>
        )}

        <div className="md:col-span-2">
          <button type="submit" className="btn-dark !rounded-md">
            Submit review
          </button>
        </div>
      </form>

      {/* Reviews list */}
      <div className="mt-8 flex flex-col gap-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-lg ring-1 ring-slate-800 p-4 bg-primary/50"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{r.name}</p>
                <StarBar value={r.rating} />
              </div>
              <p className="mt-2 text-sm text-gray-100">{r.comment}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StarBar = ({ value = 0 }) => {
  // value can be fractional; show halves visually by rounding
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        return idx <= rounded ? (
          <TbStarFilled key={idx} />
        ) : (
          <TbStar key={idx} />
        );
      })}
    </div>
  );
};

export default ProductReviews;
