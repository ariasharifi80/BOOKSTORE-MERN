import React, { useState } from "react";

const ProductDescription = ({ onJumpToFeatures }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "author", label: "Author Info" },
    { id: "features", label: "Key Features" },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (id === "features" && typeof onJumpToFeatures === "function") {
      // Smoothly scroll to the features section below
      onJumpToFeatures();
    }
  };

  const tabContent = {
    description: (
      <>
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
          <ul className="list-disc pl-5 text-sm flex flex-col gap-1">
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
      </>
    ),
    author: (
      <div>
        <h5 className="h5">About the Author</h5>
        <p>
          The author is a celebrated storyteller whose works have touched
          readers worldwide. Known for blending vivid imagery with emotional
          depth, their writing invites readers to explore new perspectives and
          embrace the beauty of language.
        </p>
      </div>
    ),
    // Keep a teaser here; full list lives in the ProductFeatures section below
    features: (
      <div>
        <h5 className="h5">Key Features</h5>
        <ul className="list-disc pl-5 text-sm flex flex-col gap-1">
          <li className="text-gray-50">Premium quality materials</li>
          <li className="text-gray-50">Exclusive cover design</li>
          <li className="text-gray-50">Includes bonus reading guide</li>
        </ul>
        <p className="mt-2 text-secondary">Scrolling to full features…</p>
      </div>
    ),
  };

  return (
    <div className="mt-14 ring-1 ring-slate-900/10 rounded-lg">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`medium-14 p-3 w-32 transition-all duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-secondary text-secondary"
                : "hover:text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <hr className="h-[1px] w-full border-gray-500/30" />

      {/* Content */}
      <div className="flex flex-col gap-3 p-3">{tabContent[activeTab]}</div>
    </div>
  );
};

export default ProductDescription;
