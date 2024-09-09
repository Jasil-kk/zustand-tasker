import { useEffect, useRef, useState } from "react";
import "./App.css";
import useTaskStore from "./store";

function App() {
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [tab, setTab] = useState("All");
  const inputRef = useRef();

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const editTask = useTaskStore((state) => state.editTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);

  const handleAddTask = () => {
    if (!newTask) {
      return;
    }
    const task = { id: Date.now(), title: newTask, completed: false };
    addTask(task);
    setNewTask("");
  };

  const handleEdit = (task) => {
    inputRef.current.focus();
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
    setNewTask(task.title);
  };

  const handleEditTask = () => {
    if (!newTask) {
      return;
    }
    editTask(editTaskId, { title: newTask });
    setEditTaskId(null);
    setEditTaskTitle("");
    setNewTask("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editTaskId) {
        handleEditTask();
      } else {
        handleAddTask();
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (tab === "Completed") {
      return task.completed;
    } else if (tab === "Pending") {
      return !task.completed;
    }
    return true;
  });

  return (
    <div className="main">
      <h1>Taks Management</h1>
      <div className="input_wrapper">
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editTaskId ? "Edit task" : "Add a new task"}
        />
        <button
          className="save_btn"
          onClick={editTaskId ? handleEditTask : handleAddTask}
        >
          {editTaskId ? "Save Changes" : "Add Task"}
        </button>
      </div>
      <ul className="tabs_container">
        <li
          onClick={() => setTab("All")}
          className={tab === "All" ? "active" : ""}
        >
          All
        </li>
        <li
          onClick={() => setTab("Completed")}
          className={tab === "Completed" ? "active" : ""}
        >
          Completed
        </li>
        <li
          onClick={() => setTab("Pending")}
          className={tab === "Pending" ? "active" : ""}
        >
          Pending
        </li>
      </ul>
      {filteredTasks && filteredTasks.length > 0 ? (
        <ul className="taks_list_container">
          {filteredTasks.toReversed().map((task) => (
            <li key={task.id}>
              <div className="checkbox-wrapper-30">
                <span className="checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                  <svg>
                    <use xlinkHref="#checkbox-30" className="checkbox"></use>
                  </svg>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "none" }}
                >
                  <symbol id="checkbox-30" viewBox="0 0 22 22">
                    <path
                      fill="none"
                      stroke="currentColor"
                      d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                    />
                  </symbol>
                </svg>
              </div>
              <p
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </p>
              <button
                disabled={task.completed}
                className="edit_btn"
                onClick={() => handleEdit(task)}
              >
                Edit
              </button>
              <button
                disabled={editTaskId === task.id || task.completed}
                className="delete_btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="notfound">
          {tab === "Completed"
            ? "No completed tasks found"
            : tab === "Pending"
            ? "No pending tasks found"
            : "No tasks found"}
        </div>
      )}
    </div>
  );
}

export default App;
