import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function NotFound() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return <div></div>;
}

export default NotFound;
