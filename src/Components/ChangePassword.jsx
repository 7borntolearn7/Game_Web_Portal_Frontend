import React, { useState } from "react";
import { useApihook } from "../ContextApi/Context";
import { toast, ToastContainer } from "react-toastify";
function ChangePassword() {
  const { changePassword } = useApihook();
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    const response = await changePassword(data);

    if (response && response.data.status === "RS_OK") {
      toast.success("Password Changed Successfuly");
    } else {
      toast.error(response.data.message);
    }
  };
  return (
    <div className="ml-[350px] mt-3 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray p-6 rounded-lg w-[300px] mt-[70px] bg-blue-300 flex flex-col gap-y-2"
      >
        <label className="block text-black font-bold mb-2" htmlFor="username">
          Username*
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className="w-full p-2 rounded border bg-white text-black mt-[-10px]"
          required
        />

        <label
          className="block text-black font-bold mb-2 mt-2"
          htmlFor="oldPassword"
        >
          Old Password*
        </label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          className="w-full p-2 rounded border bg-white text-black mt-[-10px]"
          required
        />

        <label
          className="block text-black font-bold mt-4 mb-2"
          htmlFor="newPassword"
        >
          New Password*
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={handleNewPasswordChange}
          className="w-full p-2 rounded border bg-white text-black mt-[-10px]"
          required
        />

        <label
          className="block text-black font-bold mt-4 mb-2"
          htmlFor="confirmPassword"
        >
          Confirm Password*
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="w-full p-2 rounded border bg-white text-black mt-[-10px]"
          required
        />
        <button
          type="submit"
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 rounded text-center"
        >
          Change Password
        </button>
      </form>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default ChangePassword;
