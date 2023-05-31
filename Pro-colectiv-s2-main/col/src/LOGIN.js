import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./login.css";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Login successful") {
          // Save the token to local storage or state variable
          localStorage.setItem("token", data.token);

          if (data.userId) {
            setUserId(data.userId);
            localStorage.setItem("userId", data.userId);
          }

          // Call the onLogin callback to update the isLoggedIn state
          onLogin();

          // Redirect the user to the home page
          navigate("/");
        } else {
          setErrorMessage(
            "Parola introdusa este gresita sau nu exista cont cu acest email"
          );
          //alert("Invalid email or password");
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {errorMessage && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage} — <strong>Reintrodu Datele</strong>
          </Alert>
        )}
        <Button block="true" size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}
