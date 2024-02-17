import Login from "./Auth/Login";
import Home from "./Components/Home";
import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useApihook } from "../src/ContextApi/Context";

function App() {
  const { user } = useApihook();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home/*" element={<Home />} />
    </Routes>
  );
}

export default App;
