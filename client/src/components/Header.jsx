import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = async () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Games Maths Challenge 2022</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className="btn" onClick={onLogout}>
              <FaSignOutAlt />
              {user.tto ? "Logout" : "Log uit"}
            </button>
          </li>
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
