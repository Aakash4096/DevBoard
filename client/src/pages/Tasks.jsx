import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Tasks = () => {
  const { orgId, projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchTasks = async () => {
    const { data } = await API.get(`/projects/${projectId}/tasks`);
    setTasks(data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    await API.post(`/projects/${projectId}/tasks`, { title });
    setTitle("");
    fetchTasks();
  };

  const updateStatus = async (taskId, status) => {
    await API.patch(`/projects/${projectId}/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const filtered =
    activeFilter === "All"
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  return (
    <div className="task-manager">
      <div className="left-bar">
        <div className="upper-part">
          <div className="circle"></div>
        </div>
        <div className="left-content">
          <ul className="action-list">
            <li className="item" onClick={() => navigate("/organizations")}>
              <span>📁 Organizations</span>
            </li>
            <li
              className="item"
              onClick={() => navigate(`/organizations/${orgId}/projects`)}
            >
              <span>📋 Projects</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="page-content">
        <div className="header">Tasks</div>
        <form className="add-task-form" onSubmit={createTask}>
          <input
            placeholder="New task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit">Add Task</button>
        </form>
        <div className="content-categories">
          {["All", "todo", "in-progress", "done"].map((f) => (
            <button
              key={f}
              className={`category ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === "todo"
                ? "To Do"
                : f === "in-progress"
                  ? "In Progress"
                  : f === "done"
                    ? "Done"
                    : "All"}
            </button>
          ))}
        </div>
        <div className="tasks-wrapper">
          {filtered.map((t) => (
            <div key={t._id} className="task">
              <span
                className="task-title"
                onClick={() =>
                  navigate(
                    `/organizations/${orgId}/projects/${projectId}/tasks/${t._id}`,
                  )
                }
              >
                {t.title}
              </span>
              <span className={`tag ${t.status}`}>{t.status}</span>
              <select
                className="status-select"
                value={t.status}
                onChange={(e) => updateStatus(t._id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="right-bar">
        <div className="header">Priority</div>
        {tasks
          .filter((t) => t.priority === "high")
          .map((t) => (
            <div
              key={t._id}
              className="task-box red"
              onClick={() =>
                navigate(
                  `/organizations/${orgId}/projects/${projectId}/tasks/${t._id}`,
                )
              }
            >
              <div className="time">High Priority</div>
              <div className="task-name">{t.title}</div>
            </div>
          ))}
        {tasks
          .filter((t) => t.priority === "medium")
          .map((t) => (
            <div
              key={t._id}
              className="task-box yellow"
              onClick={() =>
                navigate(
                  `/organizations/${orgId}/projects/${projectId}/tasks/${t._id}`,
                )
              }
            >
              <div className="time">Medium Priority</div>
              <div className="task-name">{t.title}</div>
            </div>
          ))}
        {tasks
          .filter((t) => t.priority === "low")
          .map((t) => (
            <div
              key={t._id}
              className="task-box green"
              onClick={() =>
                navigate(
                  `/organizations/${orgId}/projects/${projectId}/tasks/${t._id}`,
                )
              }
            >
              <div className="time">Low Priority</div>
              <div className="task-name">{t.title}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Tasks;
