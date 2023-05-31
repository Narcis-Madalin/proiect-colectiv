import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

function AccountPage() {
  const [name, setName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send account information to server

    // Send the account information to the server
    if (password !== confirmPassword) {
      setError("Parolele introduse nu sunt identice");
      console.log(error);
      return;
    }

    fetch("/register", {
      method: "POST",
      body: JSON.stringify({ name, FirstName, email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Redirect the user to the login page

        if (data.message === "Registration successful") navigate("/LOGIN");
        else setError(data.error);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Create an Account</h2>
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
          FirstName:
          <input
            type="text"
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
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
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error} — <strong>Reintrodu Datele</strong>
          </Alert>
        )}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default AccountPage;
