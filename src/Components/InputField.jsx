// InputField.jsx
import React from "react";

const InputField = ({ label, type, name, value, onChange }) => (
  <label className="flex flex-col text-black font-medium">
    {label}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-md"
    />
  </label>
);

export default InputField;
