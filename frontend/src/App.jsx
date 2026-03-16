import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Matches from "./pages/Matches";
import Scheduler from "./pages/Scheduler";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        {/* If user is logged in, "/" and "/login" redirect to "/home" */}
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/home" /> : <Login />} 
        />
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/home" /> : <Login />} 
        />
        
        {/* If user is NOT logged in, protected routes redirect to "/login" */}
        <Route 
          path="/home" 
          element={<Home />} 
        />
        
        <Route path="/register" element={<Register />} />
        
        {/* Other Routes */}
        <Route path="/chat" element={currentUser ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/matches" element={currentUser ? <Matches /> : <Navigate to="/login" />} />
        <Route path="/scheduler" element={currentUser ? <Scheduler /> : <Navigate to="/login" />} />
        <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={currentUser ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </>
  );
}