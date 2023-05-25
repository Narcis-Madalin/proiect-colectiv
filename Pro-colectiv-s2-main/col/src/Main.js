import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import Home from "./Home";
import RESERVATION from "./RESERVATION";
import BOOKINGHISTORY from "./BOOKINGHISTORY";
import ClassroomLocalistion from "./ClassroomLocalisation";
import ACCOUNT from "./ACCOUNT";
import LOGIN from "./LOGIN";
import ClassroomBooking from "./ClassroomBooking";
import ReservationSearch from "./ReservationSearch";

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    console.log("token before removal:", localStorage.getItem("token"));
    console.log("userId before removal:", localStorage.getItem("userId"));

    localStorage.removeItem("token");
    sessionStorage.removeItem("userId");

    console.log("token after removal:", localStorage.getItem("token"));
    console.log("userId after removal:", localStorage.getItem("userId"));

    setIsLoggedIn(false);
    console.log("isLoggedIn:", isLoggedIn);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    // Check login status from localStorage on component mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Router>
      <div>
        <h1>UVT BECOME YOUR BEST</h1>
        <ul className="header">
          <li>
            <NavLink exact to="/">
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/BOOKINGHISTORY">BOOKING HISTORY</NavLink>
          </li>
          <li>
            <NavLink to="/ClassroomLocalization">
              Classroom Localization
            </NavLink>
          </li>
          <li>
            <NavLink to="/ClassroomBooking">Classroom Booking</NavLink>
          </li>
          <li>
            <NavLink to="/ReservationSearch">Reservation Search</NavLink>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/ACCOUNT">ACCOUNT</NavLink>
              </li>
              <li>
                <li>
                  <NavLink to="/LOGIN">LOGIN</NavLink>
                </li>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/" onClick={handleLogout}>
                Logout
              </NavLink>
            </li>
          )}
        </ul>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/BOOKINGHISTORY" element={<BOOKINGHISTORY />} />
            <Route
              path="/ClassroomLocalization"
              element={<ClassroomLocalistion />}
            />
            <Route path="/ClassroomBooking" element={<ClassroomBooking />} />
            <Route path="/ReservationSearch" element={<ReservationSearch />} />
            <Route path="/LOGIN" element={<LOGIN onLogin={handleLogin} />} />
            {!isLoggedIn && <Route path="/ACCOUNT" element={<ACCOUNT />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default Main;
