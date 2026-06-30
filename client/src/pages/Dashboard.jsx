import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name || "User"}</p>
      <button onClick={() => navigate("/organizations")}>
        My Organizations
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
