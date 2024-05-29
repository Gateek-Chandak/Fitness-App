import Home from "./HomePage/Home";
import LogIn from "./AuthPages/LogIn";
import SignUp from "./AuthPages/SignUp";
import UserLog from "./UserPages/Pages/UserLog";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user-log" element={<UserLog />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App