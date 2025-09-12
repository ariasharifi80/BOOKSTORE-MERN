import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";

const Login = () => {
  const { showUserLogin, navigate, setShowUserLogin, axios, fetchUser } =
    useContext(ShopContext);

  // Added one more mode and one more piece of state
  const [state, setState] = useState("login"); // "login" | "register" | "verify"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(""); // ← holds the 6-digit code

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // 1) VERIFY EMAIL MODE
      if (state === "verify") {
        const { data } = await axios.post("/api/user/verify-email", {
          email,
          code,
        });
        if (data.success) {
          toast.success("Email verified! Please log in.");
          setState("login");
        } else {
          toast.error(data.message);
        }
        return;
      }

      // 2) LOGIN or REGISTER
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        if (state === "register") {
          toast.success("Account created—check your email for the code");
          setState("verify"); // switch into verify mode
        } else {
          toast.success("Login successful");
          navigate("/");
          await fetchUser();
          setShowUserLogin(false);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Hit this when user clicks “Resend Code”
  const onResendCode = async () => {
    try {
      const { data } = await axios.post("/api/user/resend-code", { email });
      data.success
        ? toast.success("New code sent to your email")
        : toast.error(data.message);
    } catch {
      toast.error("Could not resend code. Try again later.");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 flex items-center justify-center bg-black/50 text-sm text-gray-600 z-40"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <h3 className="bold-28 mx-auto mb-3 ">
          <span className="text-secondary capitalize">User </span>
          <span className="capitalize">
            {state === "login"
              ? "Login"
              : state === "register"
                ? "Register"
                : "Verify Email"}
          </span>
        </h3>

        {state === "register" && (
          <div className="w-full">
            <p className="medium-14">Name</p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type Here..."
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-black/80"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="medium-14">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type Here..."
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-black/80"
            required
          />
        </div>

        {/* For login/register we show password input */}
        {(state === "login" || state === "register") && (
          <div className="w-full">
            <p className="medium-14">Password</p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Type Here..."
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-black/80"
              required
            />
          </div>
        )}

        {/* For verify mode we show code input + resend link */}
        {state === "verify" && (
          <>
            <div className="w-full">
              <p className="medium-14">Verification Code</p>
              <input
                type="text"
                onChange={(e) => setCode(e.target.value)}
                value={code}
                placeholder="Enter 6-digit code"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-black/80"
                required
              />
            </div>
            <p
              onClick={onResendCode}
              className="text-secondary cursor-pointer text-sm"
            >
              Resend Code
            </p>
          </>
        )}

        {/* switch links */}
        {state !== "verify" ? (
          state === "register" ? (
            <p>
              Already have an account?
              <span
                onClick={() => setState("login")}
                className="text-secondary cursor-pointer"
              >
                {" "}
                click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?
              <span
                onClick={() => setState("register")}
                className="text-secondary cursor-pointer"
              >
                {" "}
                click here
              </span>
            </p>
          )
        ) : (
          <p className="text-sm">
            Already verified?
            <span
              onClick={() => setState("login")}
              className="text-secondary cursor-pointer"
            >
              {" "}
              go to login
            </span>
          </p>
        )}

        <button type="submit" className="btn-secondary w-full rounded !py-2.5">
          {state === "login"
            ? "Login"
            : state === "register"
              ? "Create Account"
              : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default Login;
