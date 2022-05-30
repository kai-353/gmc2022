import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Challenge() {
  const [answer, setAnswer] = useState("");
  const { id } = useParams();

  const API_URL = "/api/assignments/";

  const [challenge, setChallenge] = useState(undefined);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const toHome = () => {
    navigate("/");
  };

  const getChallenge = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const response = await axios.get(API_URL + id, config);
      console.log(response.data);
      setChallenge(response.data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // console.log(message);
      navigate("/");
      toast.error(message);
    }
  };

  const onChange = (e) => {
    setAnswer(e.target.value);
  };

  const onSubmit = (e) => {
    console.log(answer);
    e.preventDefault();
  };

  useEffect(() => {
    getChallenge();
  }, [id]);

  if (!challenge) {
    return <Spinner />;
  }

  return (
    <>
      <div style={{ width: "100%" }}>
        <button className="btn" onClick={toHome}>
          <FaLongArrowAltLeft />
          {user.tto ? "Back" : "Terug"}
        </button>
        {challenge && <p>tries: {challenge.tries}/5</p>}
      </div>
      <div
        style={{
          width: "80%",
          margin: "auto",
          marginTop: "2rem",
          marginBottom: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form
          className="form-group"
          style={{ display: "flex", marginBottom: "20px" }}
          onSubmit={onSubmit}
        >
          <input
            type="text"
            className="form-control"
            style={{
              marginRight: "20px",
              marginBottom: "0px",
            }}
            id="answer"
            name="answer"
            value={answer}
            placeholder={
              user.tto ? "Enter your answer here" : "Voer hier je antwoord in"
            }
            onChange={onChange}
          />
          <button className="btn btn-submit">Submit</button>
        </form>
        <img
          src="http://localhost:5000/image/1%20Woordzoeker%20(NL)-1.jpg"
          onSubmit={onSubmit}
          // src="https://socket.io/images/rooms-redis.png"
          alt=""
          style={{
            maxWidth: "80%",
            border: "1px solid black",
            borderRadius: "0.5rem",
            marginBottom: "50px",
          }}
        />
      </div>
    </>
  );
}

export default Challenge;