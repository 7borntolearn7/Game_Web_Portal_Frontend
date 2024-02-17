import React from "react";
import "./CustomModal.css";

const CustomModal = ({ isOpen, onClose, title, children, onConfirm }) => {
  return (
    <div className={`custom-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
