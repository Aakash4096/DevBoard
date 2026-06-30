import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Projects = () => {
  const { orgId } = useParams();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const { data } = await API.get(`/orgs/${orgId}/projects`);
    setProjects(data.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    await API.post(`/orgs/${orgId}/projects`, { name });
    setName("");
    fetchProjects();
  };

  return (
    <div>
      <h2>Projects</h2>
      <form onSubmit={createProject}>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
      <ul>
        {projects.map((p) => (
          <li
            key={p._id}
            onClick={() =>
              navigate(`/organizations/${orgId}/projects/${p._id}/tasks`)
            }
            style={{ cursor: "pointer" }}
          >
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
