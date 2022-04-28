import {
	Autocomplete,
	Button,
	Chip,
	FormControl,
	FormHelperText,
	FormLabel,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { ReactComponent as Logo } from "../images/ri_logo.svg";

function Login({ setUser }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const credentials = { username, password };
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
		const data = await res.json();

		if (res.ok) {
			// TODO: register myself as user
			setUser(data.username);
		} else {
			setError(data.message);
		}
	};

	return (
		<div className="login-container">
			<div className="title">
				<Logo style={{ marginRight: "20px" }} />
				<h2>RI Meeting Booker Login</h2>
			</div>
			<form onSubmit={handleSubmit}>
				<FormLabel className="FormLabel">Username</FormLabel>
				<FormControl>
					<TextField
						required
						id="username"
						label="Username"
						variant="outlined"
						size="small"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</FormControl>
				<FormLabel className="FormLabel">Password</FormLabel>
				<FormControl>
					<TextField
						required
						id="password"
						type="password"
						label="Password"
						variant="outlined"
						size="small"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormControl>
				<Button variant="outlined" style={{ marginTop: "10px" }} type="submit">
					Submit
				</Button>
				{error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
			</form>
		</div>
	);
}

export default Login;
