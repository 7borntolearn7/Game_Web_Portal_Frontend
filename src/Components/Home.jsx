import React, { useState } from "react";
import "./css/style.css";
import { NavLink, Route, Routes, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Dropdown from "./Dropdown";
import Games from "./Games";
import Operator from "./Operator";
//import CreateUser from "./CreateUser";
import ChangePassword from "./ChangePassword";
import Dashboard from "./Dashboard";
import OperatorGames from "./OperatorGames";
import Users from "./Users";
import TransactionData from "./TransactionData";
import FailedTransactionData from "./FailedTransactionData";
import TransactionLogs from "./TransactionLogs";

const image = require("../icons/text-align.png");
const image2 = require("../icons/game-console .png");
const image3 = require("../icons/operator.png");
const image4 = require("../icons/setting.png");
const image5 = require("../icons/up-and-down.png");
const image6 = require("../icons/dashboard.png");
const image7 = require("../icons/gaming-commentator.png");
const image8 = require("../icons/man.png");
const image9 = require("../icons/transaction.png");
const image10 = require("../icons/payment-status.png");
const image11 = require("../icons/log-file.png");
function Home() {
  const [activeLink, setActiveLink] = useState(null);
  // const [showDropdown, setShowDropdown] = useState(false);

  function sizeHandler() {
    setActiveLink(null);
  }

  function linkClickHandler(index) {
    setActiveLink(index);
  }

  // function dropdownHandler() {
  //   setShowDropdown(!showDropdown);
  // }

  const navLinks = [
    { to: "dashboard", text: "Dashboard", image: image6 },
    { to: "games", text: "Games", image: image2 },
    { to: "operator", text: "Operators", image: image3 },
    { to: "operatorGames", text: "Operator Games", image: image7 },
    { to: "transactionsdata", text: "Transactions Data", image: image9 },
    { to: "failedtransactions", text: "Failed Transactions", image: image10 },
    { to: "transactionlogs", text: "Logs", image: image11 },
    { to: "users", text: "Users", image: image8 },
  ];

  return (
    <div>
      <section className="bg-[#f5f7fa]">
        <div className="flex flex-row gap-x-[220px] relative">
          <aside className="absolute z-10">
            <div className="fixed h-full w-[240px] bg-white shadow-lg mt-2">
              <ul
                className="mr-10 flex flex-col gap-y-1 mt-[20px]"
                id="nav-accordion"
              >
                <li>
                  <div className="text-[#1B9CFB] mt-[-3px] flex items-center gap-x-20">
                    <div className="text-[17px]">
                      <span className="text-blue-600 ml-4 font-bold">
                        ROYAL
                      </span>
                      GAMING
                    </div>
                    <img
                      src={image}
                      className="w-6 h-5 cursor-pointer"
                      onClick={sizeHandler}
                      alt="Toggle Image"
                    />
                  </div>
                </li>

                {navLinks.map((link, index) => (
                  <li key={index} className="w-[237px] mt-2 flex flex-row">
                    <NavLink
                      to={link.to}
                      className={`w-full ml-2 p-2 pl-7 bg-white hover:bg-gray-100 rounded-md transition-all flex items-center gap-x-4 ${
                        activeLink === index ? "active" : ""
                      }`}
                      onClick={() => linkClickHandler(index)}
                    >
                      <img
                        src={link.image}
                        className="w-5 h-5"
                        alt={`${link.text} Icon`}
                      />
                      <span
                        style={{
                          fontSize: "15px",
                          lineHeight: "23px",
                          fontFamily: "Roboto, Arial, sans-serif",
                        }}
                        className={`font-sans text-[14px] ${
                          activeLink === index ? "text-white" : "text-[#3b6d90]"
                        }`}
                      >
                        {link.text}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <Navbar className="absolute z-0"></Navbar>
        </div>

        <Routes>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/games" element={<Games></Games>}></Route>
          <Route path="/operator" element={<Operator></Operator>}></Route>
          <Route
            path="/operatorGames"
            element={<OperatorGames></OperatorGames>}
          ></Route>
          <Route
            path="/transactionsdata"
            element={<TransactionData></TransactionData>}
          ></Route>
          <Route
            path="/failedtransactions"
            element={<FailedTransactionData></FailedTransactionData>}
          ></Route>
          <Route
            path="/transactionlogs"
            element={<TransactionLogs></TransactionLogs>}
          ></Route>
          <Route path="/users" element={<Users></Users>}></Route>
        </Routes>
        <button></button>
      </section>
    </div>
  );
}

export default Home;
