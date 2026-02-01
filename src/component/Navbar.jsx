import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { signOut } from "firebase/auth";
import auth from "../firebase/firebase.config";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const [isChecked, setIsChecked] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Default to light theme if no preference is saved
    return savedTheme === "dark";
  });

  const handleThemeChange = () => {
    setIsChecked((prev) => {
      const newTheme = !prev;
      const themeValue = newTheme ? "dark" : "light";
      localStorage.setItem("theme", themeValue);
      document.documentElement.setAttribute("data-theme", themeValue);
      return newTheme;
    });
  };

  useEffect(() => {
    // Initialize theme on component mount
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || "light";
    document.documentElement.setAttribute("data-theme", theme);
    setIsChecked(theme === "dark");
  }, []);

  const handleSignOut = () => {
    toast.success("Logout Successful!");
    signOut(auth);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4 fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1000 mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : ""
                }
              >
                Home
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink
                    to={"/profile"}
                    className={({ isActive }) =>
                      isActive ? "text-primary font-bold" : ""
                    }
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/quiz"
                    className={({ isActive }) =>
                      isActive ? "text-primary font-bold" : ""
                    }
                  >
                    Take Quiz
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                      isActive ? "text-primary font-bold" : ""
                    }
                  >
                    Leaderboard
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <NavLink to="/" className="flex items-center gap-2 ml-1">
          <span className="font-bold text-lg sm:text-xl bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            QuizHero
          </span>
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : ""
              }
            >
              Home
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink
                  to={"/profile"}
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  My Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quiz"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  Take Quiz
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  Leaderboard
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {/* Modern Theme Toggle */}
        <div className="flex items-center">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleThemeChange}
              className="hidden"
            />
            
            {/* Sun icon */}
            <svg
              className={`swap-off fill-current w-6 h-6 transition-all duration-300 ${
                isChecked ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
            
            {/* Moon icon */}
            <svg
              className={`swap-on fill-current w-6 h-6 transition-all duration-300 ${
                isChecked ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
          </label>
        </div>

        {user && (
          <button onClick={handleSignOut} className="btn btn-sm lg:btn-md">
            Logout
          </button>
        )}
        {!user && (
          <NavLink to={"/login"} className="btn btn-sm lg:btn-md">
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
//done