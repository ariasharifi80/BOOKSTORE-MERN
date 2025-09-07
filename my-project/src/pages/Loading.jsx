/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";

const Loading = () => {
  const { navigate } = useContext(ShopContext);
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get("next");

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate(`${nextUrl}`);
      }, 5000);
    }
  }, [nextUrl]);
  return (
    <div className="flexCenter h-screen">
      <div className="animate-spin h-24 w-24 border-4 border-gray-300 border-t-secondary rounded-full" />
    </div>
  );
};

export default Loading;
