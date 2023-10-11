import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import { useState } from "react";

import { createCommitment, deleteCommitment } from "../../../graphql/mutations";
import { listCommitments, listProjects } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { Typography, Snackbar, Alert, Container } from "@mui/material";

const CommitmentUpload = () => {
	const [projectData, setProjectData] = useState([]);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("success");
	const [isError, setIsError] = useState(false);

	const cleanHeader = (header) => {
		return header.replace(/\s/g, "").replace(/[^\w\s]/gi, "");
	};

	const importToDatabase = async ({ commitment }) => {
		const wbs = commitment.WBSElement;
		const wbs_id = projectData.filter((item) => item.WBSElement === wbs)[0]
			?.id;

		try {
			const commitmentData = {
				...commitment,
				WBSID: wbs_id ? wbs_id : "No WBS ID Found",
			};

			await API.graphql(
				graphqlOperation(createCommitment, { input: commitmentData })
			);
		} catch (error) {
			console.log("error on creating commitment", error);
			setIsError(true);
			setMessage("Error on creating commitment");
			setSeverity("error");
		}
	};

	const deleteAllCommitments = async () => {
		let allCommitments = [];
		let nextToken = null;

		try {
			do {
				const commitmentData = await API.graphql(
					graphqlOperation(listCommitments, {
						nextToken,
					})
				);

				const commitmentList =
					commitmentData.data.listCommitments.items;
				allCommitments = allCommitments.concat(commitmentList);
				nextToken = commitmentData.data.listCommitments.nextToken;
			} while (nextToken);

			allCommitments.forEach(async (commitment) => {
				await API.graphql(
					graphqlOperation(deleteCommitment, {
						input: { id: commitment.id },
					})
				);
			});
		} catch (error) {
			console.log("error on deleting commitments", error);
			setIsError(true);
			setMessage("Error on deleting commitments");
			setSeverity("error");
		}
	};

	const fetchWBSList = async () => {
		let allProjects = [];
		let nextToken = null;

		try {
			do {
				const projectData = await API.graphql(
					graphqlOperation(listProjects, {
						nextToken,
					})
				);

				const projectList = projectData.data.listProjects.items;
				allProjects = allProjects.concat(projectList);
				nextToken = projectData.data.listProjects.nextToken;
			} while (nextToken);

			setProjectData(allProjects);
		} catch (error) {
			console.log("error on fetching projects", error);
			setIsError(true);
			setMessage("Error on fetching projects");
			setSeverity("error");
		}
	};

	const handleFileUpload = (event) => {
		const numFields = [
			"Actuals",
			"ApprovedGrossBudget",
			"CurrentForecast",
			"DirectCosts",
			"IndirectCosts",
			"InitialPlan",
			"OpenPOCommitments",
			"OriginalARAmount",
			"PersonResponsible",
			"SystemStatus",
			"ReimburesementPercentage",
			"OverheadPercentage",
			"TM1CurrentAmount",
			"TM1NetAmount",
		];
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: "array" });

				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				const excelJson = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
				});

				const headers = excelJson[0];
				const dataRows = excelJson.slice(1);

				const dataArray = dataRows.map((row) => {
					const rowData = {};
					headers.forEach((header, index) => {
						const cleadedHeader = cleanHeader(header);
						if (row[index] !== undefined) {
							rowData[cleadedHeader] = row[index];
						} else {
							if (numFields.includes(cleadedHeader)) {
								rowData[cleadedHeader] = 0;
							} else {
								rowData[cleadedHeader] = "-";
							}
						}
					});
					return rowData;
				});
				deleteAllCommitments().then(() => {
					dataArray.forEach((commitment) => {
						importToDatabase({ commitment });
					});
				});
				return;
			};
			reader.readAsArrayBuffer(file);
			if (!isError) {
				setMessage("Commitments imported successfully");
				setSeverity("success");
				setOpen(true);
			}
			setTimeout(() => {
				event.target.value = null;
			}, 5000);
		}
	};

	useEffect(() => {
		fetchWBSList();
	}, []);

	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Container>
				<h2>Import Commitment Report (.xlsx or .xls file)</h2>
				<input
					accept=".xlsx, .xls"
					id="contained-button-file"
					type="file"
					onChange={handleFileUpload}
				/>
				<Snackbar
					open={open}
					autoHideDuration={6000}
					onClose={() => setOpen(false)}
				>
					<Alert onClose={() => setOpen(false)} severity={severity}>
						{message}
					</Alert>
				</Snackbar>
			</Container>
		</Typography>
	);
};

export default CommitmentUpload;
