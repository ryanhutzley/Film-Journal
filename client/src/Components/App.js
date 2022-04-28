import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./Login";
import MeetingForm from "./MeetingForm";
import { useState, useEffect } from "react";

const THEME = createTheme({
	typography: {
		fontFamily: `"InputMono", "Helvetica", "Arial", sans-serif`,
		fontSize: 14,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
	},
});

function App() {
	const [user, setUser] = useState("");
	const [unauthorized, setUnauthorized] = useState(false);

	useEffect(() => {
		console.log("useEffect called");
		const checkIfLoggedIn = async () => {
			const res = await fetch("/user");
			const data = await res.json();
			if (res.ok) {
				setUser(data.username);
			} else {
				setUser("");
			}
		};
		checkIfLoggedIn();
	}, [unauthorized]);

	console.log(user);

	return (
		<ThemeProvider theme={THEME}>
			{!user ? (
				<Login setUser={setUser} />
			) : (
				<MeetingForm setUnauthorized={setUnauthorized} unauthorized={unauthorized} />
			)}
		</ThemeProvider>
	);
}

export default App;
