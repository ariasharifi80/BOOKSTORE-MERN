import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";

const AddressForm = () => {
  const { navigate, user, method, setMethod, axios } = useContext(ShopContext);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setAddress((data) => ({ ...data, [name]: value }));
    console.log(address);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user]);

  return (
    <div className="max-padd-container py-16 pt-28">
      {/* CONTAINER */}
      <div className="flex flex-col xl:flex-row gap-20 xl:gap-28">
        {/* LEFT SIDE */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-[2] flex-col gap-3 text-[95%]"
        >
          <Title
            title1={"Delivery"}
            title2={"Information"}
            titleStyles={"pb-5"}
          />
          <div className="flex gap-3">
            <input
              onChange={onChangeHandler}
              value={address.firstName}
              type="text"
              name="firstName"
              placeholder="First Name"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2"
              required
            />
            <input
              onChange={onChangeHandler}
              value={address.lastName}
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2"
              required
            />
          </div>
          <input
            onChange={onChangeHandler}
            value={address.email}
            type="email"
            name="email"
            placeholder="Email"
            className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none"
            required
          />
          <input
            onChange={onChangeHandler}
            value={address.phone}
            type="phone"
            name="phone"
            placeholder="Phone"
            className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none"
            required
          />
          <input
            onChange={onChangeHandler}
            value={address.street}
            type="street"
            name="street"
            placeholder="Street"
            className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none"
            required
          />
          <div className="flex gap-3">
            <input
              onChange={onChangeHandler}
              value={address.city}
              type="city"
              name="city"
              placeholder="City"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2"
              required
            />
            <input
              onChange={onChangeHandler}
              value={address.state}
              type="state"
              name="state"
              placeholder="State"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2"
              required
            />
          </div>
          <div className="flex gap-3">
            <input
              onChange={onChangeHandler}
              value={address.zipcode}
              type="zipcode"
              name="zipcode"
              placeholder="Zip code"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2"
              required
            />
            <input
              onChange={onChangeHandler}
              value={address.country}
              type="country"
              name="country"
              placeholder="Country"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2"
              required
            />
          </div>
          <button type="submit" className="btn-dark rounded-md w-1/2 mt-2">
            Add Address
          </button>
        </form>

        {/* RIGHT SIDE */}
        <div className="flex flex-1 flex-col">
          <div className="max-w-[379] w-full bg-primary p-5 py-10 max-md:mt-16 rounded-xl">
            <CartTotal method={method} setMethod={setMethod} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
