import React, { useEffect, useState } from "react";
import {
	Paper,
	TextField,
	Grid,
	Typography,
	InputAdornment,
	IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import ExpandableText from "./ExpandableText";

const ProjectInfo = (props) => {
	const { project, onChange } = props;
	const navigate = useNavigate();
	const formData = project;

	const goToTransactions = (id) => {
		return () => navigate("/transaction/" + id, { replace: true });
	};

	const goToCommitment = (id) => {
		return () => navigate("/commitment/" + id, { replace: true });
	};

	useEffect(() => {
		console.log("project", formData);
	}, [formData]);

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
					onChange={onChange}
					size="small"
					inputProps={{ maxLength: 45 }}
					margin="dense"
					name="PersonResponsibleName"
					value={`${formData?.PersonResponsibleName || "NA"}`}
				/>
				<TextField
					id="cost-analyst"
					label="Cost Analyst"
					variant="outlined"
					fullWidth={true}
					size="small"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					name="Analyst"
					onChange={onChange}
					value={`${formData?.Analyst || "NA"}`}
				/>
				<TextField
					id="division-district"
					label="Division/District"
					variant="outlined"
					fullWidth={true}
					size="small"
					onChange={onChange}
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					name="DistrictDivision"
					value={`${formData?.DistrictDivision || "NA"}`}
				/>
				<ExpandableText
					id="area"
					label="Area"
					value={formData?.Area || "NA"}
					onChange={onChange}
					menuItems={[
						formData?.OpsVP || "NA",
						formData?.OpsDirector || "NA",
						formData?.OpsManager || "NA",
						formData?.LinePatrol || "NA",
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
					itemNames={[
						"OpsVP",
						"OpsDirector",
						"OpsManager",
						"LinePatrol",
					]}
				/>
				<ExpandableText
					label="Cost Center"
					value={formData?.CostCenter || "NA"}
					onChange={onChange}
					menuItems={[
						formData?.ProfitCenter || "NA",
						formData?.MAOP || "NA",
						formData?.Product || "NA",
						formData?.TaxJurisdiction || "NA",
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
					itemNames={[
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
					name="Client"
					size="small"
					// inputProps={{ maxLength: 6 }}
					onChange={onChange}
					margin="dense"
					value={`${formData?.Client || "NA"}`}
				/>
				<TextField
					id="reimbursement-percentage"
					label="Reimbursement %"
					variant="outlined"
					fullWidth={true}
					size="small"
					name="ReimbursementPercentage"
					onChange={onChange}
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.ReimbursementPercentage || "NA"}`}
				/>
				<TextField
					id="overhead-percentage"
					label="Overhead %"
					variant="outlined"
					fullWidth={true}
					size="small"
					onChange={onChange}
					name="OverheadPercentage"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.OverheadPercentage || "NA"}`}
				/>
				<TextField
					id="current-approved-budget"
					label="Current Approved Budget"
					variant="outlined"
					fullWidth={true}
					size="small"
					onChange={onChange}
					name="ApprovedGrossBudget"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.ApprovedGrossBudget || "NA"}`}
				/>
				<TextField
					id="actual-cost-to-date"
					label="Actual Cost to Date"
					variant="outlined"
					fullWidth={true}
					size="small"
					onChange={onChange}
					name="Actuals"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.Actuals || "NA"}`}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onClick={goToTransactions(formData?.id)}
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
					onChange={onChange}
					name="CurrentForecast"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.CurrentForecast || "NA"}`}
				/>
				<TextField
					id="current-commitment"
					label="Current Commitment"
					variant="outlined"
					fullWidth={true}
					size="small"
					onChange={onChange}
					name="DirectCosts"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.DirectCosts || "NA"}`}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onClick={goToCommitment(formData?.id)}
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
					onChange={onChange}
					name="CurrentForecast"
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${formData?.CurrentForecast || "NA"}`}
				/>
				<ExpandableText
					label="TM1 Reference"
					value={formData?.TM1Reference || "NA"}
					name="TM1Reference"
					onChange={onChange}
					menuItems={[
						formData?.TM1InitialDate || "NA",
						formData?.TM1CurrentDate || "NA",
						formData?.TM1CurrentAmount || "NA",
						formData?.TM1NetAmount || "NA",
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
					itemNames={[
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
					onChange={onChange}
					// inputProps={{ maxLength: 6 }}
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
					onChange={onChange}
					// inputProps={{ maxLength: 6 }}
					margin="dense"
					// value={`${
					// 	project?.ProjectNumber || "NA"
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
