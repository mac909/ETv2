import React, { useEffect, useState } from "react";
import {
	Paper,
	Grid,
	Typography,
	TextField,
	Button,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from "@mui/material";

import ProjectNotes from "../../ProjectNotes/ProjectNotes";

const ProjectDetails = (props) => {
	const { project, onChange, onChangeCheckbox, onSave } = props;

	const [showMore, setShowMore] = useState(
		sessionStorage.getItem("showMore") === "true"
	);
	const formData = project;

	const toggleShowMore = () => {
		sessionStorage.setItem("showMore", !showMore);
		setShowMore(!showMore);
	};

	return (
		<Typography variant="body1">
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<FormGroup>
					<Grid container>
						<Grid item lg={6}>
							{project?.Active ? (
								<FormControlLabel
									control={<Checkbox checked={true} />}
									label="Active"
									name="Active"
									onChange={onChangeCheckbox}
								/>
							) : (
								<FormControlLabel
									control={<Checkbox checked={false} />}
									label="Active"
									name="Active"
									onChange={onChangeCheckbox}
								/>
							)}
							{project?.Weekly ? (
								<FormControlLabel
									control={<Checkbox checked={true} />}
									label="Weekly"
									name="Weekly"
									onChange={onChangeCheckbox}
								/>
							) : (
								<FormControlLabel
									control={<Checkbox checked={false} />}
									label="Weekly"
									name="Weekly"
									onChange={onChangeCheckbox}
								/>
							)}
							{project?.Monthly ? (
								<FormControlLabel
									control={<Checkbox checked={true} />}
									label="Monthly"
									name="Monthly"
									onChange={onChangeCheckbox}
								/>
							) : (
								<FormControlLabel
									control={<Checkbox checked={true} />}
									label="Monthly"
									name="Monthly"
									onChange={onChangeCheckbox}
								/>
							)}
						</Grid>
						<Grid item lg={6} container justify="flex-end">
							<Button
								variant="contained"
								color="primary"
								onClick={onSave}
							>
								Save
							</Button>
						</Grid>
					</Grid>
				</FormGroup>

				<Grid container spacing={2}>
					<Grid item flex={1}>
						<TextField
							id="project-number"
							label="Project #"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							name="ProjectNumber"
							value={`${formData?.ProjectNumber || ""}`}
							onChange={onChange}
						/>
					</Grid>
					<Grid item flex={2}>
						<TextField
							id="wbs-element"
							label="WBS Element"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${formData?.WBSElement || ""}`}
							name="WBSElement"
							onChange={onChange}
						/>
					</Grid>
					<Grid item flex={1}>
						<TextField
							id="wbs-sap-status"
							label="WBS SAP Status"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${formData?.WBSSAPStatus || ""}`}
							name="WBSSAPStatus"
							onChange={onChange}
						/>
					</Grid>
				</Grid>

				<TextField
					id="wbs-description"
					label="WBS Description"
					variant="outlined"
					fullWidth={true}
					size="small"
					margin="dense"
					value={`${formData?.WBSDescription || ""}`}
					name="WBSDescription"
					onChange={onChange}
				/>
				<TextField
					id="company"
					label="Company"
					variant="outlined"
					fullWidth={true}
					size="small"
					margin="dense"
					value={`${formData?.Client || ""}`}
					name="Client"
					onChange={onChange}
				/>

				{showMore && (
					<div>
						<Grid container spacing={2}>
							<Grid item flex={2}>
								<TextField
									id="customer-utility-number"
									label="Customer Utility Number(s)"
									variant="outlined"
									fullWidth={true}
									size="small"
									inputProps={{ maxLength: 6 }}
									margin="dense"
									value={`${
										formData?.CustomerUtilityNumber || ""
									}`}
									name="CustomerUtilityNumber"
									onChange={onChange}
								/>
							</Grid>
							<Grid item flex={1}>
								<TextField
									id="gps-coordinates"
									label="GPS Coordinates"
									variant="outlined"
									fullWidth={true}
									size="small"
									inputProps={{ maxLength: 6 }}
									margin="dense"
									value={`${formData?.GPSCoordinates || ""}`}
									name="GPSCoordinates"
									onChange={onChange}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item flex={2}>
								<TextField
									maxRows={4}
									id="scope"
									multiline
									label="Scope of Work"
									variant="outlined"
									fullWidth={true}
									size="small"
									margin="dense"
									value={`${formData?.Scope || ""}`}
									name="Scope"
									onChange={onChange}
								/>
							</Grid>
							<Grid item flex={1}>
								<TextField
									maxRows={4}
									id="line"
									multiline
									label="Line(s)"
									variant="outlined"
									fullWidth={true}
									size="small"
									margin="dense"
									value={`${formData?.Line || ""}`}
									name="Line"
									onChange={onChange}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item flex={1}>
								<TextField
									id="state"
									label="State"
									variant="outlined"
									fullWidth={true}
									size="small"
									margin="dense"
									value={`${formData?.State || ""}`}
									name="State"
									onChange={onChange}
								/>
							</Grid>
							<Grid item flex={2}>
								<TextField
									id="county"
									label="County"
									variant="outlined"
									fullWidth={true}
									size="small"
									margin="dense"
									value={`${formData?.County || ""}`}
									name="County"
									onChange={onChange}
								/>
							</Grid>
							<Grid item flex={2}>
								<TextField
									id="city"
									label="City"
									variant="outlined"
									fullWidth={true}
									size="small"
									margin="dense"
									value={`${formData?.City || ""}`}
									name="City"
									onChange={onChange}
								/>
							</Grid>
						</Grid>
					</div>
				)}
				<Button onClick={toggleShowMore} sx={{ paddingBottom: "0" }}>
					{showMore ? "Show Less" : "Show More"}
				</Button>
				<ProjectNotes />
			</Paper>
		</Typography>
	);
};

export default ProjectDetails;
