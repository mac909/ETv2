import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "@mui/material";

import { API, graphqlOperation } from "aws-amplify";
import { listTransactions } from "../../graphql/queries";
import { useParams, useNavigate } from "react-router-dom";

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

function ParentComponent() {
	const [selectedRow, setSelectedRow] = useState(null);
	const [rows, setRows] = useState([]);
	const [total, setTotal] = useState(0);
	const [selectedProjectID, setSelectProjectID] = useState({});

	const id = useParams().id;

	const navigate = useNavigate();

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

	const fetchTransactions = async (id) => {
		let allTransactions = [];
		let nextToken = null;

		try {
			do {
				const transactionData = await API.graphql(
					graphqlOperation(listTransactions, {
						filter: { WBSID: { eq: id } },
						nextToken,
					})
				);

				const transactionList =
					transactionData.data.listTransactions.items;
				allTransactions = allTransactions.concat(transactionList);
				nextToken = transactionData.data.listTransactions.nextToken;
			} while (nextToken);

			// Group by CostElement, PurchasingDocument,
			allTransactions = allTransactions.reduce((acc, curr) => {
				const found = acc.find(
					(item) =>
						item.CostElement === curr.CostElement &&
						item.PurchasingDocument === curr.PurchasingDocument
				);
				if (found) {
					found.VblvalueObjcurr += curr.VblvalueObjcurr;
					found.EngineersEstimate += curr.EngineersEstimate;
					found.Committed += curr.Committed;
					found.etc += curr.etc;
					found.eac += curr.eac;
				} else {
					acc.push(curr);
				}

				return acc;
			}, []);
			const total = allTransactions.reduce(
				(acc, curr) => acc + curr.VblvalueObjcurr,
				0
			);
			setTotal(total);
			allTransactions.push({
				id: "total",
				CostElement: "Total",
				VblvalueObjcurr: total,
			});

			setRows(allTransactions);
			console.log("allTransactions", allTransactions);
		} catch (error) {
			console.log("error on fetching transactions", error);
		}
	};

	const columns = [
		{
			field: "CostElement",
			headerName: "GL Code",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
		{
			field: "Costelementname",
			headerName: "Description",
			headerClassName: "table-header",
			flex: 2,
			align: "left",
		},
		{
			field: "VblvalueObjcurr",
			headerName: "Actual",
			headerClassName: "table-header",
			flex: 1,
			align: "center",
			// Use the valueGetter to format the currency
			valueGetter: (params) => formatCurrency(params.value),
			renderCell: (params) => (
				// Render the formatted currency value
				<div>{params.value}</div>
			),
		},
		{
			field: "EngineersEstimate",
			headerName: "Engineers Estimate",
			headerClassName: "table-header",
			flex: 1.5,
			align: "center",
		},
		{
			field: "overUnder",
			headerName: "Over / Under",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
		{
			field: "Committed",
			headerName: "Committed",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
		{
			field: "etc",
			headerName: "ETC",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
		{
			field: "eac",
			headerName: "EAC",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
		{
			field: "notes",
			headerName: "Notes",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
	];

	useEffect(() => {
		fetchProjectData();
		fetchTransactions(id);
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
				<h3>Transaction Report</h3>
				<div>Total Actual: {formatCurrency(total)}</div>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					sx={{ minWidth: 1200, marginTop: "1rem", maxHeight: 500 }}
					onRowClick={(params, event) => {
						setSelectedRow(params.row.id);
					}}
					// onRowClick={onRowClick}
					onRowSelected={(params) => {
						setSelectedRow(params.data.id);
					}}
				/>
				<Button variant="contained" onClick={goHomeClicked}>
					Home
				</Button>
			</Container>
		</Typography>
	);
}

export default ParentComponent;
