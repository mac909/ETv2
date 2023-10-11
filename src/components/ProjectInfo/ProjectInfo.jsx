import React, { useEffect } from "react";

import { Grid, TextField, Container } from "@mui/material";

import { API, graphqlOperation } from "aws-amplify";

import { getProject } from "../../graphql/queries";

import { useState } from "react";

const ProjectInfo = () => {
	const id = sessionStorage.getItem("selectedProjectID");
	const [selectedProjectID, setSelectedProjectID] = useState(null);

	console.log(selectedProjectID);

	const stringNumFormat = (val) => {
		if (parseFloat(val)) {
			return parseFloat(val).toFixed(2);
		} else if (toString(val)) {
			return val;
		}
	};

	const formatCurrency = (val) => {
		if (parseFloat(val)) {
			return val.toLocaleString("en-US", {
				style: "currency",
				currency: "USD",
			});
		} else if (toString(val)) {
			return val;
		}
	};

	const setID = async (id) => {
		try {
			const projectData = await API.graphql(
				graphqlOperation(getProject, { id })
			);
			const project = projectData.data.getProject;
			setSelectedProjectID(project);
			console.log(project);
		} catch (error) {
			console.log("error on fetching projects", error);
		}
	};

	useEffect(() => {
		setID(id);
	}, [id]);

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item flex={2}>
					<TextField
						id="project-number"
						label="Project #"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.ProjectNumber || "NA"}`}
					/>
					<TextField
						id="wbs-element"
						label="WBS Element"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.WBSElement}`}
					/>
					<TextField
						id="project-manager"
						label="Project Manager"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.PersonResponsibleName}`}
					/>
					<TextField
						id="company"
						label="Company"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.Company || "NA"}`}
					/>
					<TextField
						id="area-divison"
						label="Area Division"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.AreaDivision || "NA"}`}
					/>
				</Grid>
				<Grid item flex={1}>
					<TextField
						id="reimbursement-percentage"
						label="Reimbursement %"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={
							stringNumFormat(
								selectedProjectID?.ReimbursementPercentage
							) || "NA"
						}
					/>
					<TextField
						id="cost-anyalst"
						label="Cost Anyalst"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.Analyst || "NA"}`}
					/>
					<TextField
						id="overhead-percentage"
						label="Overhead %"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={
							stringNumFormat(
								selectedProjectID?.OverheadPercentage
							) || "NA"
						}
					/>
					<TextField
						id="client"
						label="Client"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.Client || "NA"}`}
					/>
					<TextField
						id="approved-budget"
						label="Approved Budget"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={
							formatCurrency(
								selectedProjectID?.ApprovedGrossBudget
							) || "NA"
						}
					/>
				</Grid>
				<Grid container sx={{ paddingLeft: "1rem" }}>
					<TextField
						id="wbs-description"
						label="WBS Description"
						variant="outlined"
						fullWidth={true}
						size="small"
						margin="dense"
						value={`${selectedProjectID?.WBSDescription || "NA"}`}
					/>
				</Grid>
				<Grid container spacing={2} sx={{ paddingLeft: "1rem" }}>
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
							value={`${selectedProjectID?.Scope || "NA"}`}
						/>
					</Grid>
					<Grid item flex={1}>
						<TextField
							maxRows={4}
							id="lines"
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
			</Grid>
		</Container>
	);
};

export default ProjectInfo;
