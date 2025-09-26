/* eslint-disable no-unused-vars */
// src/pages/MyOrders.jsx
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const MyOrders = () => {
  const { currency, user, axios, orders, setOrders } = useContext(ShopContext);

  const loadOrderData = async () => {
    if (!user) return;
    try {
      const { data } = await axios.post("/api/order/userorders");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [user]);

  // Status badge styling
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-12">
        <Title title1="My Orders" title2="List" titleStyles="pb-10" />
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Looks like you haven't placed any orders. Start shopping to see your
            order history here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-16">
      <Title title1="My Orders" title2="List" titleStyles="pb-10" />

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-500">
                      Order ID:
                    </span>
                    <span className="text-sm font-mono text-gray-700">
                      {order._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      Date:
                    </span>
                    <span className="text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <button
                    onClick={loadOrderData}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        by {item.product.author}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">Qty:</span>
                          <span className="font-medium text-gray-900">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="font-medium text-gray-900">
                            {currency}
                            {item.product.offerPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Payment Details
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {order.paymentMethod || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium ${
                            order.isPaid ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <h5 className="font-medium text-gray-900 mb-2">
                      Order Total
                    </h5>
                    <div className="text-lg font-bold text-gray-900">
                      {currency}
                      {order.amount}
                    </div>
                    {order.address && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Shipping to:</p>
                        <p className="font-medium">{order.address.name}</p>
                        <p className="line-clamp-2">
                          {order.address.street}, {order.address.city}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
