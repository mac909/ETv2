import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import { useState } from "react";

import { createProjectManagerNotes } from "../../../graphql/mutations";
import { listProjects } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { Typography, Snackbar, Alert, Container } from "@mui/material";

const ProjectHistoryUpload = () => {
	const [projectData, setProjectData] = useState([]);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("success");
	const [isError, setIsError] = useState(false);

	const cleanHeader = (header) => {
		return header.replace(/\s/g, "").replace(/[^\w\s]/gi, "");
	};

	const importToDatabase = async ({ projectHistory }) => {
		const wbs = projectHistory.WBS;
		const wbs_id = projectData.filter((item) => item.WBSElement === wbs)[0]
			?.id;

		try {
			const projectHistoryData = {
				...projectHistory,
				WBSID: wbs_id ? wbs_id : "No WBS ID Found",
			};

			await API.graphql(
				graphqlOperation(createProjectManagerNotes, {
					input: projectHistoryData,
				})
			);
		} catch (error) {
			console.log("error on creating project history", error);
			setIsError(true);
			setMessage("Error on creating project history");
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
		}
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];

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
				const projectHistoryData = excelJson.slice(1);

				const dataArray = projectHistoryData.map((item) => {
					const rowData = {};
					headers.forEach((header, index) => {
						const cleanedHeader = cleanHeader(header);
						if (item[index] !== undefined) {
							rowData[cleanedHeader] = item[index];
						} else {
							rowData[cleanedHeader] = "";
						}
					});
					return rowData;
				});
				dataArray.forEach((projectHistory) => {
					importToDatabase({ projectHistory });
				});
			};

			reader.readAsArrayBuffer(file);
			if (isError) {
				setMessage("Error on importing project history");
				setSeverity("error");
				setOpen(true);
			}
			setTimeout(() => {
				setMessage("");
				setSeverity("success");
				setOpen(false);
				e.target.value = null;
			}, 6000);
		}
	};

	useEffect(() => {
		fetchWBSList();
	}, []);

	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Container>
				<h2>Import PM Notes (.xlsx or .xls file)</h2>
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

export default ProjectHistoryUpload;
