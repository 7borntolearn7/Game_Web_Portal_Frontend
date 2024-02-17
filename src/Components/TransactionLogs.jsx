import React, { useState, useEffect } from "react";
import "../Modal.css";
import { useApihook } from "../ContextApi/Context";
import { toast, ToastContainer } from "react-toastify";
import CustomizedTables7 from "./CustomizedTables7";

function TransactionLogs() {
  const {
    getAllGames,
    gameList,
    getTransactionLogs,
    transactionLogs,
    loading,
  } = useApihook();

  // Load data from localStorage on component mount
  const [selectedGame, setSelectedGame] = useState(
    localStorage.getItem("selectedGame") || ""
  );
  const [fromDate, setFromDate] = useState(
    localStorage.getItem("fromDate") || ""
  );
  const [toDate, setToDate] = useState(localStorage.getItem("toDate") || "");
  const [isDataFetchEnabled, setIsDataFetchEnabled] = useState(false);

  useEffect(() => {
    getAllGames();
  }, []);

  useEffect(() => {
    // Update local storage when state changes
    localStorage.setItem("selectedGame", selectedGame);
  }, [selectedGame]);

  useEffect(() => {
    // Update local storage when state changes
    localStorage.setItem("fromDate", fromDate);
  }, [fromDate]);

  useEffect(() => {
    // Update local storage when state changes
    localStorage.setItem("toDate", toDate);
  }, [toDate]);

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  // Check if all fields are selected to enable the button
  useEffect(() => {
    setIsDataFetchEnabled(selectedGame && fromDate && toDate);
  }, [selectedGame, fromDate, toDate]);

  const fetchData = () => {
    if (isDataFetchEnabled) {
      getTransactionLogs(selectedGame, fromDate, toDate);
    }
  };

  return (
    <div className="ml-[270px] mt-1 h-[87vh] flex flex-col gap-y-2 w-[1160px]">
      <div
        className="w-[1280px] bg-white border rounded-md ml-[-27px] pl-3 text-[#474747] font-medium text-left"
        style={{
          fontFamily: '"Roboto", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "48px",
          marginTop: "-4px",
        }}
      >
        <p
          className="text-lg text-[#474747]"
          style={{
            fontFamily: "Roboto, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "48px",
          }}
        >
          Logs
        </p>
      </div>
      <div className="ml-[-20px] flex flex-col gap-y-1 border rounded-md shadow-md p-4 bg-white w-[1250px]">
        <div
          className="text-[#1b9cfb] flex flex-col border-b border-[#b6e5f7] mt-[-13px]"
          style={{ font: 'normal 14px/34px "Roboto", "Arial", sans-serif' }}
        >
          Logs
        </div>

        <div className="ml-[-3px] flex flex-row">
          <div className="flex flex-row gap-x-2">
            <span className="text-gray-700 font-bold text-[15px] mt-3">
              Choose Game:
            </span>
            <select
              value={selectedGame}
              onChange={handleGameChange}
              className="border border-[#b6e5f7] rounded-sm px-3 mr-2 h-[34px] w-[150px] mt-[6px] focus:outline-none focus:border-blue-300"
            >
              <option value="">Select Game</option>
              {gameList.map((game) => (
                <option key={game._id} value={game.gameName}>
                  {game.gameName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row">
            <div className="flex-row gap-x-2">
              <span className="text-gray-700 font-bold text-[15px] mt-3 ml-5">
                From Date:
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="border border-[#b6e5f7] rounded-sm px-3 mr-2 h-[34px] w-[150px] mt-[6px] focus:outline-none focus:border-blue-300"
              />
            </div>
            <div className="flex flex-row">
              <span className="text-gray-700 font-bold text-[15px] mt-3">
                To Date:
              </span>
              <input
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                className="border border-[#b6e5f7] rounded-sm px-3 mr-2 h-[34px] w-[150px] mt-[6px] focus:outline-none focus:border-blue-300"
              />
            </div>
          </div>
          <div className="flex flex-row"></div>

          <button
            className={`bg-green-500 w-[130px] text-white px-4 py-2 mt-1 mr-1 rounded-sm font-[900] hover:bg-green-600 ml-[340px] ${
              isDataFetchEnabled ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={fetchData}
            disabled={!isDataFetchEnabled}
          >
            Get Logs
          </button>
        </div>
        <CustomizedTables7 transactionLogs={transactionLogs} />
        <ToastContainer />
      </div>
    </div>
  );
}

export default TransactionLogs;
