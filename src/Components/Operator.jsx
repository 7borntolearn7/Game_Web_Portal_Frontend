import React, { useState, useEffect } from "react";
import "../Modal.css";
import { useApihook } from "../ContextApi/Context";
import { toast, ToastContainer } from "react-toastify";
import CustomizedTables2 from "./CustomizedTables2";

function Operator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    operatorId: "",
    name: "",
    isActive: false,
  });

  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const openGameModal = (e) => {
    e.stopPropagation();
    setIsGameModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsGameModalOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        (isModalOpen || isGameModalOpen) &&
        !e.target.closest(".modal-content")
      ) {
        closeModal();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen, isGameModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { addOperator, getAllOperators, operatorList } = useApihook();

  useEffect(() => {
    getAllOperators();
  }, [operatorList]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      operatorId: formData.operatorId,
      name: formData.name,
      isActive: formData.isActive,
    };

    try {
      const response = await addOperator(data);
      console.log(response);
      toast.success("Created Operator Successfully");
    } catch (error) {
      console.error("Error:", error);
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
          Operators
        </p>
      </div>
      <div className="ml-[-20px] flex flex-col gap-y-1 border rounded-md shadow-md p-4 max-h-[570px] bg-white w-[1250px]">
        <div
          className="text-[#1b9cfb] flex flex-col border-b border-[#b6e5f7] mt-[-13px]"
          style={{ font: 'normal 14px/34px "Roboto", "Arial", sans-serif' }}
        >
          Operators
        </div>

        <div className="ml-[-3px] flex justify-end">
          <button
            className="bg-green-500 w-[130px] text-white px-4 py-2 mt-3 mr-1 rounded-sm font-[900] hover:bg-green-600"
            onClick={openModal}
          >
            Add Operator
          </button>
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="text-center font-bold font-sans text-xl text-black">
                  ADD OPERATOR
                </h2>
                <div className="w-150 h-[0.25px] bg-green-500 mt-1 mx-auto"></div>
                <form className="flex flex-col gap-y-5 mt-[20px]">
                  <label className="flex flex-col text-black font-medium">
                    Operator ID*
                    <input
                      type="text"
                      name="operatorId"
                      value={formData.operatorId}
                      onChange={handleInputChange}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col text-black font-medium">
                    Name*
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
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
        <CustomizedTables2></CustomizedTables2>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Operator;
