import React, { useState, useEffect } from "react";
import RESERVATION from "./RESERVATION";
import "./table.css";

function ClassroomTable() {
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: "A1",
      booked: false,
      capacity: 30,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 2,
      name: "A2",
      booked: false,
      capacity: 25,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 3,
      name: "A3",
      booked: false,
      capacity: 20,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 4,
      name: "A4",
      booked: false,
      capacity: 35,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 5,
      name: "B1",
      booked: false,
      capacity: 30,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 6,
      name: "B2",
      booked: false,
      capacity: 25,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 7,
      name: "B3",
      booked: false,
      capacity: 20,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
    {
      id: 8,
      name: "B4",
      booked: true,
      capacity: 35,
      location: "Building A, Floor 1",
      bookingStartTime: null,
      bookingEndTime: null,
    },
  ]);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleReserveClick = (classroom) => {
    setSelectedClassroom(classroom);
    setShowForm(true);
  };

  const handleDetailsClick = (classroom) => {
    alert(`Classroom name: ${classroom.name}\nCapacity: ${classroom.capacity}\nLocation: ${classroom.location}
      This classroom can be booked only from Monday to Friday and from 8am to 6pm`);
  };

  const handleFormClose = () => {
    setSelectedClassroom(null);
    setShowForm(false);
  };

  const unbookedClassrooms = classrooms.filter(
    (classroom) => !classroom.booked
  );

  const rows = unbookedClassrooms.map((classroom, index) => (
    <tr key={index}>
      <td>{classroom.name}</td>
      <td>{classroom.capacity}</td>
      <td>{classroom.location}</td>
      <td>{classroom.booked ? "Booked" : "Available"}</td>
      <td>{classroom.bookingStartTime}</td>
      <td>{classroom.bookingEndTime}</td>
      <td>
        <button onClick={() => handleReserveClick(classroom)}>Reserve</button>
      </td>
      <td>
        <button onClick={() => handleDetailsClick(classroom)}>Details</button>
      </td>
    </tr>
  ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Classroom Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Booking Start Time</th>
            <th>Booking End Time</th>
            <th>Reservation</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {showForm && (
        <RESERVATION classroom={selectedClassroom} onClose={handleFormClose} />
      )}
    </div>
  );
}

export default ClassroomTable;
