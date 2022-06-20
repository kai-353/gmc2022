import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { useContext, useEffect } from "react";
import { SocketContext } from "../app/socket";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { user } = useSelector((state) => state.auth);

  const onLogout = async () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    socket.on("refreshAll", onLogout);

    return () => {
      socket.off("refreshAll", onLogout);
    };
  }, [user]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Games Maths Challenge 2022</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <h4 style={{ fontWeight: "normal" }}>{user.leerlingnummer}</h4>
            </li>
            <li>
              <h4 style={{ fontWeight: "normal" }}>
                {(user.tto ? "Group " : "Groep ") + user.group}
              </h4>
            </li>
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt />
                {user.tto ? "Logout" : "Log uit"}
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">
              <FaSignInAlt />
              Login
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
