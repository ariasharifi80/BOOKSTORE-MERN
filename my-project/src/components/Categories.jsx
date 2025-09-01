import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { categories } from "../assets/data";

const Categories = () => {
  const { navigate } = useContext(ShopContext);
  const colors = ["bg-[#aedae6]", "bg-[#fff6c9]", "bg-[#fddbdb]"];

  return (
    <section className="max-padd-container pt-16 pb-6 ">
      <Title
        title1={"Category "}
        title2={"List"}
        titleStyles={"pb-6"}
        paraStyles={"hidden"}
      />

      {/* CONTAINER */}

      <div className="flex gap-9 flex-wrap pl-9">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => navigate(`/shop/${cat.name.toLowerCase()}`)}
            className="flexCenter flex-col cursor-pointer group"
          >
            <div
              className={`flexCenter flex-col h-36 w-36 sm:h-40 sm:w-40 rounded-xl ${
                colors[index % 3]
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="object-cover"
                height={46}
                width={46}
              />
              <h5 className="h5 capitalize mt-6">{cat.name}</h5>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
