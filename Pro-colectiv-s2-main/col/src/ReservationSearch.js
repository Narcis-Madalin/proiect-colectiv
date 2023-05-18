import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import "./ReservationSearch.css";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const ReservationSearch = () => {
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reservations, setReservations] = useState([]);

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  const handleDateTimeChange = (newValue) => {
    setSelectedDate(newValue.format("YYYY-MM-DD"));
    setSelectedTime(newValue.format("HH:mm:ss"));
  };

  const handleSearch = () => {
    const searchData = {
      classroom: selectedClassroom,
      date: selectedDate,
      time: selectedTime,
    };

    console.log(searchData);

    const url = `/api/searchReservations?classroom=${encodeURIComponent(
      searchData.classroom
    )}&date=${encodeURIComponent(searchData.date)}&time=${encodeURIComponent(
      searchData.time
    )}`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch reservations");
        }
      })
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="formContainer">
        <div className="formRow">
          <select
            className="select"
            value={selectedClassroom}
            onChange={handleClassroomChange}
          >
            <option value="">--Select an option--</option>
            <option value="A1">Sala A1</option>
            <option value="A2">Sala A2</option>
            <option value="A3">Sala A3</option>
            <option value="A4">Sala A4</option>
            <option value="B1">Sala B1</option>
            <option value="B2">Sala B2</option>
            <option value="B3">Sala B3</option>
            <option value="B4">Sala B4</option>
          </select>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="datePicker"
              label="Data si ora"
              value={selectedDate}
              onChange={handleDateTimeChange}
            />
          </LocalizationProvider>

          <Button
            className="searchButton"
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="tableContainer">
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
              {reservations.map((reservation, index) => (
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
    </div>
  );
};

export default ReservationSearch;
