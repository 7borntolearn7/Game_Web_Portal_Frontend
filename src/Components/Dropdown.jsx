import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const image = require("../icons/password.png");
const image2 = require("../icons/add-user.png");
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpen(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      className={`transition-all ${
        isOpen
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-8"
      }`}
    >
      <ul className="mt-1 ml-[58px] flex flex-col gap-y-3">
        <li className="">
          <Link to="changePassword" className="flex flex-row gap-x-2">
            <img src={image} className="w-[20px] h-[20px] mt-[2px]"></img>
            <span className="font-sans text-normal text-[13px] font-medium text-[#3b6d90]">
              Change Password
            </span>
          </Link>
        </li>
        <li>
          <Link to="createuser" className="flex flex-row gap-x-2">
            <img src={image2} className="w-[20px] h-[20px] mt-[2px]"></img>
            <span className="font-sans text-normal text-[13px] font-medium text-[#3b6d90]">
              Create User
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Dropdown;
