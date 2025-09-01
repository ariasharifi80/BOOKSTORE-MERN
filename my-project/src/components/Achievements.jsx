import React from "react";
import Title from "./Title";
import { RiSecurePaymentLine, RiSoundModuleLine } from "react-icons/ri";
import { FaUsersLine } from "react-icons/fa6";
import { TbLocation } from "react-icons/tb";

const Achievements = () => {
  const statistics = [
    { label: "Happy Clients", value: 15 },
    { label: "Book Stock", value: 29 },
    { label: "Total Sales", value: 45 },
  ];

  return (
    <section className="mx-auto max-w-[1440px] ">
      {/* CONTAINER */}
      <div className="flex flex-col xl:flex-row gap-12">
        {/* LEFT SIDE */}
        <div className="flex-[2] flex justify-center flex-col bg-gradient-to-l from-tertiary/40 to-white px-6 lg:px-12 py-16">
          <h2 className="h2">Our Journey So Far</h2>
          <p className="py-5 max-w-[47rem]">
            From a Small idea to a growing library, our journey has been fueled
            by a love for stories, knowledge, and the joy of sharing books with
            readers from all walks of life.
          </p>

          {/* STATISTICS CONTAINER */}
          <div className="flex flex-wrap gap-4">
            {statistics.map((statistic, index) => (
              <div key={index} className="p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <h3 className="text-5xl font-sans">{statistic.value}</h3>
                  <h4 className="regular-32">K+</h4>
                </div>
                <p className="capitalize pt-2">{statistic.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-1 relative max-sm:pl-8 flex items-center xl:justify-center pt-5">
          <div className="flex-col">
            <Title
              title1={"About"}
              title2={"Us"}
              titleStyles={"pb-10"}
              paraStyles={"hidden"}
            />
            <div className="flex flex-col items-start">
              <div className="flexCenter gap-3 mb-3">
                <RiSecurePaymentLine className="text-xl" />
                <div>
                  <h5 className="h5">Fast & Secure</h5>
                  <p>Optimized performance</p>
                </div>
              </div>
              <div className="flexCenter gap-3 mb-3">
                <RiSoundModuleLine className="text-xl" />
                <div>
                  <h5 className="h5">Advance Filtering</h5>
                  <p>Find books quickly</p>
                </div>
              </div>
              <div className="flexCenter gap-3 mb-3">
                <FaUsersLine className="text-xl" />
                <div>
                  <h5 className="h5">User Reviews</h5>
                  <p>Rating & FeedBack</p>
                </div>
              </div>
              <div className="flexCenter gap-3 mb-3">
                <TbLocation className="text-xl" />
                <div>
                  <h5 className="h5">Order Tracking</h5>
                  <p>Live Order Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
