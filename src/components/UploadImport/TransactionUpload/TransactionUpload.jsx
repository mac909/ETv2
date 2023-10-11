import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import { useState } from "react";

import {
	createTransaction,
	deleteTransaction,
} from "../../../graphql/mutations";
import { listTransactions, listProjects } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { Typography, Snackbar, Alert, Container } from "@mui/material";

const TransactionUpload = () => {
	const [projectData, setProjectData] = useState([]);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("success");
	const [isError, setIsError] = useState(false);

	const cleanHeader = (header) => {
		return header.replace(/\s/g, "").replace(/[^\w\s]/gi, "");
	};

	const importToDatabase = async ({ transaction }) => {
		const wbs = transaction.WBSelement;
		const wbs_id = projectData.filter((item) => item.WBSElement === wbs)[0]
			?.id;

		try {
			const transactionData = {
				...transaction,
				WBSID: wbs_id ? wbs_id : "No WBS ID Found",
			};

			await API.graphql(
				graphqlOperation(createTransaction, { input: transactionData })
			);
		} catch (error) {
			console.log("error on creating transaction", error);
			setIsError(true);
			setMessage("Error on creating transaction");
			setSeverity("error");
		}
	};

	const deleteAllTransactions = async () => {
		let allTransactions = [];
		let nextToken = null;

		try {
			do {
				const transactionData = await API.graphql(
					graphqlOperation(listTransactions, {
						nextToken,
					})
				);

				const transactionList =
					transactionData.data.listTransactions.items;
				allTransactions = allTransactions.concat(transactionList);
				nextToken = transactionData.data.listTransactions.nextToken;
			} while (nextToken);

			allTransactions.forEach(async (transaction) => {
				await API.graphql(
					graphqlOperation(deleteTransaction, {
						input: { id: transaction.id },
					})
				);
			});
		} catch (error) {
			console.log("error on deleting transactions", error);
			setIsError(true);
			setMessage("Error on deleting transactions");
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

				deleteAllTransactions().then(() => {
					dataArray.forEach((transaction) => {
						importToDatabase({ transaction });
					});
				});

				return;
			};
			reader.readAsArrayBuffer(file);
			if (!isError) {
				setMessage("Transactions imported successfully");
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
				<h2>Import Transaction Report (.xlsx or .xls file)</h2>
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

export default TransactionUpload;
