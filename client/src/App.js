import { useState, useEffect } from "react";
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
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { DateTimePicker } from "@mui/lab";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactComponent as Logo } from "./images/ri_logo.svg";
import ExtAttendee from "./ExtAttendee";
import "./App.css";

const allIntAttendees = [
	{ name: "Yaron Singer", id: 1 },
	{ name: "Kojin Oshiba", id: 2 },
	{ name: "Ryan O'Rourke", id: 3 },
	{ name: "Andrew Amato", id: 4 },
	{ name: "Alan Nguyen", id: 5 },
	{ name: "Girish Chandresekar", id: 6 },
	{ name: "Kevin Luo", id: 7 },
];

const RIattedeeEmails = {
	"Yaron Singer": "yaron@robustintelligence.com",
	"Kojin Oshiba": "kojin@robustintelligence.com",
	"Ryan O'Rourke": "ryno@robustintelligence.com",
	"Andrew Amato": "andrew@robustintelligence.com",
	"Alan Nguyen": "alan@robustintelligence.com",
	"Girish Chandresekar": "girish@robustintelligence.com",
	"Kevin Luo": "kevin@robustintelligence.com",
};

const dataTypes = ["Custom", "Genomic", "Images", "NLP", "Tabular"];

const opptyOwners = [
	"Ryan Hutzley",
	"Ellen Scott-Young",
	"Sophia Serseri",
	"Katherine Hess",
	"Mark Levinson",
	"Dominic Glover",
	"Ryan O'Rourke",
	"Andrew Amato",
];

const THEME = createTheme({
	typography: {
		fontFamily: `"InputMono", "Helvetica", "Arial", sans-serif`,
		fontSize: 14,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
	},
});

const dateTime = new Date();

