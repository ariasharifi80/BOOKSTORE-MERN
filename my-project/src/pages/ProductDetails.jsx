// src/pages/ProductDetails.jsx

import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useParams } from "react-router-dom";
import {
  TbHeart,
  TbHeartFilled,
  TbShoppingBagPlus,
  TbStarFilled,
  TbStar,
} from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import toast from "react-hot-toast";

import ProductFeatures from "../components/ProductFeatures";
import RelatedBooks from "../components/RelatedBooks";
import ProductReviews from "../components/ProductReviews";

// ── Component ───────────────────────────────────────────────────
const ProductDetails = () => {
  // 1. Context + Router hooks
  const {
    navigate,
    books,
    currency,
    addToCart,
    cartItems,
    user,
    userFavorites, // ← plural
    fetchUserFavorites, // ← plural
    toggleFavorite,
  } = useContext(ShopContext);

  // 2. URL param + find the right book
  const { id } = useParams();
  const book = books.find((b) => b._id === id);

  // 3. Local state + refs
  const [image, setImage] = useState(null);
  const [hoverStar, setHoverStar] = useState(0);
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);

  // 4. Custom hook for average rating
  const { average, count } = useAverageRating(id, book);

  // 5. Always-run effects
  useEffect(() => {
    if (user) {
      fetchUserFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (book?.image?.length) {
      setImage(book.image[0]);
    }
  }, [book]);

  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  // 6. If book is not loaded yet, return early (but *after* all hooks above)
  if (!book) {
    return (
      <div className="max-padd-container py-16 pt-28">
        <p className="text-center text-gray-500">Loading book details…</p>
      </div>
    );
  }
  // 7. Computed helpers & scroll handlers
  const isFav = Array.isArray(userFavorites)
    ? userFavorites.some((fav) => fav._id === book._id)
    : false;
  const jumpToFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const jumpToReviews = () =>
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // 8. Book details array
  const details = [
    { label: "Language", value: book.language },
    { label: "Pages", value: book.pages || book.pageCount },
    { label: "Publisher", value: book.publisher },
    { label: "Publication date", value: book.publicationDate },
    { label: "ISBN", value: book.isbn || book.isbn13 },
    { label: "Format", value: book.format },
    { label: "Dimensions", value: book.dimensions },
  ].filter((d) => d.value);

  // console.log("favorites from context:", userFavorites);
  // console.log(
  //   "book._id:",
  //   book._id,
  //   "includes? →",
  //   userFavorites.includes(book._id),
  // );

  // 9. Return the full layout
  return (
    <div className="max-padd-container py-16 pt-28">
      {/* Breadcrumbs */}
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{" "}
        <Link to={`/shop/${book.category}`}>{book.category}</Link> /{" "}
        <span className="font-semibold">{book.name}</span>
      </p>

      {/* Main content */}
      <div className="flex flex-col xl:flex-row gap-10 my-6">
        {/* Image gallery */}
        <div className="flex gap-x-2 max-w-[433px] rounded-xl">
          <div className="flex-1 flexCenter flex-col gap-2 flex-wrap">
            {book.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setImage(img)}
                alt={`${book.name} thumbnail ${idx + 1}`}
                className={`rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                  image === img ? "border-secondary" : "border-transparent"
                }`}
              />
            ))}
          </div>
          <div className="flex flex-[4]">
            <img
              src={image}
              alt={`${book.name} main`}
              className="rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="px-5 py-3 w-full bg-primary rounded-xl pt-8">
          <h3 className="h3 leading-none text-shadow-gray-600">{book.name}</h3>
          {book.author && (
            <p className="mt-1 text-shadow-gray-600 text-sm">
              By{" "}
              <span className="font-medium text-shadow-gray-600">
                {book.author}
              </span>
            </p>
          )}

          {/* Ratings */}
          <button
            onClick={jumpToReviews}
            className="flex items-center gap-x-2 pt-2 group"
          >
            <div className="flex gap-x-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => {
                const idx = i + 1;
                const fill = hoverStar || Math.round(average);
                return fill >= idx ? (
                  <TbStarFilled
                    key={idx}
                    onMouseEnter={() => setHoverStar(idx)}
                    onMouseLeave={() => setHoverStar(0)}
                    className="transition-transform duration-150 group-hover:scale-110"
                  />
                ) : (
                  <TbStar
                    key={idx}
                    onMouseEnter={() => setHoverStar(idx)}
                    onMouseLeave={() => setHoverStar(0)}
                    className="transition-transform duration-150 group-hover:scale-110"
                  />
                );
              })}
            </div>
            <p className="medium-12 text-shadow-gray-600">
              {average.toFixed(1)} • {count} reviews
            </p>
          </button>

          {/* Price */}
          <div className="h4 flex items-baseline gap-4 my-2">
            <h3 className="h3 line-through text--gray-300">
              {currency}
              {book.price}.00
            </h3>
            <h4 className="h4 text-green-400">
              {currency}
              {book.offerPrice}.00
            </h4>
          </div>

          {/* Summary */}
          {book.summary && (
            <div className="mt-4">
              <h5 className="font-semibold text-shadow-gray-600 mb-1">
                Summary
              </h5>
              <p className="max-w-[555px] text-shadow-gray-600">
                {book.summary}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-x-4 mt-6">
            <button
              onClick={() => addToCart(book._id)}
              className="btn-dark sm:w-1/2 flexCenter gap-x-2 capitalize !rounded-md"
            >
              Add to Cart <TbShoppingBagPlus />
            </button>
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please log in to manage favorites.");
                  navigate("/login");
                  return;
                }
                toggleFavorite(book._id);
              }}
              className={`btn-secondary !rounded-md transition-transform duration-150 active:scale-110`}
            >
              {isFav ? (
                <TbHeartFilled className="text-xl text-red-500 transition-colors duration-200" />
              ) : (
                <TbHeart className="text-xl transition-colors duration-200" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-x-2 mt-3">
            <FaTruckFast className="text-lg text-shadow-gray-600" />
            <span className="medium-14 text-shadow-gray-600">
              Free Delivery on Orders over $100
            </span>
          </div>

          <hr className="my-3 w-2/3 border-gray-700" />
          <div className="mt-2 flex flex-col gap-1 text-white text-[14px]">
            <p>✅ Authenticity you can Trust</p>
            <p>💵 Enjoy Cash on Delivery</p>
            <p>🔄 Easy Returns Within 7 Days</p>
          </div>
        </div>
      </div>
      {/* Description Section */}
      <div className="mt-8 bg-primary p-6 rounded-lg shadow-md">
        {details.length > 0 && (
          <>
            <h5 className="text-xl font-semibold mb-4 text-gray-900">
              Book Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-2">
                  <span className="w-32 font-medium text-gray-800">
                    {d.label}:
                  </span>
                  <span className="text-gray-700">{d.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {book.description && (
          <div className="mt-6">
            <h5 className="text-2xl font-semibold mb-2 text-gray-900">
              Description
            </h5>
            <ExpandableText text={book.description} max={300} />
          </div>
        )}
      </div>

      {/* Features, Reviews & Related */}
      <ProductFeatures innerRef={featuresRef} />
      <div ref={reviewsRef}>
        <ProductReviews bookId={id} bookTitle={book.name} />
      </div>
      <RelatedBooks book={book} id={id} />
    </div>
  );
};

// ─── ExpandableText helper ───────────────────────────────────────
const ExpandableText = ({ text, max = 150 }) => {
  const [open, setOpen] = useState(false);
  const isLong = text.length > max;
  const display = open || !isLong ? text : `${text.slice(0, max)}...`;

  return (
    <p className="max-w-[555px] text-gray-800">
      {display}
      {isLong && (
        <span
          onClick={() => setOpen((s) => !s)}
          className="text-blue-600 cursor-pointer ml-2 hover:underline"
        >
          {open ? "Show Less" : "Read More"}
        </span>
      )}
    </p>
  );
};

// ─── Hook: useAverageRating ──────────────────────────────────────
function useAverageRating(bookId, book) {
  const [stats, setStats] = useState({ average: 4.5, count: 0 });

  useEffect(() => {
    const local = getStoredReviews(bookId);
    const back = Array.isArray(book?.reviews) ? book.reviews : [];

    const localCount = local.length;
    const backCount = back.length;
    const totalCount = localCount + backCount;
    const localAvg = localCount
      ? local.reduce((sum, r) => sum + r.rating, 0) / localCount
      : 0;
    const backAvg = backCount
      ? back.reduce((sum, r) => sum + (r.rating || 0), 0) / backCount
      : 0;

    const avg =
      totalCount > 0
        ? (localAvg * localCount + backAvg * backCount) / totalCount
        : 4.5;

    setStats({ average: avg, count: totalCount });
  }, [bookId, book]);

  return stats;
}

// ─── Helper: getStoredReviews ───────────────────────────────────
function getStoredReviews(bookId) {
  try {
    const raw = localStorage.getItem(`reviews:${bookId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default ProductDetails;
