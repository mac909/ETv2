import {
	Checkbox,
	Typography,
	Paper,
	Modal,
	Box,
	TextField,
	Button,
} from "@mui/material";
import MobileDatePickerComponent from "./MobileDatePickerComp/MobileDatePickerComp";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import { API, graphqlOperation } from "aws-amplify";
import { getProject } from "../../graphql/queries";

import { Storage } from "aws-amplify";

const Milestones = () => {
	const [selectedRow, setSelectedRow] = useState(null);
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState(null);
	const [wbs, setWbs] = useState(null);

	const id = sessionStorage.getItem("selectedProjectID");

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const handleModalClose = () => {
		setOpen(false);
		setSelectedRow(null);
		setFile(null);
	};

	const handleFileUpload = async () => {
		const selectedFile = file;
		if (selectedFile) {
			const fileExtention = selectedFile.name.split(".")[1];
			const fileName = selectedFile.name.split(".")[0];
			try {
				console.log("In the try");
				await Storage.put(
					`${id}/${wbs}/${selectedRow.folderPath}/${fileName}.${fileExtention}`,
					selectedFile,
					{
						contentType: selectedFile.type,
					}
				).then((result) => {
					console.log(result);
					handleModalClose();
				});
			} catch {
				console.error();
			}
		}
	};

	const handleRowClick = (params) => {
		setSelectedRow(params);
		setOpen(true);
	};
	const [rows, setRows] = useState([
		{
			id: 1,
			planDate: "",
			task: "KMZ Centerline One Call",
			isCheckbox: true,
			folderPath: "030 - ENGINEERING/KMZ Centerline One Call",
		},
		{
			id: 2,
			planDate: "",
			task: "V-Force Approved",
			isCheckbox: true,
			folderPath:
				"100 - CONSTRUCTION AGREEMENTS/GSMA - V-Force Verification",
		},
		{
			id: 3,
			planDate: "2022-01-03",
			task: "Contractor Award",
			isCheckbox: true,
			folderPath: "100 - CONSTRUCTION AGREEMENTS/Award",
		},
		{
			id: 4,
			planDate: "",
			task: "Mobilization",
			isCheckbox: false,
			folderPath: "NA",
		},
		{
			id: 5,
			planDate: "",
			task: "In-Service",
			isCheckbox: false,
			folderPath: "130 - COMPLETION REPORTS",
		},
		{
			id: 6,
			planDate: "",
			task: "De-Mobilization",
			isCheckbox: false,
			folderPath: "NA",
		},
		{
			id: 7,
			planDate: "",
			task: "Pulse Transfer",
			isCheckbox: true,
			folderPath: "140 - PULSE SYNC",
		},
		{
			id: 8,
			planDate: "",
			task: "Client Invoice",
			isCheckbox: false,
			folderPath: "150 - REIMBURSABLE PARTY/Accounting",
		},
	]);

	const fetchWBSId = () => {
		API.graphql(graphqlOperation(getProject, { id: id }))
			.then((res) => {
				setWbs(res.data.getProject.WBSElement);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const columns = [
		{
			field: "planDate",
			headerName: "Date / Completed",
			flex: 1.5,
			editable: true,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => {
				const row = params.row;
				if (row.isCheckbox) {
					return (
						<Checkbox
							inputProps={{ "aria-label": "controlled" }}
							onChange={() => {
								handleRowClick(row);
							}}
						/>
					);
				} else {
					return (
						<MobileDatePickerComponent
							value={row.planDate}
							onChange={handleRowClick}
						/>
					);
				}
			},
		},
		{
			field: "task",
			headerName: "Task",
			flex: 1,
			align: "center",
			headerAlign: "center",
		},
	];

	useEffect(() => {
		fetchWBSId();
	}, [id]);

	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Paper elevation={8} sx={{ padding: "1rem" }}>
				<DataGrid
					rows={rows}
					columns={columns}
					hideFooter
					rowHeight={65}
				/>
			</Paper>
			<Modal open={open} onClose={handleModalClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						maxWidth: "80vw",
						maxHeight: "80vh",
						overflow: "auto",
					}}
				>
					<Typography variant="h5" component="h2" gutterBottom>
						Upload File for Task: {selectedRow?.task}
					</Typography>
					<TextField
						type="file"
						onChange={handleFileChange}
						sx={{ mb: 2 }}
					/>
					<Button variant="contained" onClick={handleFileUpload}>
						Submit
					</Button>
				</Box>
			</Modal>
		</Typography>
	);
};

export default Milestones;
