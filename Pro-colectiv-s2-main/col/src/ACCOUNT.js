import React, { useState } from "react";

function AccountPage() {
  const [name, setName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send account information to server

    // Send the account information to the server
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      console.log(error);
      return error;
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

        if (data.message === "Registration successful")
          window.location.href = "#/LOGIN";
        else alert(data.error);
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
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default AccountPage;
