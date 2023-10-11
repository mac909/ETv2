import React from "react";
import Upload from "../upload/Upload";
import DeficencyReport from "./DeficencyReport/DeficencyReport";
import CommitmentUpload from "./CommitmentUpload/CommitmentUpload";
import TransactionUpload from "./TransactionUpload/TransactionUpload";
import ProjectHistoryUpload from "./ProjectHistoryUpload/ProjectHistoryUpload";
import { Divider, Paper, Typography } from "@mui/material";

const UploadImport = () => {
	return (
		<Typography variant="body1">
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<Upload />
			</Paper>
			<Divider />
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<CommitmentUpload />
			</Paper>
			<Divider />
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<TransactionUpload />
			</Paper>
			<Divider />
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<ProjectHistoryUpload />
			</Paper>
			<Paper elevation={8} style={{ padding: "1rem" }}>
				<DeficencyReport />
			</Paper>
		</Typography>
	);
};

export default UploadImport;
