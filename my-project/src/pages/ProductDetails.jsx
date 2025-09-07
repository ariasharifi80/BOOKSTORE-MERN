import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useParams } from "react-router-dom";
import {
  TbHeart,
  TbShoppingBagPlus,
  TbStarFilled,
  TbStarHalfFilled,
  TbStar,
} from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import ProductDescription from "../components/ProductDescription";
import ProductFeatures from "../components/ProductFeatures";
import RelatedBooks from "../components/RelatedBooks";
import ProductReviews from "../components/ProductReviews";

const ProductDetails = () => {
  const { books, currency, addToCart, cartItems } = useContext(ShopContext);
  const { id } = useParams();
  const book = books.find((b) => b._id === id);

  const [image, setImage] = useState(null);

  // Refs for smooth scrolling
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    if (book && book.image?.length) {
      setImage(book.image[0]);
    }
  }, [book]);

  // Log when cart changes (correct dependency)
  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  const handleJumpToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleJumpToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Helper: compute average rating from localStorage + optional book.reviews
  const { average, count } = useAverageRating(id, book);

  // Hover state for header stars (purely visual)
  const [hoverStar, setHoverStar] = useState(0);

  return (
    book && (
      <div className="max-padd-container py-16 pt-28">
        {/* Breadcrumbs */}
        <p className="text-sm text-gray-500 mb-4">
          <Link to={"/"}>Home</Link> / <Link to={"/shop"}>Shop</Link> /{" "}
          <Link to={`/shop/${book.category}`}>{book.category}</Link> /{" "}
          <span className="font-semibold">{book.name}</span>
        </p>

        {/* BOOK DATA */}
        <div className="flex gap-10 flex-col xl:flex-row my-6">
          {/* IMAGE GALLERY */}
          <div className="flex gap-x-2 max-w-[433px] rounded-xl">
            <div className="flex-1 flexCenter flex-col gap-2 flex-wrap">
              {book.image?.map((item, index) => (
                <div key={index}>
                  <img
                    onClick={() => setImage(item)}
                    src={item}
                    alt={`${book.name} thumbnail ${index + 1}`}
                    className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      image === item ? "border-secondary" : "border-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-[4]">
              <img
                src={image}
                alt={`${book.name} main`}
                className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="px-5 py-3 w-full bg-primary rounded-xl pt-8">
            <h3 className="h3 leading-none">{book.name}</h3>

            {/* Interactive Ratings (click to jump to reviews) */}
            <button
              onClick={handleJumpToReviews}
              className="flex items-center gap-x-2 pt-2 group"
              aria-label="Read or write reviews"
              title="Read or write reviews"
            >
              <div className="flex gap-x-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  const visualFill = hoverStar
                    ? hoverStar
                    : Math.round(average);
                  const filled = idx <= visualFill;
                  return filled ? (
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
              <p className="medium-12 text-gray-300">
                {average.toFixed(1)} • {count} reviews
              </p>
            </button>

            {/* Price */}
            <div className="h4 flex items-baseline gap-4 my-2">
              <h3 className="h3 line-through text-secondary">
                {currency}
                {book.price}.00
              </h3>
              <h4 className="h4 text-green-700">
                {currency}
                {book.offerPrice}.00
              </h4>
            </div>

            {/* Expandable Description */}
            <ExpandableDescription text={book.description} />

            {/* Buttons */}
            <div className="flex items-center gap-x-4 mt-6">
              <button
                onClick={() => addToCart(book._id)}
                className="btn-dark sm:w-1/2 flexCenter gap-x-2 capitalize !rounded-md"
                aria-label="Add to cart"
              >
                Add to Cart <TbShoppingBagPlus />
              </button>
              <button
                className="btn-secondary !rounded-md"
                aria-label="Add to wishlist"
              >
                <TbHeart className="text-xl" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-x-2 mt-3">
              <FaTruckFast className="text-lg" />
              <span className="medium-14">
                Free Delivery on Orders over $100
              </span>
            </div>

            <hr className="my-3 w-2/3" />

            {/* Trust Signals */}
            <div className="mt-2 flex flex-col gap-1 text-gray-30 text-[14px]">
              <p>✅ Authenticity you can Trust</p>
              <p>💵 Enjoy Cash on Delivery</p>
              <p>🔄 Easy Returns Within 7 Days</p>
            </div>
          </div>
        </div>

        {/* Tabs + scroll wiring */}
        <ProductDescription onJumpToFeatures={handleJumpToFeatures} />

        {/* Features */}
        <ProductFeatures innerRef={featuresRef} />

        {/* Reviews */}
        <div ref={reviewsRef}>
          <ProductReviews bookId={id} bookTitle={book.name} />
        </div>

        {/* Related Books */}
        <RelatedBooks book={book} id={id} />
      </div>
    )
  );
};

// Keeps ProductDetails tidy
const ExpandableDescription = ({ text }) => {
  const [showFull, setShowFull] = useState(false);
  if (!text) return null;

  const isLong = text.length > 150;
  const display = showFull || !isLong ? text : `${text.slice(0, 150)}...`;

  return (
    <p className="max-w-[555px]">
      {display}
      {isLong && (
        <span
          onClick={() => setShowFull((s) => !s)}
          className="text-secondary cursor-pointer ml-2 hover:underline"
        >
          {showFull ? "Show Less" : "Read More"}
        </span>
      )}
    </p>
  );
};

// Compute average rating from localStorage + optional book.reviews
function useAverageRating(bookId, book) {
  const [stats, setStats] = useState({ average: 4.5, count: 22 });

  useEffect(() => {
    const local = getStoredReviews(bookId);
    const localCount = local.length;
    const localAvg =
      localCount > 0 ? local.reduce((a, r) => a + r.rating, 0) / localCount : 0;

    // If backend supplies book.reviews, merge it; otherwise fallback to demo
    const backend = Array.isArray(book?.reviews) ? book.reviews : [];
    const backCount = backend.length;
    const backAvg =
      backCount > 0
        ? backend.reduce((a, r) => a + (r.rating || 0), 0) / backCount
        : 0;

    const totalCount = localCount + backCount || 22; // fallback
    const totalAvg =
      localCount + backCount > 0
        ? (localAvg * localCount + backAvg * backCount) /
          (localCount + backCount)
        : 4.5;

    setStats({ average: totalAvg, count: totalCount });
  }, [bookId, book]);

  return stats;
}

function getStoredReviews(bookId) {
  try {
    const raw = localStorage.getItem(`reviews:${bookId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default ProductDetails;
