import { Checkbox, FormControl, FormHelperText, TextField, FormGroup } from "@mui/material";

const ExtAttendee = ({
	attendeeFields,
	handleExtAttChange,
	handleCheckBoxChange,
	index,
	errors,
}) => {
	return (
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
				<FormHelperText id="full-name">Full Name</FormHelperText>
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
				<FormHelperText id="email-from-sf">Email as it appears in Salesforce</FormHelperText>
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
				<FormHelperText id="role">Role</FormHelperText>
			</FormControl>
			<FormGroup>
				<Checkbox
					id={`${index}`}
					checked={attendeeFields.primaryContact}
					onChange={handleCheckBoxChange}
					color={errors?.primaryContact ? "error" : "default"}
				/>
				<FormHelperText id="primary" sx={{ mt: "0px" }} error={errors?.primaryContact}>
					Primary
				</FormHelperText>
			</FormGroup>
		</div>
	);
};

export default ExtAttendee;
