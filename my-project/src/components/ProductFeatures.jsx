import React from "react";
import { TbArrowBackUp, TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";

const ProductFeatures = ({ innerRef }) => {
  const features = [
    {
      icon: <TbArrowBackUp className="mb-3 text-yellow-500" />,
      title: "Easy Returns",
      description:
        "Shop with confidence — if your book isn’t quite what you expected, our hassle‑free return process makes it simple to exchange or refund.",
    },
    {
      icon: <TbTruckDelivery className="mb-3 text-red-500" />,
      title: "Fast Delivery",
      description:
        "Get your next great read quickly — we ship orders promptly so your books arrive at your doorstep in no time.",
    },
    {
      icon: <RiSecurePaymentLine className="mb-3 text-blue-500" />,
      title: "Secure Payment",
      description:
        "Your transactions are protected with industry‑leading encryption, ensuring a safe and worry‑free checkout every time.",
    },
  ];

  return (
    <div ref={innerRef} className="mt-12 bg-primary rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 rounded-xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flexCenter gap-x-4 p-4 rounded-3xl bg-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default"
          >
            <div className="text-3xl">{feature.icon}</div>
            <div>
              <h4 className="h4 capitalize">{feature.title}</h4>
              <p className="text-sm text-gray-50">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;
