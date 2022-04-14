import { Checkbox, FormControl, FormHelperText, TextField, FormGroup } from "@mui/material";

const ExtAttendee = ({ attendeeFields, handleExtAttChange, handleCheckBoxChange, index }) => (
	<div className="section">
		<FormControl>
			<TextField
				id={`name-${index}`}
				label="First Last"
				variant="outlined"
				size="small"
				value={attendeeFields.name}
				onChange={handleExtAttChange}
				required
			/>
			<FormHelperText id="my-helper-text">Full Name</FormHelperText>
		</FormControl>
		<FormControl>
			<TextField
				id={`email-${index}`}
				label="Email"
				variant="outlined"
				size="small"
				value={attendeeFields.email}
				onChange={handleExtAttChange}
				required
			/>
			<FormHelperText id="my-helper-text">Email</FormHelperText>
		</FormControl>
		<FormControl>
			<TextField
				id={`role-${index}`}
				label="Role"
				variant="outlined"
				size="small"
				value={attendeeFields.role}
				onChange={handleExtAttChange}
				required
			/>
			<FormHelperText id="my-helper-text">Role</FormHelperText>
		</FormControl>
		<FormGroup>
			<Checkbox
				id={`${index}`}
				checked={attendeeFields.primaryContact}
				onChange={handleCheckBoxChange}
			/>
			<FormHelperText id="my-helper-text" sx={{ mt: "0px" }}>
				Primary
			</FormHelperText>
		</FormGroup>
	</div>
);

export default ExtAttendee;
