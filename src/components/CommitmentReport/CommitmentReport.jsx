import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { API, graphqlOperation } from "aws-amplify";
import { listCommitments } from "../../graphql/queries";
import { getProject } from "../../graphql/queries";

import {
	FormGroup,
	FormControlLabel,
	Checkbox,
	TextField,
	Grid,
	Typography,
	Paper,
	Button,
} from "@mui/material";

const CommitmentReport = () => {
	const [rows, setRows] = useState([]);
	const [total, setTotal] = useState(0);
	const [selectedProjectID, setSelectProjectID] = useState({});

	const id = useParams().id;

	const navigate = useNavigate();

	// Convert Excel serial Number to Javascript Date
	const convertExcelDate = (serial) => {
		const date = new Date(
			(serial - 1) * 24 * 60 * 60 * 1000 +
				new Date("1900-01-01").getTime()
		);
		return date.toLocaleDateString();
	};

	const formatCurrency = (num) => {
		return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};

	const goHomeClicked = () => {
		navigate("/", { replace: true });
	};

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

	const fetchCommitments = async (id) => {
		let allCommitments = [];
		let nextToken = null;

		try {
			do {
				const commitmentData = await API.graphql(
					graphqlOperation(listCommitments, {
						filter: { WBSID: { eq: id } },
						nextToken,
					})
				);

				const commitmentList =
					commitmentData.data.listCommitments.items;
				allCommitments = allCommitments.concat(commitmentList);
				nextToken = commitmentData.data.listCommitments.nextToken;
			} while (nextToken);
			// Group by GLAccount, PurchasingDocument,
			allCommitments = allCommitments.reduce((acc, curr) => {
				const found = acc.find(
					(item) =>
						item.GLAccount === curr.GLAccount &&
						item.PurchasingDocument === curr.PurchasingDocument
				);
				if (found) {
					found.NetOrderValue += curr.NetOrderValue;
					found.RemainingBalance += curr.RemainingBalance;
				} else {
					acc.push(curr);
				}

				return acc;
			}, []);
			const total = allCommitments.reduce(
				(acc, curr) => acc + curr.NetOrderValue,
				0
			);
			setTotal(total);
			allCommitments.push({
				id: "total",
				GLAccount: "Total",
				NetOrderValue: total,
			});

			setRows(allCommitments);

			console.log("allCommitments", allCommitments);
		} catch (error) {
			console.log("error on fetching commitments", error);
		}
	};

	const columns = [
		{
			field: "GLAccount",
			headerName: "GL Account",
			headerClassName: "table-header",
			flex: 1,
			minWidth: 150,
			align: "left",
		},
		{
			field: "PurchasingDocument",
			headerName: "Work Offer #(WO)",
			headerClassName: "table-header",
			flex: 2,
			align: "left",
		},
		{
			field: "NameofSupplier",
			headerName: "Vendor",
			headerClassName: "table-header",
			flex: 2,
			align: "left",
		},
		{
			field: "NetOrderValue",
			headerName: "Net Value",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
			valueGetter: (params) => formatCurrency(params.value),
			renderCell: (params) => <div>{params.value}</div>,
		},
		{
			field: "RemainingBalance",
			headerName: "Remaining Balance",
			headerClassName: "table-header",
			flex: 1.5,
			align: "center",
		},
		{
			field: "ValidityPerStart",
			headerName: "Start Date",
			headerClassName: "table-header",
			flex: 1,
			align: "center",
			valueGetter: (params) => convertExcelDate(params?.value),
			renderCell: (params) => <div>{params?.value}</div>,
		},
		{
			field: "ValidityPeriodEnd",
			headerName: "Expiration Date",
			headerClassName: "table-header",
			flex: 1,
			align: "center",
			valueGetter: (params) => convertExcelDate(params?.value),
			renderCell: (params) => <div>{params?.value}</div>,
		},
		{
			field: "Notes",
			headerName: "Notes",
			headerClassName: "table-header",
			flex: 1,
			align: "center",
		},
	];

	useEffect(() => {
		fetchCommitments(id);
		fetchProjectData();
		console.log(convertExcelDate(44942));
	}, []);

	return (
		<Typography variant="body1">
			<Paper
				elevation={8}
				style={{ padding: "1rem" }}
				sx={{ maxWidth: 800, margin: "auto" }}
			>
				<FormGroup>
					<Grid container>
						<Grid item lg={6}>
							<FormControlLabel
								control={<Checkbox />}
								label="Active"
							/>
							<FormControlLabel
								control={<Checkbox />}
								label="Weekly"
							/>
							<FormControlLabel
								control={<Checkbox />}
								label="Monthly"
							/>
						</Grid>
					</Grid>
				</FormGroup>

				<Grid container spacing={2}>
					<Grid item flex={1}>
						<TextField
							id="project-number"
							label="Project #"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${
								selectedProjectID?.ProjectNumber || "NA"
							}`}
						/>
					</Grid>
					<Grid item flex={2}>
						<TextField
							id="wbs-element"
							label="WBS Element"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${selectedProjectID?.WBSElement || "NA"}`}
						/>
					</Grid>
					<Grid item flex={1}>
						<TextField
							id="wbs-sap-status"
							label="WBS SAP Status"
							variant="outlined"
							fullWidth={true}
							size="small"
							margin="dense"
							value={`${selectedProjectID?.WBSSAPStatus || "NA"}`}
						/>
					</Grid>
				</Grid>

				<TextField
					id="wbs-description"
					label="WBS Description"
					variant="outlined"
					fullWidth={true}
					size="small"
					margin="dense"
					value={`${selectedProjectID?.WBSDescription || "NA"}`}
				/>
				<TextField
					id="company"
					label="Company"
					variant="outlined"
					fullWidth={true}
					size="small"
					inputProps={{ maxLength: 6 }}
					margin="dense"
					value={`${selectedProjectID?.ProjectNumber || "NA"}`}
				/>
			</Paper>
			<Container>
				<h3>Commitment Report</h3>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
					sx={{ minWidth: 1200, marginTop: "1rem" }}
				/>
				<Button variant="contained" onClick={goHomeClicked}>
					Home
				</Button>
			</Container>
		</Typography>
	);
};

export default CommitmentReport;
