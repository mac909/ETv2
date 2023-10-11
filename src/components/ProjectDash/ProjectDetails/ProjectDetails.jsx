import React, { useEffect, useState } from "react";
import {
	Paper,
	Grid,
	Typography,
	TextField,
	Container,
	Button,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from "@mui/material";

import { API, graphqlOperation } from "aws-amplify";
import { getProject } from "../../../graphql/queries";

import ProjectNotes from "../../ProjectNotes/ProjectNotes";

const ProjectDetails = () => {
	const id = sessionStorage.getItem("selectedProjectID");
	const [showMore, setShowMore] = useState(false);
	const [selectedProjectID, setSelectProjectID] = useState({});

	const getProjectData = async () => {
		try {
			const projectData = await API.graphql(
				graphqlOperation(getProject, { id })
			);
			const project = projectData.data.getProject;
			setSelectProjectID(project);
		} catch (error) {
			console.log("error on fetching projects", error);
		}
	};

	const toggleShowMore = () => {
		sessionStorage.setItem("showMore", !showMore);
		setShowMore(!showMore);
	};

	useEffect(() => {
		getProjectData({ id });
	}, [id]);

	return (
		<Typography variant="body1">
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<FormGroup>
					<Grid container>
						<Grid item lg={6}>
							<FormControlLabel
								control={<Checkbox />}
								label="Active"
							/>
							<FormControlLabel
								control={<Checkbox />}
								label="Weekly"
							/>
							<FormControlLabel
								control={<Checkbox />}
								label="Monthly"
							/>
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
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
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
							value={`${selectedProjectID?.WBSElement || "NA"}`}
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
							value={`${selectedProjectID?.WBSSAPStatus || "NA"}`}
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
					value={`${selectedProjectID?.WBSDescription || "NA"}`}
				/>
				<TextField
					id="company"
					label="Company"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.ProjectNumber || "NA"}`}
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
										selectedProjectID?.CustomerUtilityNumber ||
										"NA"
									}`}
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
									value={`${
										selectedProjectID?.GPSCoordinates ||
										"NA"
									}`}
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
									value={`${
										selectedProjectID?.Scope || "NA"
									}`}
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
									value={`${selectedProjectID?.Line || "NA"}`}
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
									value={`${
										selectedProjectID?.State || "NA"
									}`}
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
									value={`${
										selectedProjectID?.County || "NA"
									}`}
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
									value={`${selectedProjectID?.City || "NA"}`}
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
