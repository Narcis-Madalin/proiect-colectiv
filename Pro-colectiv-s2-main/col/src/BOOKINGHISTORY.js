import React, { useState, useEffect } from "react";
import "./bookinghistory.css";

function BOOKINGHISTORY() {
  const [bookingData, setBookingData] = useState(null);
  const userId = localStorage.getItem("userId");
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    // Check if userId is a valid integer value
    const parsedUserId = parseInt(userId, 10);
    if (!isNaN(parsedUserId)) {
      // Fetch the booking history data from the server using the user's ID and the selected value
      fetch(`/api/bookinghistory/${parsedUserId}/${value}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.bookings) {
            setBookingData(data.bookings);
          }
        })
        .catch((error) => console.error(error));
    } else {
      console.log("SHIIOIIIIT");
    }
  };

  useEffect(() => {
    console.log(selectedValue); // Log the updated selectedValue
  }, [selectedValue]);

  useEffect(() => {
    // Fetch the booking history data from the server using the user's ID and the selected value
    fetch(`/api/bookinghistory/${userId}/${selectedValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.bookings) {
          setBookingData(data.bookings);
        }
      })
      .catch((error) => console.error(error));
  }, [userId, selectedValue]);

  return (
    <div>
      <h2>Booking History</h2>
      <select value={selectedValue} onChange={handleChange}>
        <option value="">--Select an option--</option>{" "}
        {/* set an empty option as a placeholder */}
        <option value="A1">Sala A1</option>
        <option value="A2">Sala A2</option>
        <option value="A3">Sala A3</option>
        <option value="A4">Sala A4</option>
        <option value="B1">Sala B1</option>
        <option value="B2">Sala B2</option>
        <option value="B3">Sala B3</option>
        <option value="B4">Sala B4</option>
      </select>
      <div>
        {bookingData ? (
          <div>
            {bookingData.map((booking, index) => (
              <div key={index}>
                <p>Date: {booking.bookingDate}</p>
                <p>Start Time: {booking.bookingStartTime}</p>
                <p>End Time: {booking.bookingEndTime}</p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default BOOKINGHISTORY;
