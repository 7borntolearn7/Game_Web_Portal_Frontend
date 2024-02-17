import React, { useContext, useState } from "react";
import { useApihook } from "../ContextApi/Context";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Card from "./Card";
import { data } from "../Data";
const image = require("../icons/spade-token.png");
const image2 = require("../icons/chip.png");
const image3 = require("../icons/jackpot.png");

export default function Signin() {
  const navigate = useNavigate();
  // const [formData, setformData] = useState({
  //   username: "",
  //   password: "",
  // });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPasswod] = useState(false);
  const { user, login } = useApihook();

  function passwordHandler() {
    setShowPasswod(!showPassword);
  }

  // console.log(user);
  // const formHandler = (event) => {
  //   const { name, value } = event.target;
  //   // if (formData.username.trim() === "" || formData.password.trim() === "") {
  //   //   return toast.error("Fill all input fields");
  //   // }
  //   setformData({
  //     ...formData,
  //     [name]: value,
  //   });

  // };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      return toast.error("Fill all input fields");
    }

    const data = { username: username, password: password };
    const response = await login(data);

    if (response && response.status === "RS_OK") {
      console.log("Kya hai response:", response.isEnabled);
      if (response.isEnabled !== true) {
        toast.error("User is inactive");
      } else {
        toast.success("Successfully logged in");
        navigate("/home");
      }
    } else {
      toast.error(response?.message || "Login failed");
    }
  };

  console.log(user);
  return (
    <div>
      <div className="">
        <div className="w-screen h-screen flex flex-row">
          <div className="w-[967px] bg-gray-100 flex">
            <div className="flex flex-col ml-[150px] mt-6 gap-y-4">
              <h1 className="mt-7 font-bold text-2xl font-sans text-black">
                All-in-one account for all Royal Gaming solutions
              </h1>
              <p className="font-medium text-lg leading-7 font-sans text-stone-500">
                Start and grow your casino business with Royal Gaming. Once you
                sign in, <br></br>
                we’ll give you access to all of our products.
              </p>
              <div className="mt-[25px]">
                <ul className="flex flex-row gap-x-20">
                  <li className="flex flex-row gap-x-2 content-baseline">
                    <img
                      src={image}
                      style={{
                        width: "25px",
                        height: "25px",
                        paddingTop: "2px",
                      }}
                    />
                    <h1 className="text-2xl font-medium text-black">Casino</h1>
                  </li>
                  <li className="flex flex-row gap-x-2 content-baseline">
                    <img
                      src={image2}
                      style={{
                        width: "25px",
                        height: "25px",
                        paddingTop: "2px",
                      }}
                    />
                    <h1 className="text-2xl font-medium text-black">
                      Live Casino
                    </h1>
                  </li>
                  <li className="flex flex-row gap-x-2 content-baseline">
                    <img
                      src={image3}
                      style={{
                        width: "25px",
                        height: "25px",
                        paddingTop: "2px",
                      }}
                    />
                    <h1 className="text-2xl font-medium text-black">Slots</h1>
                  </li>
                </ul>
              </div>
              <div className="border-t-2 border-gray-300"></div>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row justify-between">
                  <h1 className="text-black font-sans text-2xl font-bold mt-4">
                    News
                  </h1>
                  <h1 className="text-xl mt-4">See All</h1>
                </div>
                <div className="flex flex-row gap-x-3 mt-[70px]">
                  {data.map((post) => {
                    return <Card key={post.id} post={post}></Card>;
                  })}
                </div>
              </div>
              <div className="border-t-2 border-gray-300 mt-20"></div>
              <div className="display flex flex-row gap-x-28">
                <h1 className="text-black font-sans text-base font-medium">
                  ROYALGAMING 2024
                </h1>
                <div className="display-flex flex-row mt-[2px]">
                  <span className="text-blue-700 text-sm font-light font-sans cursor-pointer">
                    Terms & Conditions
                  </span>
                  <span className="ml-10 text-blue-700 text-sm font-light font-sans cursor-pointer">
                    Private Policy
                  </span>
                  <span className="ml-10 text-blue-700 text-sm font-light font-sans cursor-pointer">
                    Cookie Policy
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[530px] bg-white flex justify-center">
            <div className="w-[374px] h-[416px] ml-5 mt-[80px] flex flex-col gap-y-5">
              <div className="w-full h-[24px]  flex flex-col gap-y-5">
                <h3 className="text-custom-purple font-icomoon font-extralight">
                  <span className="text-pink-800 font-bold text-3xl">
                    ROYAL
                  </span>
                  <span className="text-3xl font-normal">GAMING</span>
                </h3>
                <h3 className="font-icomoon text-black text-2xl font-medium">
                  Sign In
                </h3>
                <p className="font-icomoon text-sm">
                  New to Royal Gaming?
                  <span className="text-custom-purple font-bold"> Sign Up</span>
                </p>
              </div>
              <form
                onSubmit={submitHandler}
                className="flex flex-col mt-20 mb-4 gap-y-3"
              >
                <div className="flex gap-y-2 flex-col mt-7">
                  <label
                    htmlFor="username"
                    className="font-sans text-base font-normal"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border  bg-transparent py-2 pl-3 pr-10 outline-none  focus-visible:shadow-none  focus:border-black"
                    // required
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                </div>

                <div className="flex gap-y-2 flex-col mt-3">
                  <label
                    htmlFor="password"
                    className="font-sans text-base font-normal"
                  >
                    Password
                  </label>
                  <div className="flex justify-between relative">
                    <input
                      name="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border  bg-transparent py-2 pl-3 pr-10 outline-none  focus-visible:shadow-none  focus:border-black"
                      // required
                    />
                    <FaEye
                      onClick={passwordHandler}
                      className="absolute ml-[340px] mt-[8px] cursor-pointer size-5"
                    ></FaEye>
                  </div>
                  <span className="text-blue-600 font-sans text-sm cursor-pointer mt-[]">
                    Forgot Password?
                  </span>
                </div>
                <button className="w-full bg-pink-400 rounded-full p-[12px] text-white hover:bg-pink-600 font-sans mt-[25px] text-base">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
