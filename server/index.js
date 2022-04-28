const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", require("./Auth/route"));
app.use("/user", userAuth);

// app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/user", (req, res) => res.status(201).json({ username: req.username }));
app.post("/user/book", (req, res) => res.send("Meeting booked"));

app.get("/logout", (req, res) => {
	res.cookie("jwt", "", { maxAge: "1" });
	res.status(201).json({ message: "Successfully logged out", token: "" });
});

const server = app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

// Handling Error
process.on("unhandledRejection", (err) => {
	console.log(`An error occurred: ${err.message}`);
	server.close(() => process.exit(1));
});

connectDB();
