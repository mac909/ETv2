import React from "react";
import { Paper, TextField, Grid, Typography } from "@mui/material";

const AgreeSchedule = () => {
	const selectedProjectID = {
		ProjectNumber: "123456",
	};
	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Paper elevation={8} sx={{ padding: "1rem" }}>
				<h3>Project Info</h3>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							id="client"
							label="Client"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="customer-utility-number"
							label="Customer Utility Number(s)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="reimbursement-percentage"
							label="Reimbursement (%)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="overhead-percentage"
							label="Overhead (%)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="current-approved-budget"
							label="Current Approved Budget ($)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="actual-cost-to-date"
							label="Actual Cost to Date ($)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="remaining-budget"
							label="Remaining Budget ($)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="curent-forecast"
							label="Current Forecast ($)"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							id="date-initiated"
							label="Date Initiated"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="reimbursement-agreement"
							label="Reimbursement Agreement"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="bid-date"
							label="Bid Date"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="construction-start"
							label="Construction Start"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="in-service"
							label="In-Service"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="complete"
							label="Complete"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
						<TextField
							id="reimbursement-submit"
							label="Reimbursement Submit"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
					</Grid>
				</Grid>
			</Paper>
		</Typography>
	);
};

export default AgreeSchedule;
