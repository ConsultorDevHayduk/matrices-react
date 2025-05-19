import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/ProtectedRouted";
import "./App.css";
import Register from "./pages/Register/Register";


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  const start = () => {
    navigate("/Home");
  };



  return (
    <>
      {!isRootPath && <NavBar />}
      <Routes>
        <Route path="/" element={<Landing start={start} />} />
        <Route path="/Home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/Register" element={
          <ProtectedRoute>
            <Register/>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

export default App;
