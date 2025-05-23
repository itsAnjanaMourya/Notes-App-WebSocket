import React, { useState, useContext } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useEffect } from 'react';

const Home = () => {
  const { currentUser, isAuthenticated, login, logout } = useContext(AuthContext);
  const { logoutUser } = useSocket();
  const [note, setNote] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
  });
  const [list, setList] = useState([])
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState({ title: "", description: "" })
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  // console.log("current user name", currentUser.username)
  const handleGetNote = async (e) => {
    let token;
    document.cookie.split(";").map(s => { token = s.startsWith("access") ? s.substring("access_token=".length) : "" });
    try {
      await axios.get("http://localhost:3200/notes/getNotes", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          console.log("get response", res.data)
          if (res && Array.isArray(res.data)) {
            console.log("Fetched notes:", res.data);
            setList(res.data); // Set the entire list of notes
          } else {
            console.error("Notes data is not in the expected format.");
          }
        })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      handleGetNote();
    }
    else {
      login()
      handleGetNote();
    }
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = list.filter(note =>
      note.title.toLowerCase().includes(value) ||
      note.description.toLowerCase().includes(value) ||
      note.status.toLowerCase().includes(value)
    );

    setFilteredNotes(filtered);
    console.log("Search list", filtered)
  };

  const handleAddNote = async (e) => {
    e.preventDefault();


    let errors = { title: "", description: ""};

    if (!note.title) {
      errors.title = "Title is required.";
    }
    if (!note.description) {
      errors.description = "Description is required.";
    }
    if (errors.title || errors.description) {
      setError(errors);
      return;
    }

    setError({ title: "", description: "" });

    let token;
    document.cookie.split(";").map(s => { token = s.startsWith("access") ? s.substring("access_token=".length) : "" });
    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:3200/notes/updateNote/${list[editIndex]._id}`, {
          title: note.title,
          description: note.description,
          status: note.status,
          priority: note.priority
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(async (res) => {
          console.log(res)
          await handleGetNote()
          setNote({ title: "", description: "" })
          setEditIndex(null)
        })

      } else {
        await axios.post("http://localhost:3200/notes/addNote", { title: note.title, description: note.description, status: note.status, priority: note.priority }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        ).then(async (res) => {
          console.log("create response", res.data.note)
          if (res && res.data.note) {
            console.log("New note added:", res.data.note);
            setList((prevList) => [...prevList, res.data.note]);
          }
          setNote({ title: "", description: ""});
        })
      }
    } catch (error) {
      console.log(error)
    }

  }

  const handleEdit = (index) => {
    const actualIndex = list.length - 1 - index;
    setEditIndex(actualIndex);
    setNote(list[actualIndex]);
  };

  const handleDelete = async (index) => {
    const actualIndex = list.length - 1 - index;
    let token;
    document.cookie.split(";").map(s => { token = s.startsWith("access") ? s.substring("access_token=".length) : "" });
    try {
      axios.delete(`http://localhost:3200/notes/deleteNote/${list[actualIndex]._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
        .then(async (res) => {
          await handleGetNote();
          console.log("note del", res)
        })
    } catch (error) {

    }
  }

  const sortedList = [...list].sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if(sort=="High Priority"){
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    else if(sort=="Low Priority"){
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
  });
  
  const handleLogout = async () => {
    if (currentUser) {
      logoutUser(currentUser._id);
    }
    await logout();
    // Add your navigation logic here if needed
  };

  return (
    <>
      <div className="outer">
        <div className="TodoWrapper">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '4rem 2rem' }}>
            <h2 style={{ color: "black" }}>
              Welcome, {isAuthenticated && currentUser ? `${currentUser.username} !` : "user ! please login"}
            </h2>
          </div>
          <div style={{width:'100%', paddingLeft:'30%'}}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              style={{ marginBottom: "1rem", padding: "0.5rem", borderColor: "#7e5ad7", borderRadius: 20, width: "50%" }}
            />

            
            <select
                  id="todo-sort"
                  name="sort"
                  className="todo-btn"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="default" disabled>
                    Sort
                  </option>
                  <option value="High Priority">Sort by High Priority</option>
                  <option value="Low Priority">Sort by Low Priority</option>
                  <option value="Default">Default</option>
                </select>
          </div>
          <div>
            {error && <p style={{ color: 'red', height: "20px" }}>{error.title || error.description || error.status}</p>}</div>
          {isAuthenticated &&
            <>
              <form onSubmit={handleAddNote} className="TodoForm">
                <label htmlFor="todo-input"></label>
                <input
                  type="text"
                  className="todo-input"
                  id="task"
                  name="title"
                  placeholder="Add a task..."
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
                <label htmlFor="todo-input"></label>
                <input
                  type="text"
                  className="todo-input"
                  id="task"
                  name="desc"
                  placeholder="Add description..."
                  value={note.description}
                  onChange={(e) => setNote({ ...note, description: e.target.value })}
                />

                <select
                  id="taskstatus"
                  name="taskstatus"
                  className="todo-btn"
                  value={note.status}
                  onChange={(e) => setNote({ ...note, status: e.target.value })}
                >
                  <option value="default" disabled>
                    Select Status
                  </option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  id="todo-priority"
                  name="priority"
                  className="todo-btn"
                  value={note.priority}
                  onChange={(e) => setNote({ ...note, priority: e.target.value })}
                >
                  <option value="default" disabled>
                    Select Priority
                  </option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>


                <button type="submit" className="todo-btn">
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </form>
            </>
          }
          <div>
            {Array.isArray(filteredNotes && filteredNotes.length ? filteredNotes : (sort?sortedList:list)) &&
              (filteredNotes && filteredNotes.length ? filteredNotes : (sort?sortedList:list))
                .slice()
                .reverse()
                .map((data, i) => {
                  if (!data) return null;

                  return (
                    <div key={i} className="Todo">
                      <div className={`TodoTask ${data.priority.toLowerCase()}`}>
                        <p className="show-task">Title:{' '}{data.title} </p>
                        <p className="show-task">Description:{' '}{data.description}</p>
                        <p className="show-status">Status:{' '}{data.status}</p>
                        <div>
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            style={{ color: "white" }}
                            onClick={() => handleEdit(i)}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="fa-trash"
                            style={{ color: "red" }}
                            onClick={() => handleDelete(i)}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
