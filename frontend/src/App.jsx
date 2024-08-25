import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
//Components
import Navbar from './components/Navbar';
import StudentLogin from './components/StudentLogin';
import TeacherLogin from './components/TeacherLogin';
import AdminLogin from './components/AdminLogin';
//pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import StudentRegister from './pages/StudentRegisterPage';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';



const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/teacher" element={<TeacherLogin />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App