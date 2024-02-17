import React, { useState, useEffect } from "react";

const DynamicTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="mt-1 text-sm text-[#3d6e8f] font-bold font-sans">
      <p>{currentTime}</p>
    </div>
  );
};

export default DynamicTimeDisplay;
