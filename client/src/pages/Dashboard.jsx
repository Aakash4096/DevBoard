import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name || "User"}</h2>
      <p>Manage your projects and tasks efficiently</p>
      <button onClick={() => navigate("/organizations")}>
        My Organizations
      </button>
      <button onClick={logout} style={{ background: "#e77f89" }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