function App() {
	const [fields, setFields] = useState({
		externalAttendees: [{ name: "", email: "", role: "", primaryContact: false }],
		internalAttendees: [allIntAttendees[0].name],
		companyName: "",
		dataType: "",
		meetingDateTime: dateTime,
		oppOwner: "",
		context: "You will be meeting with...",
	});
	const nameAndEmail = fields.externalAttendees.map((att) => `${att.name}, ${att.role}`);

	useEffect(() => {
		formatAttendees(fields.externalAttendees, fields.companyName);
	}, [fields.companyName, fields.externalAttendees.length, JSON.stringify(nameAndEmail)]);

	function formatAttendees(attendees, company) {
		let initialString = "You will be meeting with ";
		const stringifiedAtts = attendees.map((att) => {
			return `${att.name}, ${att.role}`;
		});
		if (stringifiedAtts.length === 1) {
			setFields({
				...fields,
				context: initialString + stringifiedAtts[0] + ` at ${company}`,
			});
		}
		if (stringifiedAtts.length === 2) {
			setFields({
				...fields,
				context: initialString + stringifiedAtts.join(" and ") + ` at ${company}`,
			});
		}
		if (stringifiedAtts.length > 2) {
			setFields({
				...fields,
				context:
					initialString +
					stringifiedAtts.slice(0, -1).join(", ") +
					" and " +
					stringifiedAtts.slice(-1) +
					` at ${company}`,
			});
		}
	}

	function handleTextFieldChange(e) {
		const { id, value } = e.target;
		setFields({
			...fields,
			[id]: value,
		});
	}

	function handleExtAttChange(e) {
		const [field, index] = e.target.id.split("-");
		const formValues = { ...fields };
		formValues.externalAttendees[index][field] = e.target.value;
		setFields(formValues);
	}

	function handleCheckBoxChange(e) {
		const { id, checked } = e.target;
		setFields({
			...fields,
			[id]: checked,
		});
	}

	function handleAdd() {
		const values = { ...fields };
		values.externalAttendees.push({ name: "", email: "", role: "", primaryContact: false });
		setFields(values);
	}

	function handleRemove(i) {
		const values = { ...fields };
		values.externalAttendees.splice(i, 1);
		setFields(values);
	}

	function handleSubmit(e) {
		e.preventDefault();
		console.log("submitted!");
		// TODO: Set error states for email, 1 Primary Contact, and meetingDateTime = date
	}

	const isRemoveDisplayed = fields.externalAttendees.length >= 2 ? true : false;

	console.log(fields);

	return (
		<ThemeProvider theme={THEME}>
			<div className="form-container">
				<div className="title">
					<Logo style={{ marginRight: "20px" }} />
					<h2>ROBUST INTELLIGENCE Meeting Booker</h2>
				</div>
				<form onSubmit={handleSubmit}>
					<FormLabel className="FormLabel">External Attendee</FormLabel>
					{fields.externalAttendees.map((attendee, idx) => {
						return (
							<ExtAttendee
								attendeeFields={attendee}
								key={idx.toString()}
								handleExtAttChange={handleExtAttChange}
								handleCheckBoxChange={handleCheckBoxChange}
								index={idx.toString()}
							/>
						);
					})}
					<div className="section">
						<Button variant="outlined" className="ext-attendee-btn" onClick={() => handleAdd()}>
							Add External Attendee
						</Button>
						{isRemoveDisplayed && (
							<Button
								variant="outlined"
								color="error"
								className="ext-attendee-btn"
								onClick={() => handleRemove(fields.externalAttendees.length - 1)}
							>
								Remove External Attendee
							</Button>
						)}
					</div>
					<FormLabel className="FormLabel">Internal Attendees</FormLabel>
					<Autocomplete
						multiple
						filterSelectedOptions
						size="small"
						id="internalAttendees"
						options={allIntAttendees.map((option) => option.name)}
						value={fields.internalAttendees}
						onChange={(event, newValue) =>
							setFields({
								...fields,
								internalAttendees: newValue,
							})
						}
						renderTags={(intAttendeesState, getTagProps) =>
							intAttendeesState.map((option, index) => (
								<Chip variant="outlined" label={option} {...getTagProps({ index })} />
							))
						}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="RI Attendees"
								required={fields.internalAttendees.length > 0 ? false : true}
							/>
						)}
					/>
					<FormLabel className="FormLabel">Meeting Details</FormLabel>
					<div className="section">
						<FormControl>
							<TextField
								required
								id="companyName"
								label="Company Name"
								variant="outlined"
								size="small"
								value={fields.companyName}
								onChange={handleTextFieldChange}
							/>
							<FormHelperText id="my-helper-text">As it appears in Salesforce</FormHelperText>
						</FormControl>
						<FormControl>
							<InputLabel size="small">Data Type</InputLabel>
							<Select
								size="small"
								id="dataType"
								value={fields.dataType}
								label="Data Type"
								onChange={(e) =>
									setFields({
										...fields,
										dataType: e.target.value,
									})
								}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{dataTypes.map((type, i) => (
									<MenuItem value={type} key={i}>
										{type}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>Choose primary data type</FormHelperText>
						</FormControl>
						<LocalizationProvider dateAdapter={DateAdapter}>
							<DateTimePicker
								required
								size="small"
								id="meetingDateTime"
								label="Date and Time Picker"
								value={fields.meetingDateTime}
								onChange={(date) =>
									setFields({
										...fields,
										meetingDateTime: date,
									})
								}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
						<FormControl>
							<InputLabel size="small">Opp Owner</InputLabel>
							<Select
								required
								size="small"
								id="oppOwner"
								value={fields.oppOwner}
								label="Data Type"
								onChange={(e) =>
									setFields({
										...fields,
										oppOwner: e.target.value,
									})
								}
							>
								{opptyOwners.map((owner, i) => (
									<MenuItem value={owner} key={i}>
										{owner}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>Choose Oppty Owner</FormHelperText>
						</FormControl>
					</div>
					<FormLabel className="FormLabel">SDR Context</FormLabel>
					<FormControl>
						<TextField
							required
							id="context"
							value={fields.context}
							onChange={handleTextFieldChange}
							size="small"
							maxRows={3}
							multiline
						/>
					</FormControl>
					<Button variant="outlined" color="success" style={{ marginTop: "10px" }} type="submit">
						Submit
					</Button>
				</form>
			</div>
		</ThemeProvider>
	);
}

export default App;
