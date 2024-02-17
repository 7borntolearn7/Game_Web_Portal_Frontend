import React, { useState, useEffect } from "react";
import "../Modal.css";
import { useApihook } from "../ContextApi/Context";
import { toast, ToastContainer } from "react-toastify";
import CustomizedTables3 from "./CustomizedTables3";

function OperatorGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddGameButtonEnabled, setIsAddGameButtonEnabled] = useState(false);
  const [isDropdownSelected, setisDropdownSelected] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [OperatorGames, setOperatorGames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const {
    operatorList,
    gameList,
    getAllOperators,
    getAllGames,
    opGames,
    addOpGame,
    getAllOpGames,
    opGamesList,
  } = useApihook();
  console.log("List:", opGamesList);
  useEffect(() => {
    getAllGames();
  }, [gameList]);
  useEffect(() => {
    getAllOperators();
  }, [operatorList]);

  const isValidUrl = (url) => {
    const urlRegex = /^(https?):\/\/(?:www\.)?([^\s/:]+)(:\d+)?(\/[^\s]*)?$/i;
    return urlRegex.test(url);
  };
  const [gamet, setgame] = useState("");
  const [formData, setFormData] = useState({
    operatorId: "",
    name: "",
    secretKey: "",
    currency: "",
    isActive: false,
    operatorEndpoint: "",
    winPercentage: "",
  });

  const openModal = (e) => {
    console.log("Opening modal");
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      operatorId: "",
      name: "",
      secretKey: "",
      currency: "",
      isActive: false,
      operatorEndpoint: "",
      winPercentage: "",
    });
  };

  useEffect(() => {
    setIsAddGameButtonEnabled(!!formData.operatorId);
  }, [formData.operatorId]);

  const handleInputChange = (e) => {
    setisDropdownSelected(true);
    const { name, value, type, checked } = e.target;
    console.log("e.target.name", e.target.name);
    console.log("e.target:", e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "operatorId") {
      const selectedOperator = operatorList.find(
        (operator) => String(operator.operatorId) === String(value)
      );

      console.log("Selected Operator:", selectedOperator);
      if (selectedOperator) {
        setFormData((prevData) => ({
          ...prevData,
          operatorId: selectedOperator.operatorId,
          name: selectedOperator.name,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          operatorId: "",
          name: "",
        }));
      }
      setSelectedOperatorId(value);
    }

    if (name === "game") {
      setFormData((prevData) => ({
        ...prevData,
        game: value,
      }));
    }
  };

  useEffect(() => {
    if (isDropdownSelected && selectedOperatorId) {
      console.log("selected Operator Id:", selectedOperatorId);
      getAllOpGames(selectedOperatorId)
        .then((response) => {
          console.log("response is:", response);
          const mappedtableData = response.map((obj) => ({
            game: obj.game,
            secretKey: obj.secretKey,
            currency: obj.currency,
            operatorEndpoint: obj.operatorEndpoint,
            winPercentage: obj.winPercentage,
            isActive: obj.isActive,
          }));

          console.log("Mapped Table Data:", mappedtableData);
          setTableData(mappedtableData);
        })
        .catch((error) => {
          console.error("Error fetching operator games:", error);
        });
    }
  }, [isDropdownSelected, selectedOperatorId, opGamesList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && !event.target.closest(".modal-content")) {
        closeModal();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleSubmit = async (event) => {
    console.log("Entered Submit Section");
    event.preventDefault();
    if (
      formData.operatorId === "" ||
      formData.winPercentage === "" ||
      formData.name === "" ||
      formData.game === "" ||
      formData.secretKey === "" ||
      formData.currency === "" ||
      formData.operatorEndpoint === ""
    ) {
      return toast.error("Fill required input fields");
    }
    if (!isValidUrl(formData.operatorEndpoint)) {
      return toast.error("Invalid URL");
    }
    const data = {
      operatorId: formData.operatorId,
      name: formData.name,
      gameDetails: [
        {
          game: gamet,
          secretKey: formData.secretKey,
          isActive: formData.isActive,
          currency: formData.currency,
          operatorEndpoint: formData.operatorEndpoint,
          winPercentage: formData.winPercentage,
        },
      ],
    };

    try {
      const response = await addOpGame(data);
      console.log(response);
      toast.success("Created Operator Game Successfully");
    } catch (error) {
      toast.error("Game already Exists");
      console.error("Error:", error);
    }

    console.log("Form Data:", formData);
    closeModal();
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
          Operator Games
        </p>
      </div>
      <div className="ml-[-20px] flex flex-col gap-y-1 border rounded-md shadow-md p-4 max-h-[570px] bg-white w-[1250px]">
        <div
          className="text-[#1b9cfb] flex flex-col border-b border-[#b6e5f7] mt-[-13px]"
          style={{
            font: 'normal 14px/34px "Roboto", "Arial", sans-serif',
          }}
        >
          Operator Games
        </div>

        <div className="ml-[-3px] flex justify-between">
          <div className="flex gap-x-1">
            <label className="text-gray-700 font-bold text-[15px] mt-3">
              Choose Operator:
            </label>
            <select
              name="operatorId"
              className="border border-[#b6e5f7] rounded-sm px-3 mr-2 h-[34px] w-[200px] mt-[6px] focus:outline-none focus:border-blue-300"
              value={formData.operatorId}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select operator
              </option>
              {operatorList
                .filter((operator) => operator.isActive === true)
                .map((operator, index) => (
                  <option key={index} value={String(operator.operatorId)}>
                    {operator.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            className={`bg-green-500 w-[130px] text-white px-4 py-2 mt-3 mr-1 rounded-sm font-[900] hover:bg-green-600 ${
              !isAddGameButtonEnabled && "opacity-50 cursor-not-allowed"
            }`}
            onClick={openModal}
            disabled={!isAddGameButtonEnabled}
          >
            Add Game
          </button>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="text-center font-bold font-sans text-xl text-black">
                  ADD GAME
                </h2>
                <div className="w-150 h-[0.25px] bg-green-500 mt-1 mx-auto"></div>
                <form className="flex flex-col gap-y-5 mt-[20px]">
                  <label className="flex flex-col text-black font-medium">
                    Operator Id*
                    <input
                      type="text"
                      name="operatorId"
                      value={formData.operatorId}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="p-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </label>
                  <label className="flex flex-col text-black font-medium">
                    Operator Name*
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="p-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </label>
                  <label className="flex flex-col text-black font-medium">
                    Game*
                    <select
                      name="game"
                      value={gamet}
                      className="p-2 border border-gray-300 rounded-md"
                      onChange={(e) => setgame(e.target.value)}
                    >
                      <option value="" disabled>
                        Select game
                      </option>
                      {gameList
                        .filter(
                          (game) =>
                            game.isActive === true &&
                            !tableData.some(
                              (data) => data.game === game.gameName
                            )
                        )
                        .map((game) => (
                          <option
                            key={game.gameId}
                            value={game.gameName}
                            className="text-black"
                          >
                            {game.gameName}
                          </option>
                        ))}
                    </select>
                  </label>

                  {gamet && (
                    <>
                      <label className="flex flex-col text-black font-medium">
                        Secret Key/Public Key*
                        <textarea
                          name="secretKey"
                          value={formData.secretKey}
                          onChange={handleInputChange}
                          className="p-2 border border-gray-300 rounded-md"
                          rows={4} // Set the number of rows as needed
                        />
                      </label>
                      <label className="flex flex-col text-black font-medium">
                        Currency*
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="p-2 border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select currency
                          </option>
                          <option value="USD">USD</option>
                          <option value="HKD">HKD</option>
                          <option value="INR">INR</option>
                        </select>
                      </label>
                      <label className="flex flex-col text-black font-medium">
                        Operator Endpoint*
                        <input
                          type="text"
                          name="operatorEndpoint"
                          value={formData.operatorEndpoint}
                          onChange={handleInputChange}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                      </label>
                      <label className="flex flex-col text-black font-medium">
                        Win Percentage*
                        <input
                          type="text"
                          name="winPercentage"
                          value={formData.winPercentage}
                          onChange={handleInputChange}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                      </label>
                      <label className="flex flex-row gap-x-2 text-black font-medium">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        Active
                      </label>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-4 py-2 border rounded"
                    disabled={!gamet}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <CustomizedTables3
          tableData={tableData}
          operator={selectedOperatorId}
        ></CustomizedTables3>
        <ToastContainer />
      </div>
    </div>
  );
}

export default OperatorGames;
