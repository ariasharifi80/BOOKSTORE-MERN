import React from "react";
import { TbArrowBackUp, TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";

const ProductFeatures = () => {
  return (
    <div className="mt-12 bg-primary rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 rounded-xl">
        {/* Easy Returns */}
        <div className="flexCenter gap-x-4 p-2 rounded-3xl">
          <div className="text-3xl">
            <TbArrowBackUp className="mb-3 text-yellow-500" />
          </div>
          <div>
            <h4 className="h4 capitalize">Easy Returns</h4>
            <p>
              Shop with confidence — if your book isn’t quite what you expected,
              our hassle‑free return process makes it simple to exchange or
              refund.
            </p>
          </div>
        </div>

        {/* Fast Delivery */}
        <div className="flexCenter gap-x-4 p-2 rounded-3xl">
          <div className="text-3xl">
            <TbTruckDelivery className="mb-3 text-red-500" />
          </div>
          <div>
            <h4 className="h4 capitalize">Fast Delivery</h4>
            <p>
              Get your next great read quickly — we ship orders promptly so your
              books arrive at your doorstep in no time.
            </p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flexCenter gap-x-4 p-2 rounded-3xl">
          <div className="text-3xl">
            <RiSecurePaymentLine className="mb-3 text-blue-500" />
          </div>
          <div>
            <h4 className="h4 capitalize">Secure Payment</h4>
            <p>
              Your transactions are protected with industry‑leading encryption,
              ensuring a safe and worry‑free checkout every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
