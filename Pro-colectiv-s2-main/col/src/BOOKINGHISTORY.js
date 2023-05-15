import React, { useState } from 'react';
import "./bookinghistory.css"

function BOOKINGHISTORY() {
    const [selectedValue, setSelectedValue] = useState(''); // set initial state as an empty string

    const handleChange = (event) => {
        setSelectedValue(event.target.value); // set selected value when an option is selected
    };

    return (
        <div>
            <select value={selectedValue} onChange={handleChange}>
                <option value="">--Select an option--</option> {/* set an empty option as a placeholder */}
                <option value="Sala A02">Sala A02</option>
                <option value="Sala F206">Sala F206</option>
                <option value="Sala A32">Sala A32</option>
                <option value="Sala 402">Sala 402</option>
                <option value="Sala 505">Sala 505</option>
            </select>
            <p>Selected value: {selectedValue}</p> {/* display the selected value */}
        </div>
    );
}

export default BOOKINGHISTORY
