// ConfigField.jsx
import React from "react";

const ConfigField = ({ label, name, value, onChange }) => (
  <label className="flex flex-col text-black font-medium">
    {label}
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-md"
    />
  </label>
);

export default ConfigField;
