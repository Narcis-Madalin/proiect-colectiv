import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./Home";
import RESERVATION from "./RESERVATION";
import BOOKINGHISTORY from "./BOOKINGHISTORY";
import ClassroomLocalistion from "./ClassroomLocalisation";
import ACCOUNT from "./ACCOUNT";
import LOGIN from "./LOGIN";
import ClassroomBooking from "./ClassroomBooking";
import ReservationSearch from "./ReservationSearch";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  handleLogout = () => {
    // Clear any stored tokens or session information
    // Example: localStorage.removeItem('accessToken');

    // Set the isLoggedIn state to false
    this.setState({ isLoggedIn: false });

    // Clear the token from local storage or state variable
    localStorage.removeItem("token");
    localStorage.clear();

    // Redirect the user to the login page
    //window.location.href = "#/LOGIN";
  };

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
              <NavLink to="/BOOKINGHISTORY">BOOKING HISTORY</NavLink>
            </li>
            <li>
              <NavLink to="/ClassroomLocalistion">
                Classroom Localisation
              </NavLink>
            </li>
            <li>
              <NavLink to="/ClassroomBooking">Classroom Booking</NavLink>
            </li>
            <li>
              <NavLink to="/ReservationSearch">Reservation Search</NavLink>
            </li>
            {this.state.isLoggedIn ? null : (
              <li>
                <NavLink to="/ACCOUNT">ACCOUNT</NavLink>
              </li>
            )}
            <li>
              {this.state.isLoggedIn ? (
                <NavLink to="/" onClick={this.handleLogout}>
                  Logout
                </NavLink>
              ) : (
                <NavLink exact to="/LOGIN">
                  LOGIN
                </NavLink>
              )}
            </li>
          </ul>
          <div className="content">
            <Routes>
              <Route path="/LOGIN" element={<LOGIN />} />
              <Route path="/RESERVATION" element={<RESERVATION />} />
              <Route path="/BOOKINGHISTORY" element={<BOOKINGHISTORY />} />
              <Route
                path="/ClassroomLocalistion"
                element={<ClassroomLocalistion />}
              />
              <Route path="/ClassroomBooking" element={<ClassroomBooking />} />
              <Route
                path="/ReservationSearch"
                element={<ReservationSearch />}
              />
              {this.state.isLoggedIn ? null : (
                <Route path="/ACCOUNT" element={<ACCOUNT />} />
              )}
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
