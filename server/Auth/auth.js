const path = require("path").resolve(__dirname + "/../..");
require("dotenv").config({ path: path + "/.env" });
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.RI_JWT;

exports.register = async (req, res, next) => {
	const { username, password } = req.body;
	if (password.length < 6) {
		return res.status(400).json({ message: "Password less than 6 characters" });
	}
	bcrypt.hash(password, 10).then(async (hash) => {
		await User.create({
			username,
			password: hash,
		})
			.then((user) => {
				const maxAge = 3 * 60 * 60;
				const token = jwt.sign({ id: user._id, username, role: user.role }, jwtSecret, {
					expiresIn: maxAge, // 3hrs in sec
				});
				res.cookie("jwt", token, {
					httpOnly: true,
					maxAge: maxAge * 1000, // 3hrs in ms
				});
				res.status(201).json({
					message: "User successfully created",
					user: user._id,
					token: token,
				});
			})
			.catch((error) =>
				res.status(400).json({
					message: "User not successful created",
					error: error.message,
				})
			);
	});
};

exports.login = async (req, res, next) => {
	const { username, password } = req.body;
	// Check if username and password is provided
	if (!username || !password) {
		return res.status(400).json({
			message: "Username or Password not present",
		});
	}
	try {
		const user = await User.findOne({ username });
		if (!user) {
			res.status(400).json({
				message: "Incorrect username or password",
				error: "User not found",
			});
		} else {
			// comparing given password with hashed password
			bcrypt.compare(password, user.password).then(function (result) {
				if (result) {
					const maxAge = 3 * 60 * 60;
					const token = jwt.sign({ id: user._id, username, role: user.role }, jwtSecret, {
						expiresIn: maxAge, // 3hrs in sec
					});
					res.cookie("jwt", token, {
						httpOnly: true,
						maxAge: maxAge * 1000, // 3hrs in ms
					});
					res.status(201).json({
						message: "User successfully Logged in",
						user: user._id,
						username: user.username,
						token: token,
					});
				} else {
					res.status(400).json({ message: "Incorrect username or password" });
				}
			});
		}
	} catch (error) {
		res.status(400).json({
			message: "An error occurred",
			error: error.message,
		});
	}
};
