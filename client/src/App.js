import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { SocketContext, socket } from "./app/socket";
import { useDispatch, useSelector } from "react-redux";
import Challenge from "./pages/Challenge";
import Docent from "./pages/Docent";
import { logout, reset } from "./features/auth/authSlice";

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  }, [user]);

  return (
    <>
      <SocketContext.Provider value={socket}>
        <Router>
          <div className="container">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/docent" element={<Docent />} />
              <Route path="/challenge/:id" element={<Challenge />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <ToastContainer />
      </SocketContext.Provider>
    </>
  );
}

export default App;
