/* eslint-disable no-unused-vars */
// src/components/Achievements.jsx
import React from "react";
import { motion } from "framer-motion";
import { RiSecurePaymentLine, RiSoundModuleLine } from "react-icons/ri";
import { FaUsersLine } from "react-icons/fa6";
import { TbLocation } from "react-icons/tb";

const Achievements = () => {
  const statistics = [
    { label: "Happy Clients", value: 15, suffix: "K+" },
    { label: "Book Stock", value: 29, suffix: "K+" },
    { label: "Total Sales", value: 45, suffix: "K+" },
  ];

  const features = [
    {
      icon: <RiSecurePaymentLine className="text-2xl" />,
      title: "Fast & Secure",
      desc: "Optimized performance with end-to-end encryption",
    },
    {
      icon: <RiSoundModuleLine className="text-2xl" />,
      title: "Advanced Filtering",
      desc: "Find books by genre, author, or rating in seconds",
    },
    {
      icon: <FaUsersLine className="text-2xl" />,
      title: "User Reviews",
      desc: "Trusted ratings & authentic community feedback",
    },
    {
      icon: <TbLocation className="text-2xl" />,
      title: "Order Tracking",
      desc: "Real-time updates from warehouse to doorstep",
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side - Stats */}
        <motion.div
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={item}
          >
            Our Journey So Far
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-8 max-w-lg leading-relaxed"
            variants={item}
          >
            From a small idea to a growing library, our journey has been fueled
            by a love for stories, knowledge, and the joy of sharing books with
            readers worldwide.
          </motion.p>

          {/* Stats Grid */}
          <motion.div className="grid grid-cols-3 gap-4" variants={container}>
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white transition-all duration-300"
                variants={item}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center items-end gap-1 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-600">
                    {stat.value}
                  </span>
                  <span className="text-lg text-gray-500">{stat.suffix}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Features */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              About <span className="text-gray-600">Us</span>
            </h2>
            <p className="text-gray-600 max-w-md">
              We build more than just a bookstore — we create a reading
              experience.
            </p>
          </div>

          <div className="space-y-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300"
                variants={item}
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-gray-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
