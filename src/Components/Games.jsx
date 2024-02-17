import React, { useState, useEffect } from "react";
import "../Modal.css";
import { useApihook } from "../ContextApi/Context";
import { toast, ToastContainer } from "react-toastify";
import CustomizedTables from "./CustomizedTables";
function Games() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameId: "",
    gameName: "",
    gameUrl: "",
    isActive: false,
    description: "",
  });

  const openModal = (e) => {
    console.log("Opening modal");
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidUrl = (url) => {
    const urlRegex = /^(https?):\/\/(?:www\.)?([^\s/:]+)(:\d+)?(\/[^\s]*)?$/i;
    return urlRegex.test(url);
  };

  const { game, createGame, getAllGames, gameList } = useApihook();

  useEffect(() => {
    getAllGames();
  }, [gameList]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.gameId.trim() === "" ||
      formData.gameName.trim() === "" ||
      formData.gameUrl.trim() === "" ||
      formData.description.trim() === ""
    ) {
      return toast.error("Fill required input fields");
    }

    if (!isValidUrl(formData.gameUrl)) {
      return toast.error("Invalid URL");
    }

    const data = {
      gameId: formData.gameId,
      gameName: formData.gameName,
      gameUrl: formData.gameUrl,
      isActive: formData.isActive,
      description: formData.description,
    };

    try {
      const response = await createGame(data);
      console.log(response);
      toast.success("Created Game Successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating game");
    }

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
          Games
        </p>
      </div>
      <div className="ml-[-20px] flex flex-col gap-y-1 border rounded-md shadow-md p-4 max-h-[570px] bg-white w-[1250px]">
        <div
          className="text-[#1b9cfb] flex flex-col border-b border-[#b6e5f7] mt-[-13px]"
          style={{ font: 'normal 14px/34px "Roboto", "Arial", sans-serif' }}
        >
          Games
        </div>

        <div className="ml-[-3px] flex justify-end">
          <button
            className="bg-green-500 w-[130px] text-white px-4 py-2 mt-3 mr-1 rounded-sm font-[900] hover:bg-green-600"
            onClick={openModal}
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
                    Game ID*
                    <input
                      type="text"
                      name="gameId"
                      value={formData.gameId}
                      onChange={handleInputChange}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col text-black font-medium">
                    Game Name*
                    <input
                      type="text"
                      name="gameName"
                      value={formData.gameName}
                      onChange={handleInputChange}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col text-black font-medium">
                    Game URL*
                    <input
                      type="text"
                      name="gameUrl"
                      value={formData.gameUrl}
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
                  <label className="flex flex-col text-black font-medium">
                    Description*
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
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
        <CustomizedTables></CustomizedTables>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Games;
