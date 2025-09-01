import React from "react";

const ProductDescription = () => {
  return (
    <div className="mt-14 ring-1 ring-slate-900/10 rounded-lg">
      <div className="flex gap-3">
        <button className="medium-14 p-3 w-32 border-b-2 border-secondary">
          Description
        </button>
        <button className="medium-14 p-3 w-32">Author Info</button>
        <button className="medium-14 p-3 w-32">Key Features</button>
      </div>
      <hr className="h-[1px] w-full border-gray-500/30" />
      <div className="flex flex-col gap-3 p-3">
        <div>
          <h5 className="h5">Details</h5>
          <p>
            This captivating title invites readers into a world of imagination,
            emotion, and discovery. Crafted with rich storytelling and memorable
            characters, it’s a book that resonates long after the final page.
            Whether you’re seeking adventure, inspiration, or a quiet escape,
            this work offers a reading experience to treasure.
          </p>
          <p>
            Suitable for a wide range of readers, it makes a perfect addition to
            any personal library or a thoughtful gift for someone special.
          </p>
        </div>
        <div>
          <h5 className="h5">Benefits</h5>
          <ul className="list-disc pl-5 text-sm flex flex-col gap1">
            <li className="text-gray-50">
              Engaging narrative that appeals to diverse audiences
            </li>
            <li className="text-gray-50">
              High‑quality print and durable binding
            </li>
            <li className="text-gray-50">
              Ideal for collectors, book clubs, and casual readers alike
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
