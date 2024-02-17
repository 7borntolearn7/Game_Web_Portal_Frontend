import React, { useState, useEffect } from "react";
import { useApihook } from "../ContextApi/Context";
import DynamicTimeDisplay from "./dynamicTime";
import { toast } from "react-toastify";
import "../Modal.css";
const image1 = require("../icons/time.png");
const image2 = require("../icons/united-states.png");
const image3 = require("../icons/user.png");
const image4 = require("../icons/beard.png");

const Navbar = () => {
  const { user, logout, changePassword, updateUser } = useApihook();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [username, setUsername] = useState(user.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setemail] = useState(user.email);
  const [isEnabled, setisEnabled] = useState(user.isEnabled);
  const [uid, setUid] = useState(user.id);
  console.log("Active is:", isEnabled);
  const openModal = (e) => {
    console.log("Opening modal");
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const openModal2 = (e) => {
    console.log("Opening modal");
    e.stopPropagation();
    setIsModalOpen2(true);
  };
  const closeModal2 = (e) => {
    console.log("Closing modal");
    setIsModalOpen2(false);
  };
  useEffect(() => {
    setUsername(user.user);
  }, [user.user]);
  useEffect(() => {
    setemail(user.email);
  }, [user.email]);
  useEffect(() => {
    setisEnabled(user.isEnabled);
  }, [user.isEnabled]);
  const closeModal = (e) => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      console.log("Click outside modal", e);
      if (isModalOpen2 && !e.target.closest(".modal-content")) {
        closeModal2();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen2]);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      console.log("Click outside modal", e);
      if (isModalOpen && !e.target.closest(".modal-content")) {
        closeModal();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };

  const handleIsEnabledChange = (e) => {
    setisEnabled(e.target.checked);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      email: email,
      isEnabled: isEnabled,
    };
    try {
      await updateUser(data, uid);
      closeModal2();
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    const response = await changePassword(data);
    console.log("response is:", response);
    if (response && response.data.status === "RS_OK") {
      console.log("response is:", response.data.message);
      toast.success("Password Changed Successfuly");
    } else {
      toast.error("Invalid Credentials");
    }

    closeModal();
  };
  const handleProfileClick = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="bg-white p-[26px] border-b-2 shadow-md h-5 w-full relative">
      <div className="container mx-auto flex ml-[1140px]">
        <div className="text-black flex flex-row gap-x-4 mt-[-12px]">
          <span className="mr-4 mt-1  text-sm text-[#3d6e8f] font-bold font-sans">
            Limit: 30000
          </span>
          <span className="mr-4 flex gap-x-2">
            <img
              src={image1}
              style={{ height: "25px", width: "25px", color: "#3d6e8f" }}
              alt="Time"
            ></img>
            <DynamicTimeDisplay />
          </span>
        </div>

        <div className="flex items-center gap-x-8 ml-4 mt-[-15px]">
          <div className="relative group">
            {/* Country Dropdown */}
            <button className="flex items-center text-black">
              {/* Placeholder for the country flag */}
              <img
                src={image2}
                style={{ height: "25px", width: "25px", marginTop: "5px" }}
                alt="Country"
              ></img>
            </button>

            {/* Add more countries as needed */}
          </div>

          <div className="ml-[2px] relative group mt-1">
            {/* User Dropdown */}
            <button
              className="flex items-center text-black gap-x-2"
              onClick={handleProfileClick}
            >
              <span className="">
                <img
                  src={image3}
                  className="w-[25px] h-[25px]"
                  alt="User"
                ></img>{" "}
              </span>
              {/* <span className="text-sm text-[#3d6e8f] font-bold font-sans">
                {}
              </span>{" "} */}
            </button>

            {profileDropdownVisible && (
              <div className="flex flex-col gap-y-2 absolute items-center top-full left-[-250px] mt-[10px] bg-white p-4 border border-gray-300 rounded-md w-[300px] h-[265px]">
                <div className="text-sm font-sans font-bold">{user.email}</div>
                <img
                  src={image4}
                  alt="Profile"
                  className="w-[70px] h-[70px] rounded-full mb-2"
                />
                <span className="text-xl font-bold mb-2">{`Hi! ${user.user}`}</span>
                <div className="flex gap-x-2">
                  <button
                    className="bg-blue-500 text-white p-2 pl-10 pr-10 rounded-full hover:bg-blue-600"
                    onClick={openModal2}
                  >
                    Profile
                  </button>
                  {isModalOpen2 && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h2 className="text-center font-bold font-sans text-xl text-black">
                          Edit Profile
                        </h2>
                        <div className="w-150 h-[0.25px] bg-green-500 mt-1 mx-auto"></div>
                        <form className="flex flex-col gap-y-5 mt-[20px]">
                          <label className="flex flex-col text-black font-medium">
                            Username*
                            <input
                              type="text"
                              name="username"
                              value={username}
                              onChange={handleUsernameChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col text-black font-medium">
                            Email*
                            <input
                              type="email"
                              name="email"
                              value={email}
                              onChange={handleEmailChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          </label>
                          <label className="flex flex-row gap-x-1 text-black font-medium">
                            <input
                              type="checkbox"
                              name="isEnabled"
                              checked={isEnabled}
                              onChange={handleIsEnabledChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                            Active*
                          </label>
                          <button
                            type="button"
                            onClick={handleSubmit2}
                            className="bg-green-500 text-white px-4 py-2 border rounded"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                  <button
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                    onClick={openModal}
                  >
                    Change Password
                  </button>
                  {isModalOpen && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h2 className="text-center font-bold font-sans text-xl text-black">
                          Change Password
                        </h2>
                        <div className="w-150 h-[0.25px] bg-green-500 mt-1 mx-auto"></div>
                        <form className="flex flex-col gap-y-5 mt-[20px]">
                          <label className="flex flex-col text-black font-medium">
                            Username*
                            <input
                              type="text"
                              name="username"
                              value={username}
                              // onChange={handleInputChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col text-black font-medium">
                            Old Password*
                            <input
                              type="password"
                              name="oldPassword"
                              value={oldPassword}
                              onChange={handleOldPasswordChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col text-black font-medium">
                            New Password*
                            <input
                              type="password"
                              name="newPassword"
                              value={newPassword}
                              onChange={handleNewPasswordChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col text-black font-medium">
                            Confirm Password*
                            <input
                              type="password"
                              name="confirmPassword"
                              value={confirmPassword}
                              onChange={handleConfirmPasswordChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-green-500 text-white px-4 py-2 border rounded"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white p-2 rounded-md w-[247px] hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
