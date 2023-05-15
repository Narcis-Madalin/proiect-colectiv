import React, { Component } from "react";
import { Route, NavLink, HashRouter, Routes } from "react-router-dom";
import Home from "./Home";
import RESERVATION from "./RESERVATION";
import BOOKINGHISTORY from "./BOOKINGHISTORY";
import ClassroomLocalistion from "./ClassroomLocalisation";
import ACCOUNT from "./ACCOUNT";
import LOGIN from "./LOGIN";
import ClassroomBooking from "./ClassroomBooking";

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>UVT BECOME YOUR BEST</h1>
          <ul className="header">
            <li>
              <NavLink to="/">HOME</NavLink>
            </li>
            <li>
              <NavLink to="/Reservation">RESERVATION</NavLink>{" "}
            </li>
            <li>
              <NavLink to="/BOOKINGHISTORY">BOOKING HISTORY</NavLink>{" "}
            </li>
            <li>
              <NavLink to="/ClassroomLocalistion">
                ClassroomLocalisation
              </NavLink>
            </li>
            <li>
              <NavLink to="/ClassroomBooking">Classroom Booking</NavLink>
            </li>
            <li>
              <NavLink to="/ACCOUNT">ACCOUNT</NavLink>{" "}
            </li>
            <li>
              <NavLink to="/LOGIN">LOGIN</NavLink>{" "}
            </li>
          </ul>
          <div className="content">
            <Routes>
              <Route exact path="/" Component={Home} />
              <Route exact path="/RESERVATION" Component={RESERVATION} />
              <Route exact path="/BOOKINGHISTORY" Component={BOOKINGHISTORY} />
              <Route
                exact
                path="/ClassroomLocalistion"
                Component={ClassroomLocalistion}
              />
              <Route
                exact
                path="/ClassroomBooking"
                Component={ClassroomBooking}
              />
              <Route exact path="/ACCOUNT" Component={ACCOUNT} />
              <Route exact path="/LOGIN" Component={LOGIN} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  }
}
export default Main;
