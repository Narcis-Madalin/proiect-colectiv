import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { DateRangePicker } from "react-date-range";
import { addDays, formatISO } from "date-fns";

import StickyHeadTable from "./StickyHeadTable";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const AvailabilitySearch = () => {
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [reservations, setReservations] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState(new Map());
  const [availabilityList, setAvailabilityList] = useState([]);
  const [classrooms] = useState([
    { id: 1, name: "A1" },
    { id: 2, name: "A2" },
    { id: 3, name: "A3" },
    { id: 4, name: "A4" },
    { id: 5, name: "B1" },
    { id: 6, name: "B2" },
    { id: 7, name: "B3" },
    { id: 8, name: "B4" },
  ]);

  const coloane = [
    { id: "date", label: "Date", minWidth: 100 },
    { id: "classroom", label: "Classroom", minWidth: 100 },
    { id: "startTime", label: "Start Time", minWidth: 100 },
    { id: "endTime", label: "End Time", minWidth: 100 },
  ];

  const handleDateTimeChange = (ranges) => {
    setSelectedDates([ranges.selection]);
  };

  const handleSearch = () => {
    const startDate = selectedDates[0]?.startDate;
    const endDate = selectedDates[0]?.endDate;

    const searchData = {
      startDate: selectedDates[0]?.startDate
        ? formatISO(startDate, { representation: "date" })
        : "",
      endDate: selectedDates[0]?.endDate
        ? formatISO(endDate, { representation: "date" })
        : "",
    };

    const url = `/api/searchReservations?startDate=${encodeURIComponent(
      searchData.startDate
    )}&endDate=${encodeURIComponent(searchData.endDate)}`;

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
        updateAvailabilityMap();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateAvailabilityMap = () => {
    const availabilityList = [];

    selectedDates.forEach((range) => {
      const currentDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);

      while (currentDate <= endDate) {
        const dateString = formatISO(currentDate, { representation: "date" });

        classrooms.forEach((classroom) => {
          const reservationsForClassroom = reservations.filter(
            (reservation) =>
              reservation.classroom === classroom.name &&
              reservation.date === dateString
          );

          if (reservationsForClassroom.length === 0) {
            availabilityList.push({
              date: dateString,
              classroom: classroom.name,
              startTime: "08:00:00",
              endTime: "18:00:00",
            });
          } else {
            let previousEndTime = "08:00:00";

            // Sort reservations by start time
            reservationsForClassroom.sort((a, b) => {
              if (a.startTime < b.startTime) return -1;
              if (a.startTime > b.startTime) return 1;
              return 0;
            });

            reservationsForClassroom.forEach((reservation) => {
              if (reservation.startTime > previousEndTime) {
                availabilityList.push({
                  date: dateString,
                  classroom: classroom.name,
                  startTime: previousEndTime,
                  endTime: reservation.startTime,
                });
              }

              previousEndTime = reservation.endTime;
            });

            if (previousEndTime < "18:00:00") {
              availabilityList.push({
                date: dateString,
                classroom: classroom.name,
                startTime: previousEndTime,
                endTime: "18:00:00",
              });
            }
          }
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    setAvailabilityList(availabilityList);
  };

  return (
    <div className="container">
      <div className="formContainer">
        <div className="formRow">
          <DateRangePicker
            onChange={handleDateTimeChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={selectedDates}
            direction="horizontal"
          />

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
        <StickyHeadTable columns={coloane} data={availabilityList} />
      </div>
    </div>
  );
};

export default AvailabilitySearch;
