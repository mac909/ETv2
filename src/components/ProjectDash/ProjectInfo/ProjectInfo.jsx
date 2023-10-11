import React, { useEffect, useState } from "react";
import {
	Paper,
	TextField,
	Grid,
	Typography,
	InputAdornment,
	IconButton,
	Menu,
	MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import ExpandableText from "./ExpandableText";
import { API, graphqlOperation } from "aws-amplify";
import { getProject } from "../../../graphql/queries";

const ProjectInfo = () => {
	const navigate = useNavigate();
	const id = sessionStorage.getItem("selectedProjectID");
	const [selectedProjectID, setSelectProjectID] = useState({});

	const fetchProjectData = async () => {
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

	// const changeProject = (id) => {
	// 	return () => {
	// 		sessionStorage.setItem("selectedProjectID", id);
	// 		setSelectProjectID(id);
	// 		// fetchProjectData({ id });
	// 	};
	// };

	const goToTransactions = (id) => {
		return () => navigate("/transaction/" + id, { replace: true });
	};

	const goToCommitment = (id) => {
		return () => navigate("/commitment/" + id, { replace: true });
	};

	useEffect(() => {
		fetchProjectData({ id });
	}, [id]);

	return (
		// <Typography variant="body1" component="div" align="center" gutterBottom>
		<Paper elevation={8} sx={{ padding: "1rem" }}>
			{/* <br style={{ borderBottom: "1px solid black" }} /> */}

			<Grid container>
				<TextField
					id="project-manager"
					label="Project Manager"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 45 }}
					margin="dense"
					value={`${
						selectedProjectID?.PersonResponsibleName || "NA"
					}`}
				/>
				<TextField
					id="cost-analyst"
					label="Cost Analyst"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.Analyst || "NA"}`}
				/>
				<TextField
					id="division-district"
					label="Division/District"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.DistrictDivision || "NA"}`}
				/>
				<ExpandableText
					id="area"
					label="Area"
					value={selectedProjectID?.Area || "NA"}
					menuItems={[
						selectedProjectID?.OpsVP || "NA",
						selectedProjectID?.OpsDirector || "NA",
						selectedProjectID?.OpsManager || "NA",
						selectedProjectID?.LinePatrol || "NA",
					]}
					labelItems={[
						"Ops VP",
						"Ops Director",
						"Ops Manager",
						"Line Patrol",
					]}
					itemIDs={[
						"OpsVP",
						"OpsDirector",
						"OpsManager",
						"LinePatrol",
					]}
				/>
				<ExpandableText
					label="Cost Center"
					value={selectedProjectID?.CostCenter || "NA"}
					menuItems={[
						selectedProjectID?.ProfitCenter || "NA",
						selectedProjectID?.MAOP || "NA",
						selectedProjectID?.Product || "NA",
						selectedProjectID?.TaxJurisdiction || "NA",
					]}
					labelItems={[
						"Profit Center",
						"MAOP",
						"Product",
						"Tax Jurisdiction",
					]}
					itemIDs={[
						"ProfitCenter",
						"MAOP",
						"Product",
						"TaxJurisdiction",
					]}
				/>
				<TextField
					id="client"
					label="Client"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.Client || "NA"}`}
				/>
				<TextField
					id="reimbursement-percentage"
					label="Reimbursement %"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${
						selectedProjectID?.ReimbursementPercentage || "NA"
					}`}
				/>
				<TextField
					id="overhead-percentage"
					label="Overhead %"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.OverheadPercentage || "NA"}`}
				/>
				<TextField
					id="current-approved-budget"
					label="Current Approved Budget"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.ApprovedGrossBudget || "NA"}`}
				/>
				<TextField
					id="actual-cost-to-date"
					label="Actual Cost to Date"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.Actuals || "NA"}`}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onClick={goToTransactions(
										selectedProjectID?.id
									)}
								>
									<KeyboardArrowRightIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<TextField
					id="remaining-budget"
					label="Remaining Budget"
					variant="outlined"
					// error={true}
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.CurrentForecast || "NA"}`}
				/>
				<TextField
					id="current-commitment"
					label="Current Commitment"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.DirectCosts || "NA"}`}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onClick={goToCommitment(
										selectedProjectID?.id
									)}
								>
									<KeyboardArrowRightIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<TextField
					id="current-forecast"
					label="Current Forecast"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.CurrentForecast || "NA"}`}
				/>
				<ExpandableText
					label="TM1 Reference"
					value={selectedProjectID?.TM1Reference || "NA"}
					menuItems={[
						selectedProjectID?.TM1InitialDate || "NA",
						selectedProjectID?.TM1CurrentDate || "NA",
						selectedProjectID?.TM1CurrentAmount || "NA",
						selectedProjectID?.TM1NetAmount || "NA",
					]}
					labelItems={[
						"TM1 Initial Date",
						"TM1 Current Date",
						"TM1 Current Amount",
						"TM1 Net Amount",
					]}
					itemIDs={[
						"TM1InitialDate",
						"TM1CurrentDate",
						"TM1CurrentAmount",
						"TM1NetAmount",
					]}
				/>
				<TextField
					id="related-wbs-count"
					label="Related WBS Count"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					// value={`${"C-22014-GL-21400087"}`}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									// onClick={changeProject(
									// 	"ccacbf43-4347-4630-b62c-a89293d89c3f"
									// )}
								>
									<ExpandMoreIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<TextField
					id="project-cost-savings"
					label="Project Cost Savings"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					// value={`${
					// 	selectedProjectID?.ProjectNumber || "NA"
					// }`}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end">
									<KeyboardArrowRightIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Grid>
		</Paper>
		// </Typography>
	);
};

export default ProjectInfo;
