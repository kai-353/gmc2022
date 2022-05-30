import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAssignments, reset } from "../features/assignment/assignmentSlice";
import Spinner from "../components/Spinner";
import AssignmentItem from "../components/AssignmentItem";
import { SocketContext } from "../app/socket";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const { user } = useSelector((state) => state.auth);
  const { assignments, isLoading, isError, message } = useSelector(
    (state) => state.assignment
  );

  const onTest = () => {
    console.log("test");
  };

  useEffect(() => {
    socket.on("test", onTest);
    return () => {
      socket.off("test", onTest);
    };
  }, [socket]);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }

    dispatch(getAssignments());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="assignmentContainer">
        {assignments.length > 0 ? (
          <div className="assignments">
            {assignments.map((assignment) => (
              <AssignmentItem key={assignment._id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <h1>
            {user && user.tto
              ? "No assignments left!"
              : "Geen opdrachten over!"}
          </h1>
        )}
      </section>
    </>
  );
}

export default Dashboard;
