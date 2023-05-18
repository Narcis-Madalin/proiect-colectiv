import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import "./ClassroomBooking.css";
import ReservationPage from "./RESERVATION";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button } from "@mui/material";
import { AuthContext } from "./AuthContext";

const ClassroomBooking = () => {
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);

  const [selectedDateTime, setSelectedDateTime] = React.useState(new Date());

  //   function setClassrooms(arr) {
  //     classrooms = arr;
  //   }

  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: "A1",
      booked: false,
      capacity: 30,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 2,
      name: "A2",
      booked: false,
      capacity: 25,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 3,
      name: "A3",
      booked: false,
      capacity: 20,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 4,
      name: "A4",
      booked: false,
      capacity: 35,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 5,
      name: "B1",
      booked: false,
      capacity: 30,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 6,
      name: "B2",
      booked: false,
      capacity: 25,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 7,
      name: "B3",
      booked: false,
      capacity: 20,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
    {
      id: 8,
      name: "B4",
      booked: true,
      capacity: 35,
      location: "Building A, Floor 1",
      bookingDate: null,
      bookingStartTime: null,
      bookingEndTime: null,
      reservations: [],
    },
  ]);

  // const [reservationsArray, setReservationsArray] = useState([
  //   {
  //     id: 1,
  //     classroom: null,
  //     date: null,
  //     startTime: null,
  //     endTime: null,
  //   },
  // ]);

  // Pentru a actualiza statusul salii la incaracrea paginii, astfel nu mai trebuie apasat pe sala pt a vedea daca e booked sau nu

  useEffect(() => {
    classrooms.forEach((classroom) => {
      fetch(`/api/reservations/${classroom.name}`)
        .then((response) => response.json())
        .then((data) => {
          setClassrooms((prevState) => {
            const updatedClassrooms = prevState.map((prevClassroom) => {
              if (prevClassroom.name === classroom.name) {
                return { ...prevClassroom, ...data };
              }
              return prevClassroom;
            });
            return updatedClassrooms;
          });
        })
        .catch((error) => console.log(error));
    });
  }, []);

  const handleClassroomClick = (classroom) => {
    fetch(`/api/reservations/test/${classroom.name}`)
      .then((response) => response.json())
      .then((data) => {
        const { booked, bookings } = data;
        if (booked) {
          const reservations = bookings.map((booking) => ({
            classroom: classroom.name,
            date: booking.bookingDate,
            startTime: booking.bookingStartTime,
            endTime: booking.bookingEndTime,
          }));
          setSelectedClassroom({
            ...classroom,
            reservations: reservations,
          });
          setReservationSubmitted(false);
        } else {
          setSelectedClassroom(classroom);
          setReservationSubmitted(false);
          console.log("No bookings found for classroom:", classroom.name);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleFilter = (reservation) => {
    if (!selectedDate) {
      return true; // Show all reservations when no date is selected
    }
    return reservation.date === selectedDate; // Filter reservations by selected date
  };

  const handleDateTimeChange = (selectedDateTime) => {
    console.log("Selected Date and Time:", selectedDateTime);
  };

  // Adjust the hour based on the desired time zone offset
  const adjustTimeZoneOffset = (date) => {
    const timeZoneOffset = 180; // Replace with the desired time zone offset in minutes
    const adjustedDate = new Date(date.getTime() + timeZoneOffset * 60 * 1000);
    return adjustedDate;
  };

  const handleOkButtonClick = () => {
    if (selectedDateTime) {
      // Display the selected date and time
      console.log(selectedDateTime.toString());
    } else {
      console.log("No date and time selected.");
    }
  };

  // const c = (classroom) => {
  //   fetch(`/api/reservations/${classroom.name}`)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       const { booked, bookingDate, bookingStartTime, bookingEndTime } =
  //         result;
  //       if (booked) {
  //         const updatedClassrooms = classrooms.map((c) => {
  //           if (c.name === classroom.name) {
  //             return {
  //               ...c,
  //               booked: true,
  //               bookingDate,
  //               bookingStartTime,
  //               bookingEndTime,
  //             };
  //           } else {
  //             return c;
  //           }
  //         });
  //         setClassrooms(updatedClassrooms);
  //         alert("Sala este deja utilizata/rezervata!");
  //         setSelectedClassroom(classroom);
  //         setReservationSubmitted(true);
  //       } else {
  //         setSelectedClassroom(classroom);
  //         setReservationSubmitted(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert("A apărut o eroare la obținerea datelor rezervărilor!");
  //     });
  // };

  return (
    <div>
      <h2>Classroom Booking</h2>
      <div className="classroom-container">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className={`classroom ${
              classroom.booked ? "booked" : "available"
            } ${selectedClassroom?.id === classroom.id ? "selected" : ""}`}
            onClick={() => handleClassroomClick(classroom)}
          >
            {classroom.name}
          </div>
        ))}
      </div>
      {selectedClassroom && (
        <div>
          <h3>Classroom Details</h3>
          <TableContainer component={Paper}>
            <Table aria-label="classroom details">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Booked</TableCell>
                  <TableCell align="right">Capacity</TableCell>
                  <TableCell align="right">Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={selectedClassroom.id}>
                  <TableCell component="th" scope="row">
                    {selectedClassroom.name}
                  </TableCell>
                  <TableCell align="right">
                    {selectedClassroom.booked ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="right">
                    {selectedClassroom.capacity}
                  </TableCell>
                  <TableCell align="right">
                    {selectedClassroom.location}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {selectedClassroom && selectedClassroom.reservations && (
        <div>
          <h3>Reservations</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Basic date time picker"
                onChange={handleDateTimeChange}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button variant="contained" onClick={handleOkButtonClick}>
            OK
          </Button>
          <TableContainer component={Paper}>
            <Table aria-label="reservations">
              <TableHead>
                <TableRow>
                  <TableCell>Classroom</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Start Time</TableCell>
                  <TableCell align="right">End Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedClassroom.reservations.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell>{reservation.classroom}</TableCell>
                    <TableCell align="right">{reservation.date}</TableCell>
                    <TableCell align="right">{reservation.startTime}</TableCell>
                    <TableCell align="right">{reservation.endTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {selectedClassroom && !reservationSubmitted && <ReservationPage />}
    </div>
  );
};

export default ClassroomBooking;
