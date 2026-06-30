import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const Tasks = () => {
  const { orgId, projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

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

  return (
    <div>
      <h2>Tasks</h2>
      <form onSubmit={createTask}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      {["todo", "in-progress", "done"].map((status) => (
        <div key={status}>
          <h3>{status}</h3>
          {tasks
            .filter((t) => t.status === status)
            .map((t) => (
              <div
                key={t._id}
                style={{ border: "1px solid #ccc", padding: 8, margin: 4 }}
              >
                <p>{t.title}</p>
                <select
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
      ))}
    </div>
  );
};

export default Tasks;
