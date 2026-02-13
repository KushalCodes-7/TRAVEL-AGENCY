const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* ========================
   DATABASE FILE
======================== */
const DB_FILE = path.join(__dirname, "db.json");

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ messages: [], reviews: [] }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ========================
   API ROUTES
======================== */
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const db = readDB();

  const newMessage = {
    id: uuidv4(),
    name,
    email,
    message,
    date: new Date()
  };

  db.messages.push(newMessage);
  writeDB(db);

  res.json({ success: true });
});

app.get("/api/dashboard", (req, res) => {
  const db = readDB();
  res.json(db);
});

/* ========================
   SERVE FRONTEND
======================== */
const frontendPath = path.resolve(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ========================
   START SERVER
======================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
