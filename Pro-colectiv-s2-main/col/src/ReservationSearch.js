import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "./ReservationSearch.css";
import dayjs from "dayjs";

import { DateRangePicker } from "react-date-range";
import { addDays, formatISO } from "date-fns";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import StickyHeadTable from "./StickyHeadTable";

const ReservationSearch = () => {
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [reservations, setReservations] = useState([]);

  const coloane = [
    { id: "classroom", label: "Classroom", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 100 },
    { id: "startTime", label: "Start Time", minWidth: 100 },
    { id: "endTime", label: "End Time", minWidth: 100 },
  ];

  const handleDateTimeChange = (ranges) => {
    setSelectedDates([ranges.selection]);
  };

  const handleSearch = () => {
    const startDate = selectedDates[0]?.startDate;
    const endDate = selectedDates[0]?.endDate;

    // formatez data sa corespunda cu cele din baza de date
    const searchData = {
      startDate: selectedDates[0]?.startDate
        ? dayjs(startDate).format("YYYY-MM-DD")
        : "",
      endDate: selectedDates[0]?.endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : "",
    };

    console.log(searchData);

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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="formContainer">
        <div className="formRow">
          <DateRangePicker
            onChange={handleDateTimeChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
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
        <StickyHeadTable columns={coloane} data={reservations} />
      </div>
    </div>
  );
};

export default ReservationSearch;
