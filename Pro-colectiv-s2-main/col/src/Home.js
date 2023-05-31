import React, { useState, useEffect } from "react";
import RESERVATION from "./RESERVATION";
import "./table.css";
import { useNavigate } from "react-router-dom";
import CustomizedDialogs from "./CustomizedDialogs";

function ClassroomTable() {
  const navigate = useNavigate();

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
  const [showDialog, setShowDialog] = useState(false);

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
    navigate("/ClassroomBooking");
  };

  const handleDetailsClick = (classroom) => {
    setSelectedClassroom(classroom);
    setShowDialog(true);
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
      <h2>Sali disponibile pentru rezervare</h2>
      <table>
        <thead>
          <tr>
            <th>Classroom Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Reservation</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {showForm && (
        <RESERVATION classroom={selectedClassroom} onClose={handleFormClose} />
      )}
      {showDialog && (
        <CustomizedDialogs
          classroom={selectedClassroom}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}

export default ClassroomTable;
