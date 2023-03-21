import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl font-medium">
        Rất tiếc, trang này hiện không khả dụng.
      </h1>
      <p className="text-md">
        Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ.
        <Link to="/" className="text-blue-900">
          Quay lại Instagram.
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
