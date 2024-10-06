const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let users = [];

// Load existing users from JSON file if it exists
fs.readFile("users.json", (err, data) => {
  if (!err && data) {
    users = JSON.parse(data);
  }
});

// Serve index.html (which contains all sections)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registration route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  const user = { username, email, password };

  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    return res.status(400).send("User already exists.");
  }

  users.push(user);
  fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).send("Error saving user.");
    return res.redirect("/"); // Redirect to home after registration
  });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).send("Invalid credentials.");
  }

  // Successful login (return a success status)
  res.status(200).send("Login successful");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
