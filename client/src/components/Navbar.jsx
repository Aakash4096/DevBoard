import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, token, logout } = useAuth();

  return (
    <nav
      style={{ padding: 10, borderBottom: "1px solid #ccc", marginBottom: 20 }}
    >
      <Link to="/dashboard">Home</Link>
      {token ? (
        <>
          <span style={{ marginLeft: 20 }}>Hello, {user?.name}</span>
          <button onClick={logout} style={{ marginLeft: 20 }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: 20 }}>
            Login
          </Link>
          <Link to="/register" style={{ marginLeft: 20 }}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
