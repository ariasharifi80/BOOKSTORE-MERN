import React from "react";
import { Link } from "react-router-dom";

const ZarinpalMaintenance = () => {
  return (
    <div className="max-padd-container flexCenter min-h-screen flex-col gap-6 bg-[var(--color-primary)] text-center">
      <h1 className="bold-48 text-secondary">
        پرداخت با زرین‌پال در دست تعمیر است
      </h1>
      <p className="regular-18 text-gray-50 max-w-[600px]">
        در حال حاضر امکان پرداخت از طریق زرین‌پال وجود ندارد. تیم ما در حال
        به‌روزرسانی سیستم پرداخت است. لطفاً در زمان دیگری دوباره امتحان کنید.
      </p>
      <Link to="/" className="btn-secondary mt-4">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
};

export default ZarinpalMaintenance;
