import React, { useState, useContext, useEffect } from "react";

import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";

export default function VerifyEmail() {
  const { verifyEmail, resendCode } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const history = useHistory();

  // Prefill email from registration step
  useEffect(() => {
    const stored = localStorage.getItem("pendingEmail");
    if (stored) setEmail(stored);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await verifyEmail({ email, code });
    if (res.success) {
      toast.success("Email verified! Redirecting to login…");
      localStorage.removeItem("pendingEmail");
      history.push("/login");
    } else {
      toast.error(res.message);
    }
  };

  const handleResend = async () => {
    const res = await resendCode({ email });
    if (res.success) {
      toast.success("New code sent to your email");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Verify Your Email</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <label className="block">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Verification Code
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Verify Email
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          className="text-sm text-blue-500 hover:underline"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}
