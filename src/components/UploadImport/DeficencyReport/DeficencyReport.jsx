import React from "react";
import { listProjects } from "../../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

import { useState } from "react";

import { Button, Typography, Snackbar, Alert } from "@mui/material";

const DeficencyReport = () => {
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	const fetchWBSdata = async () => {
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

			setData(allProjects);

			createExcelDocument(allProjects);
		} catch (error) {
			console.log("error on fetching projects", error);
		}
	};

	const createExcelDocument = (objs) => {
		const XLSX = require("xlsx");

		if (!Array.isArray(objs) || objs.length === 0) {
			console.log("No valid objects to create the Excel document.");
			return;
		}

		const nullKeys = [];
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet([], { header: nullKeys });

		objs.forEach((obj) => {
			let hasNull = false;
			for (let key in obj) {
				if (obj[key] === null) {
					nullKeys.push(key);
					hasNull = true;
				}
			}

			if (hasNull) {
				// Add the object to the worksheet only if it has null fields
				XLSX.utils.sheet_add_json(worksheet, [obj], {
					skipHeader: true,
				});
			}
		});

		if (nullKeys.length === 0) {
			setMessage("No null fields found in the data.");
			setOpen(true);
			return;
		}

		objs.forEach((obj) => {
			for (let key in obj) {
				if (obj[key] === null && !nullKeys.includes(key)) {
					nullKeys.push(key);
				}
			}
		});

		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

		const date = new Date().toISOString().replace(/:/g, "-");
		const fileName = `excel_${date}.xlsx`;

		XLSX.writeFile(workbook, fileName);
		setMessage(
			"Deficency Report created successfully. Check downloads folder."
		);
		setOpen(true);
	};

	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Button onClick={fetchWBSdata}>Fetch</Button>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity="info"
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
		</Typography>
	);
};

export default DeficencyReport;
