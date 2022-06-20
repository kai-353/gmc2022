import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

function Docent() {
  const [password, setPassword] = useState("");

  const API_URL = "/api/users/";

  const onChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_URL + "changeGroups", { password })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <div className="loginContainer">
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Master wachtwoord"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Verander groepjes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Docent;
