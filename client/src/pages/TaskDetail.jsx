import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const TaskDetail = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchData = async () => {
    const [taskRes, commentsRes, activityRes] = await Promise.all([
      API.get(`/tasks/${taskId}`),
      API.get(`/tasks/${taskId}/comments`),
      API.get(`/tasks/${taskId}/activity`),
    ]);
    setTask(taskRes.data.data);
    setComments(commentsRes.data.data);
    setActivities(activityRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await API.post(`/tasks/${taskId}/comments`, { content: newComment });
    setNewComment("");
    fetchData();
  };

  const updateField = async (field, value) => {
    await API.patch(`/tasks/${taskId}`, { [field]: value });
    fetchData();
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="task-detail">
      <h2>{task.title}</h2>
      <div className="meta">
        <select
          value={task.status}
          onChange={(e) => updateField("status", e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={task.priority}
          onChange={(e) => updateField("priority", e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <p>{task.description}</p>

      <h3>Comments</h3>
      <form className="comment-form" onSubmit={addComment}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Post</button>
      </form>
      {comments.map((c) => (
        <div key={c._id} className="comment">
          <strong>{c.author?.name}</strong>: {c.content}
          <br />
          <small>{new Date(c.createdAt).toLocaleString()}</small>
        </div>
      ))}

      <h3>Activity</h3>
      {activities.map((a) => (
        <div key={a._id} className="activity-item">
          <strong>{a.user?.name}</strong> {a.action} — {a.details}
          <br />
          <small>{new Date(a.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default TaskDetail;
