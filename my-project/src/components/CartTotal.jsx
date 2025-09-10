import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";

const CartTotal = () => {
  const {
    navigate,
    books,
    currency,
    cartItems,
    setCartItems,
    method,
    setMethod,
    getCartAmount,
    getCartCount,
    delivery_charges,
    user,
    axios,
  } = useContext(ShopContext);

  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const handleZarinpalPayment = () => {
    toast.error("Zarinpal is currently under maintenance.");
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please Enter Your Address");
      }
      if (method === "zarin") {
        return handleZarinpalPayment();
      }
      let orderItems = [];
      for (const itemId in cartItems) {
        const book = books.find((item) => item._id === itemId);
        book.quantity = cartItems[itemId];
        orderItems.push(book);
      }

      //Convert orderItems to items array for backend
      let items = orderItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));
      //Place order using COD
      if (method === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items,
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  const rawAmount = Number(getCartAmount()) || 0;
  const shippingFee = rawAmount === 0 ? 0 : Number(delivery_charges) || 0;
  const taxRate = 0.05; // 5%
  const tax = rawAmount * taxRate;
  const totalAmt = rawAmount + shippingFee + tax;

  return (
    <div>
      <h3 className="bold-22">
        Order Details
        <span className="bold-14 text-secondary">({getCartCount()}) Items</span>
      </h3>
      <hr className="border-gray-300 my-5" />
      {/* PAYMENT & ADDRESS */}
      <div className="mb-5">
        <div className="my-5">
          <h4 className="h4 mb-5">Where to ship your order?</h4>
          <div className="relative flex justify-between items-start mt-2">
            <p>
              {selectedAddress
                ? `${selectedAddress.street} , ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found :(("}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-secondary medium-14 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-10 py-1 bg-white ring-1 ring-slate-900/10 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100 medium-14"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/address-form")}
                  className="p-2 text-center cursor-pointer hover:bg-tertiary"
                >
                  Add Address
                </p>
              </div>
            )}
          </div>
        </div>
        <hr className="border-gray-300 my-5" />
        <div className="my-6">
          <h4 className="h4 mb-5">Payment Method:</h4>
          <div className="flex gap-3">
            <div
              onClick={() => setMethod("COD")}
              className={`${method === "COD" ? "btn-secondary" : "btn-white"} !py-1 text-xs cursor-pointer`}
            >
              Cash On Delivery
            </div>
            <div
              onClick={() => setMethod("zarin")}
              className={`${method === "zarin" ? "btn-secondary" : "btn-white"} !py-1 text-xs cursor-pointer`}
            >
              ZarinPal
            </div>
          </div>
        </div>
        <hr className="border-gray-300 my-5" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <h5 className="h5">Price</h5>
          <p className="font-bold">
            {currency}
            {getCartAmount()}
          </p>
        </div>
        <div className="flex justify-between">
          <h5 className="h5">Shipping Fee</h5>
          <p className="font-bold">
            {currency}
            {getCartAmount() === 0
              ? "$0.00"
              : `${currency} ${delivery_charges}.00`}
          </p>
        </div>
        <div className="flex justify-between">
          <h5 className="h5">Tax (%5)</h5>
          <p className="font-bold">
            {currency}
            {(getCartAmount() * 5) / 100}
          </p>
        </div>
        <div className="flex justify-between text-lg font-medium mt-3">
          <h4 className="h4">Total Amount:</h4>
          <p className="bold-18">
            {currency}
            {getCartAmount() === 0
              ? "$0.00"
              : getCartAmount() +
                delivery_charges +
                (getCartAmount() * 5) / 100}
          </p>
        </div>
      </div>
      <button onClick={placeOrder} className="btn-dark w-full mt-8 !rounded-md">
        Proceed to Order
      </button>
    </div>
  );
};

export default CartTotal;
