// import logo from './logo.svg';
// import './App.css';
// import { Routes, Route } from "react-router-dom";
// import Login from './components/Login.js';
// import Register from './components/Register.js';
// import Home from './components/Home.js';


// function App() {
//   return (
//     <div className="App">
//           <Routes>
//             <Route path="/" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/home" element={<Home />}></Route>
//           </Routes>
//     </div>
//   );
// }

// export default App;
import './App.css';
import { Routes, Route } from "react-router-dom";
import { SocketProvider } from './context/SocketContext';
import { AuthContextProvider } from './context/AuthContext';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import AdminDashboard from './components/AdminDashboard.js';
import PrivateRoute from './components/PrivateRoute.js';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </SocketProvider>
    </AuthContextProvider>
  );
}

export default App;
