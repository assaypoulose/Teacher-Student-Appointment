import React from "react";
import { Link } from "react-router-dom";
import studentImg from "../assets/students.jpg";
import teacherImg from "../assets/teachers.jpg";
import adminImg from "../assets/admin.jpg";
import HomeCard from "../components/Cards/HomeCard";

function LoginPage() {


  return (
    <>
      <div className="flex flex-col gap-12 items-center px-6 py-4 min-h-screen justify-center dark:text-white">
        <div className="sm:flex gap-12">
          <Link to="/login/student">
          <HomeCard img={studentImg} name="student" />
          </Link>
          <Link to="/login/teacher">
          <HomeCard img={teacherImg} name="teacher" />
          </Link>
          <Link to="/login/admin">
          <HomeCard img={adminImg} name="admin" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
