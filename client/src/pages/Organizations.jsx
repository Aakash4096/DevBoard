import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Organizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchOrgs = async () => {
    const { data } = await API.get("/orgs");
    setOrgs(data.data);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const createOrg = async (e) => {
    e.preventDefault();
    await API.post("/orgs", { name });
    setName("");
    fetchOrgs();
  };

  return (
    <div className="list-page">
      <h2>Organizations</h2>
      <form onSubmit={createOrg}>
        <input
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
      {orgs.map((org) => (
        <div
          key={org._id}
          className="list-item"
          onClick={() => navigate(`/organizations/${org._id}/projects`)}
        >
          {org.name}
        </div>
      ))}
    </div>
  );
};

export default Organizations;
