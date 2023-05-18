const express = require("express");
const app = express();
const bcript = require("bcrypt"); // importing bcript package
const port = 8000;
const sql = require("mssql");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { expressjwt: expressjwt } = require("express-jwt");
const session = require("express-session");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  trustServerCertificate: true,
};

app.use(express.json());

app.use(
  session({
    secret: "a40a1ee84f4322eb0fc6c259823d5d70013ca7b7c3ac03473c4fa88a2c69cda9", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
  })
);

const secretKey =
  "a40a1ee84f4322eb0fc6c259823d5d70013ca7b7c3ac03473c4fa88a2c69cda9"; // Replace with your own secret key

app.post("/register", (req, res) => {
  const { name, FirstName, email, password } = req.body;
  console.log({ name, FirstName, email, password });
  // Create a connection pool to the database
  const pool = new sql.ConnectionPool(dbConfig);
  pool
    .connect()
    .then(() => {
      // Check if the user already exists in the database
      const checkUserQuery = `SELECT * FROM ACCOUNT WHERE Email='${email}'`;
      pool
        .request()
        .query(checkUserQuery)
        .then((checkUserResult) => {
          if (checkUserResult.recordset.length > 0) {
            // User already exists
            res
              .status(409)
              .json({ error: "User with this email already exists" });
          } else {
            // User doesn't exist, insert the form data into the database
            const insertUserQuery = `INSERT INTO ACCOUNT (Nume, Prenume, Email, Parola) VALUES ('${name}', '${FirstName}', '${email}', '${password}')`;
            pool
              .request()
              .query(insertUserQuery)
              .then(() => {
                console.log("Data inserted successfully");
                res.json({ message: "Registration successful" });
              })
              .catch((err) => {
                console.error(err);
                res
                  .status(500)
                  .json({ error: "An error occurred while inserting data" });
              })
              .finally(() => {
                // Close the database connection pool
                pool.close();
              });
          }
        })
        .catch((err) => {
          console.error(err);
          res
            .status(500)
            .json({ error: "An error occurred while checking if user exists" });
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  // Create a connection pool to the database
  const pool = new sql.ConnectionPool(dbConfig);
  pool
    .connect()
    .then(() => {
      // Query the database for the user with the specified email and password
      const loginQuery = `SELECT * FROM ACCOUNT WHERE Email='${email}' AND Parola='${password}'`;
      pool
        .request()
        .query(loginQuery)
        .then((loginResult) => {
          if (loginResult.recordset.length === 1) {
            // User exists and the password matches, generate JWT
            const token = jwt.sign({ email }, secretKey, {
              expiresIn: "1h", // Token expires in 1 hour
            });

            // Save user's ID in session
            req.session.userId = loginResult.recordset[0].ID;

            res.json({
              message: "Login successful",
              token,
              userId: loginResult.recordset[0].ID,
            });
          } else {
            // User doesn't exist or the password doesn't match, send error response
            res.status(401).json({ error: "Invalid email or password" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            error: "An error occurred while checking user credentials",
          });
        })
        .finally(() => {
          // Close the database connection pool
          pool.close();
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

// app.post("/reservation", (req, res) => {
//   const { name, email, date, StartTime, EndTime } = req.body;

//   // Connect to the database and search for the User ID
//   sql.connect(dbConfig, (err) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ error: "Failed to connect to the database" });
//     } else {
//       const request = new sql.Request();
//       request.input("name", sql.NVarChar, name);
//       request.input("email", sql.NVarChar, email);
//       request.query(
//         "SELECT ID FROM Cont WHERE Nume = @name AND Email = @email",
//         (err, result) => {
//           if (err) {
//             console.log(err);
//             res.status(500).json({ error: "Failed to search for User ID" });
//           } else {
//             const contactId = result.recordset[0].id;

//             // Insert the reservation data using the contact ID
//             request.input("contactId", sql.Int, contactId);
//             request.input("date", sql.Date, date);
//             request.input("StartTime", sql.Time, StartTime);
//             request.input("EndTime", sql.Time, EndTime);
//             console.log({ name, email, date, StartTime, EndTime });
//           }
//         }
//       );
//     }
//   });
// });

// Middleware to verify JWT
const authenticate = expressjwt({ secret: secretKey, algorithms: ["RS256"] });

app.post("/Reservation", authenticate, (req, res) => {
  const { name, email, classroom, date, StartTime, EndTime } = req.body;

  // Check the format of the StartTime parameter using a regular expression
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(StartTime)) {
    res.status(400).json({ error: "Invalid StartTime format" });
    return;
  }

  // Connect to the database and search for the contact ID
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to connect to the database" });
    } else {
      const request = new sql.Request();
      request.input("name", sql.NVarChar, name);
      request.input("email", sql.NVarChar, email);
      request.query(
        "SELECT ID FROM ACCOUNT WHERE Nume = @name AND Email = @email",
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to search for User ID" });
          } else {
            const contactId = result.recordset[0].ID;

            // Insert the reservation data using the contact ID
            request.input("contactId", sql.Int, contactId);
            request.input("date", sql.Date, date);
            request.input("StartTime", sql.VarChar, StartTime);
            request.input("EndTime", sql.VarChar, EndTime);
            request.input("location", sql.VarChar, classroom);
            request.query(
              "INSERT INTO REZERVATION (ID_cont, Data_rezervare, Ora_start, Ora_final, Sala) VALUES (@contactId, @date, @StartTime, @EndTime, @location)",
              (err, result) => {
                if (err) {
                  console.log(err);
                  res
                    .status(500)
                    .json({ error: "Failed to insert reservation data" });
                } else {
                  res.status(200).json({
                    message: "Reservation data inserted successfully",
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

app.get("/api/reservations/:classroomName", function (req, res) {
  const name = req.params.classroomName;

  sql
    .connect(dbConfig)
    .then((pool) => {
      return pool
        .request()
        .input("sala", sql.VarChar(5), name)
        .query(
          `SELECT TOP 1 Data_rezervare, Ora_start, Ora_final, CONVERT(varchar(10), Data_rezervare, 120) AS Data_rezervare_str, CONVERT(varchar(8), Ora_start, 108) AS Ora_start_str, CONVERT(varchar(8), Ora_final, 108) AS Ora_final_str FROM REZERVATION WHERE Sala = @sala AND Data_rezervare = CONVERT(date, GETDATE()) AND CONVERT(time, GETDATE()) BETWEEN Ora_start AND Ora_final ORDER BY Ora_start DESC`
        );
    })
    .then((result) => {
      if (result.recordset.length > 0) {
        const bookingData = result.recordset[0];
        const bookingDate = bookingData.Data_rezervare_str;
        const bookingStartTime = bookingData.Ora_start_str;
        const bookingEndTime = bookingData.Ora_final_str;
        res.send({
          booked: true,
          bookingDate,
          bookingStartTime,
          bookingEndTime,
        });
      } else {
        res.send({
          booked: false,
        });
      }
    })
    .catch((err) => {
      console.error("SQL error", err);
      res.status(500).send("Error executing SQL query");
    });
});

// app.get("/api/reservations/:classroomName", (req, res) => {
//   const classroomName = req.params.classroomName;
//   sql
//     .connect(dbConfig)
//     .then(() => {
//       return sql.query(
//         `SELECT TOP 1 *, CONVERT(varchar(8), Ora_start, 108) AS Ora_start_str, CONVERT(varchar(8), Ora_final, 108) AS Ora_final_str, CONVERT(varchar(10), Data_rezervare, 120) AS Data_rezervare_str FROM REZERVATION WHERE Sala = '${classroomName}' ORDER BY Ora_start DESC
// `
//       );
//     })
//     .then((result) => {
//       if (result.recordset.length > 0) {
//         const bookingData = result.recordset[0];
//         const bookingDate = bookingData.Data_rezervare_str;
//         const bookingStartTime = bookingData.Ora_start_str;
//         const bookingEndTime = bookingData.Ora_final_str;
//         //console.log(bookingStartTime);
//         res.send({
//           booked: true,
//           bookingDate,
//           bookingStartTime,
//           bookingEndTime,
//         });
//       } else {
//         res.send({
//           booked: false,
//         });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send("Internal server error");
//     });
// });

app.get("/api/reservations/test/:name", function (req, res) {
  const name = req.params.name;

  sql
    .connect(dbConfig)
    .then((pool) => {
      return pool
        .request()
        .input("sala", sql.VarChar(5), name)
        .query(
          `SELECT *, CONVERT(varchar(10), Data_rezervare, 120) AS Data_rezervare_str, CONVERT(varchar(8), Ora_start, 108) AS Ora_start_str, CONVERT(varchar(8), Ora_final, 108) AS Ora_final_str FROM REZERVATION WHERE Sala = @sala AND Data_rezervare = CONVERT(date, GETDATE())`
        );
    })
    .then((result) => {
      if (result.recordset.length > 0) {
        const bookings = result.recordset.map((booking) => ({
          bookingDate: booking.Data_rezervare_str,
          bookingStartTime: booking.Ora_start_str,
          bookingEndTime: booking.Ora_final_str,
        }));
        res.send({
          booked: true,
          bookings,
        });
      } else {
        res.send({
          booked: false,
        });
      }
    })
    .catch((err) => {
      console.error("SQL error", err);
      res.status(500).send("Error executing SQL query");
    });
});

app.get("/api/bookinghistory/:userId/:selectedValue", (req, res) => {
  const userId = req.params.userId;
  const selectedValue = req.params.selectedValue;

  sql
    .connect(dbConfig)
    .then((pool) => {
      return pool
        .request()
        .input("id_cont", sql.VarChar(5), userId)
        .input("sala", sql.VarChar(5), selectedValue)
        .query(
          `SELECT *, CONVERT(varchar(10), Data_rezervare, 120) AS Data_rezervare_str, CONVERT(varchar(8), Ora_start, 108) AS Ora_start_str, CONVERT(varchar(8), Ora_final, 108) AS Ora_final_str FROM REZERVATION WHERE ID_cont = @id_cont AND Sala = @sala ORDER BY Data_rezervare DESC`
        );
    })
    .then((result) => {
      if (result.recordset.length > 0) {
        const bookings = result.recordset.map((booking) => ({
          bookingDate: booking.Data_rezervare_str,
          bookingStartTime: booking.Ora_start_str,
          bookingEndTime: booking.Ora_final_str,
        }));
        res.send({
          bookings,
        });
      } else {
        res.send({
          bookings: [], // Empty array when no bookings found
        });
      }
    })
    .catch((err) => {
      console.error("SQL error", err);
      res.status(500).send("Error executing SQL query");
    });
});

app.get("/api/searchReservations", (req, res) => {
  const classroom = req.query.classroom;
  const date = req.query.date;
  const time = req.query.time;

  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to connect to the database" });
    } else {
      const request = new sql.Request();
      request.input("sala", sql.NVarChar, classroom);
      request.input("date", sql.Date, date);
      request.input("time", sql.VarChar, time);

      request.query(
        "SELECT *, CONVERT(varchar(10), Data_rezervare, 120) AS Data_rezervare_str, CONVERT(varchar(8), Ora_start, 108) AS Ora_start_str, CONVERT(varchar(8), Ora_final, 108) AS Ora_final_str FROM REZERVATION WHERE Sala = @sala AND Data_rezervare = @date AND Ora_final > @time",
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed" });
          } else {
            const bookings = result.recordset.map((booking) => ({
              classroom: booking.Sala,
              date: booking.Data_rezervare_str,
              startTime: booking.Ora_start_str,
              endTime: booking.Ora_final_str,
            }));
            res.json(bookings);
          }
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
