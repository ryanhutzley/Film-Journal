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
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/lab";
import { ReactComponent as Logo } from "../images/ri_logo.svg";
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
	"Alie Fordyce",
];

const today = DateTime.now();

function MeetingForm({ setUnauthorized, unauthorized }) {
	const [fields, setFields] = useState({
		booker: "",
		externalAttendees: [
			{
				name: "",
				email: "",
				role: "",
				primaryContact: false,
			},
		],
		internalAttendees: [allIntAttendees[0].name],
		companyName: "",
		dataType: "",
		meetingDateTime: today,
		oppOwner: "",
		context: "You will be meeting with...",
	});
	const [errors, setErrors] = useState({});

	const nameAndRole = fields.externalAttendees.map((att) => `${att.name}, ${att.role}`);

	useEffect(() => {
		formatAttendees(fields.externalAttendees, fields.companyName);
	}, [fields.companyName, fields.externalAttendees.length, JSON.stringify(nameAndRole)]);

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
		const value = e.target.value;
		const fieldName = e.target.id;
		setFields({
			...fields,
			[fieldName]: value,
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
		const index = id;
		const formValues = { ...fields };
		const targetAttendee = formValues.externalAttendees[index];
		targetAttendee.primaryContact = checked;
		if (errors?.primaryContact) {
			const errorsCopy = { ...errors };
			delete errorsCopy.primaryContact;
			setErrors(errorsCopy);
		}
		setFields(formValues);
	}

	function handleAdd() {
		const values = { ...fields };
		values.externalAttendees.push({
			name: "",
			email: "",
			role: "",
			primaryContact: false,
		});
		setFields(values);
	}

	function handleDateTimeChange(date) {
		if (errors?.meetingDateTime) {
			const errorsCopy = { ...errors };
			delete errorsCopy.meetingDateTime;
			setErrors(errorsCopy);
		}
		setFields({
			...fields,
			meetingDateTime: date,
		});
	}

	function handleRemove(i) {
		const values = { ...fields };
		values.externalAttendees.splice(i, 1);
		setFields(values);
	}

	function handleSubmit(e) {
		e.preventDefault();
		const formValues = { ...fields };
		const attendees = fields.externalAttendees;
		const errorObj = {};
		let canSubmit = true;

		const primaryContacts = attendees.filter((att) => att.primaryContact === true);

		if (primaryContacts.length === 0 || primaryContacts.length !== 1) {
			errorObj.primaryContact = true;
			canSubmit = false;
		}

		if (formValues.meetingDateTime <= today) {
			errorObj.meetingDateTime = true;
			canSubmit = false;
		}

		canSubmit ? submit(fields) : setErrors(errorObj);
	}

	async function submit(formData) {
		const res = await fetch("/user/book", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		const data = await res.json();
		if (res.status === 401) {
			setUnauthorized(!unauthorized);
		}
	}

	async function logOut() {
		const res = await fetch("/logout");
		const data = await res.json();
		if (res.ok) {
			setUnauthorized(!unauthorized);
			window.scrollTo(0, 0);
		}
	}

	const isRemoveDisplayed = fields.externalAttendees.length >= 2 ? true : false;

	return (
		<div className="form-page">
			<div className="form-container">
				<div className="title">
					<Logo style={{ marginRight: "20px" }} />
					<h2>RI Meeting Booker</h2>
				</div>
				<form onSubmit={handleSubmit}>
					<FormControl>
						<InputLabel size="small">Booker</InputLabel>
						<Select
							required
							size="small"
							id="booker"
							value={fields.booker}
							label="Booker"
							onChange={(e) =>
								setFields({
									...fields,
									booker: e.target.value,
								})
							}
						>
							{opptyOwners.map((owner, i) => (
								<MenuItem value={owner} key={i}>
									{owner}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormLabel className="FormLabel">External Attendee</FormLabel>
					{fields.externalAttendees.map((attendee, idx) => {
						return (
							<ExtAttendee
								attendeeFields={attendee}
								key={idx.toString()}
								handleExtAttChange={handleExtAttChange}
								handleCheckBoxChange={handleCheckBoxChange}
								index={idx.toString()}
								errors={errors}
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
								onChange={(date) => handleDateTimeChange(date)}
								renderInput={(params) => (
									<TextField
										{...params}
										error={errors?.meetingDateTime}
										helperText={
											errors?.meetingDateTime ? "Meeting date must be in the future" : null
										}
									/>
								)}
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
			<Button variant="outlined" color="error" style={{ marginTop: "30px" }} onClick={logOut}>
				Log Out
			</Button>
		</div>
	);
}

export default MeetingForm;
