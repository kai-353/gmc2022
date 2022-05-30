import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AssignmentItem({ assignment }) {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const toChallenge = () => {
    navigate(`/challenge/${assignment._id}`);
  };

  return (
    <div className="box-shadow shop-item card" onClick={toChallenge}>
      <img
        className="card-img-top"
        src="http://localhost:5000/image/1%20Woordzoeker%20(NL)-1.jpg"
        alt="couldn't load img"
      />
      <div className="card-body">
        <h5 className="card-title">{assignment.title}</h5>
        <p className="card-text">
          <small className="text-muted">
            {assignment.maxpoints} {user && user.tto ? "points" : "punten"}
          </small>
        </p>
      </div>
    </div>
  );
}

export default AssignmentItem;
