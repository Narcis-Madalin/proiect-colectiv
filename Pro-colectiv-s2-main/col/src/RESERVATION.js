import React, { useState } from "react";
import "./reservation.css";

function ReservationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classroom, setclassroom] = useState("");
  const [date, setDate] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send reservation information to server
    //setReservationSubmitted(true);

    fetch("/Reservation", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        classroom,
        date,
        StartTime,
        EndTime,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Redirect the user to the home page

        if (data.message === "Reservation data inserted successfully")
          window.location.href = "#/";
        //else alert("Utilizatorul nu exista sau datele sunt incorecte");
        else alert(data.error);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Make a Reservation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          classroom:
          <input
            type="text"
            value={classroom}
            onChange={(e) => setclassroom(e.target.value)}
          />
        </label>
        <label>
          Date of Reservation:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="time"
            value={StartTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="time"
            value={EndTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReservationPage;
