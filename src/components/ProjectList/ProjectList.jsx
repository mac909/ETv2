import React from "react";
import { DataGrid } from "@mui/x-data-grid";

import "./ProjectList.css";

import { useState, useEffect } from "react";

import { API, graphqlOperation } from "aws-amplify";

import { listProjects } from "../../graphql/queries";

import { Box, Grid } from "@mui/material";

import ProjectInfo from "../ProjectInfo/ProjectInfo";
import ProjectNotes from "../ProjectNotes/ProjectNotes";
import Milestones from "../Milestones/Milestones";

const ProjectList = () => {
	const [projects, setProjects] = useState([]);
	const [selectedProjectID, setSelectedProjectID] = useState(null);
	const [sortModel, setSortModel] = useState([]);
	const [filterModel, setFilterModel] = useState([
		{ field: "WBSElement", operator: "contains", value: "" },
	]);

	const handleFilterModelChange = (newFilterModel) => {
		// Update the filter model
		setFilterModel(newFilterModel.items);

		if (
			newFilterModel.items.length === 0 ||
			newFilterModel.items.length === undefined
		) {
			setFilterModel([
				{ field: "WBSElement", operator: "contains", value: "" },
			]);
		}

		// Apply filters and get the first row after filtering
		if (newFilterModel.items.length > 0) {
			if (newFilterModel.items[0].value === undefined) {
				setFilterModel([
					{ field: "WBSElement", operator: "contains", value: "" },
				]);
			} else {
				const filteredRows = projects.filter((row) => {
					for (const filter of newFilterModel.items) {
						const field = filter.field;
						const filterValue = filter.value;
						if (
							!row[field]
								.toString()
								.includes(filterValue.toString())
						) {
							return false;
						}
					}
					return true;
				});

				if (filteredRows.length > 0) {
					const firstRow = filteredRows[0];
					const firstRowId = firstRow.id;
					setSelectedProjectID(firstRowId);
					sessionStorage.setItem("selectedProjectID", firstRowId);
				}
			}
		}
	};

	const handleSortModelChange = (newSortModel) => {
		// Update the sort model
		setSortModel(newSortModel);

		if (newSortModel.length === 0) {
			setSelectedProjectID(projects[0]?.id);
			sessionStorage.setItem("selectedProjectID", projects[0]?.id);
			return;
		}

		// Get the first row after sort
		if (newSortModel.length > 0) {
			const sortedRows = [...projects];
			sortedRows.sort((a, b) => {
				const field = newSortModel[0].field;
				const sortDirection = newSortModel[0].sort;

				// Compare non-numeric fields
				if (sortDirection === "asc") {
					return a[field].localeCompare(b[field]);
				} else {
					return b[field].localeCompare(a[field]);
				}
			});
			const firstRow = sortedRows[0];

			// Get the id of the first row
			const firstRowId = firstRow.id;
			setSelectedProjectID(firstRowId);
			sessionStorage.setItem("selectedProjectID", firstRowId);
		}
	};
	const getProjects = async () => {
		let allProjects = [];
		let nextToken = null;

		try {
			do {
				const projectData = await API.graphql(
					graphqlOperation(listProjects, { nextToken })
				);

				const projectList = projectData.data.listProjects.items;
				allProjects = allProjects.concat(projectList);
				nextToken = projectData.data.listProjects.nextToken;
			} while (nextToken);

			setProjects(allProjects);
		} catch (error) {
			console.log("error on fetching projects", error);
		}
	};

	const onRowClick = (params, event) => {
		setSelectedProjectID(params.row.id);
		sessionStorage.setItem("selectedProjectID", params.row.id);
	};

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		setSelectedProjectID(projects[0]?.id);
		sessionStorage.setItem("selectedProjectID", projects[0]?.id);
	}, [projects]);

	const columns = [
		{
			field: "WBSElement",
			headerName: "WBS Element",
			headerClassName: "table-header",
			flex: 1.5,
			minWidth: 150,
			align: "left",
		},
		{
			field: "CostCenter",
			headerName: "Project #",
			headerClassName: "table-header",
			flex: 1,
			align: "left",
		},
		{
			field: "WBSDescription",
			headerName: "Description",
			headerClassName: "table-header",
			flex: 3,
			align: "left",
		},
		{
			field: "PersonResponsibleName",
			headerName: "Project Manager",
			headerClassName: "table-header",
			flex: 2,
			align: "center",
		},
	];

	return (
		<Grid container ml={2}>
			{/* <Grid item md={4.5}> */}
			{/* <Box sx={{ height: "295px", width: "100%" }}>
					<DataGrid
						getRowClassName={(params) =>
							params.indexRelativeToCurrentPage % 2
								? ""
								: "tableRowOdd"
						}
						rows={projects}
						columns={columns}
						sx={{ fontSize: "0.60rem" }}
						onRowClick={onRowClick}
						sortModel={sortModel}
						onSortModelChange={handleSortModelChange}
						filterModel={{ items: filterModel }}
						onFilterModelChange={handleFilterModelChange}
					/>
				</Box> */}
			{/* </Grid> */}
			<Grid item md={9}>
				<ProjectInfo />
				<ProjectNotes />
			</Grid>
			<Grid item md={3}>
				<Milestones />
			</Grid>
		</Grid>
	);
};

export default ProjectList;
