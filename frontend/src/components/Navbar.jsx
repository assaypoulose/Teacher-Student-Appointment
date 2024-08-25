import React from 'react';
import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';
import { MdDarkMode, MdOutlineWbSunny, MdLogout } from "react-icons/md";
import { IoIosCalendar } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootRoute = location.pathname === "/";

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  const getLocalStorageData = (keys) => keys.map(key => localStorage.getItem(key)).find(value => value !== null);

  const localData = getLocalStorageData(["Teacher jwtToken", "Student jwtToken", "jwtToken"]);
  const userData = getLocalStorageData(["Student Name", "Teacher Name", "Admin Name"]);

  const changeHandler = () => {
    localStorage.removeItem("Teacher jwtToken");
    localStorage.removeItem("Student jwtToken");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("Student Name");
    localStorage.removeItem("Teacher Name");
    localStorage.removeItem("Admin Name");
    toast.success("Logout Successfully");
    navigate("/");
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <nav className='dark:bg-teal-900 bg-teal-700 sticky top-0 z-50 shadow-md flex'>
      <div className="flex items-center text-white dark:text-gray-200 p-2 border border-gray-950 dark:border-gray-300 rounded-md">
  <IoIosCalendar size={24} className="mr-2" />
  <span>{formattedDate}</span>
</div>
        <div className='container mx-auto px-6 py-3 flex justify-between items-center'>
          <div className="flex items-center space-x-4">
            <Link
              className='text-white text-2xl font-mono hover:text-gray-200 transition-colors'
              to="/"
              onClick={() => {
                if (localData) {
                  toast.success("Welcome to Registration-Panel");
                }
              }}
            >
              Welcome to Student-Teacher Booking
            </Link>
          </div>

          <div className='flex items-center space-x-6'>
            {userData && (
              <span className='text-white text-lg'>
                Welcome, {userData}!
              </span>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-full bg-teal-800 text-white hover:bg-teal-600 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <MdDarkMode size={24} /> : <MdOutlineWbSunny size={24} />}
            </button>

            {localData && (
              <button
                className='text-white text-2xl p-2 rounded-full hover:bg-teal-600 transition-colors focus:outline-none'
                onClick={changeHandler}
                aria-label="Logout"
              >
                <MdLogout size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
