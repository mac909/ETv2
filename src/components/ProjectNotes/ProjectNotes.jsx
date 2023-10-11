import React from "react";

import { useState, useEffect } from "react";

import { API, graphqlOperation } from "aws-amplify";

import { listProjects } from "../../graphql/queries";
import { listProjectManagerNotes } from "../../graphql/queries";

import AddNoteModal from "./PMNoteModal/AddNoteModal";

import SearchIcon from "@mui/icons-material/Search";

import {
	Box,
	Grid,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	TableContainer,
	TablePagination,
	Typography,
	Button,
	IconButton,
	InputAdornment,
	CircularProgress,
} from "@mui/material";

const ProjectNotes = () => {
	const [projects, setProjects] = useState([]);
	const [tableHeight, setTableHeight] = useState(268);
	const [allProjects, setAllProjects] = useState([]);
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const showMore = sessionStorage.getItem("showMore");
	const id = sessionStorage.getItem("selectedProjectID");

	const data = [
		{
			id: 1,
			initials: "JH",
			dateCreated: "10/10/2021",
			category: "Project",
			comment: "This is a test comment",
		},
	];

	const handleAddNoteClick = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const convertExcelDate = (serial) => {
		const date = new Date(
			(serial - 1) * 24 * 60 * 60 * 1000 +
				new Date("1900-01-01").getTime()
		);
		return date.toLocaleDateString();
	};

	const fetchProjectNotes = async (id) => {
		let allProjectNotes = [];
		let nextToken = null;

		try {
			do {
				const projectNotesData = await API.graphql(
					graphqlOperation(listProjectManagerNotes, {
						filter: { WBSID: { eq: id } },
						nextToken,
					})
				);

				const projectNotesList =
					projectNotesData.data.listProjectManagerNotes.items;
				allProjectNotes = allProjectNotes.concat(projectNotesList);
				nextToken =
					projectNotesData.data.listProjectManagerNotes.nextToken;
			} while (nextToken);
			allProjectNotes.sort((a, b) => new Date(b.Date) - new Date(a.Date));
			setAllProjects(allProjectNotes);
		} catch (error) {
			console.log("error on fetching project notes", error);
		}
	};

	const getProjects = async () => {
		let allProjects = [];
		let nextToken = null;
		setIsLoading(true);
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
			setTimeout(() => {
				setIsLoading(false);
			}, 2500);
		} catch (error) {
			console.log("error on fetching projects", error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (showMore === "true") {
			setTableHeight(268);
		} else {
			setTableHeight(493);
		}
	}, [showMore]);

	useEffect(() => {
		getProjects();
		fetchProjectNotes(id);
	}, [id, open]);

	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Grid container>
				<h3>Project Notes</h3>
				<Grid container spacing={1} mb={2}>
					<Grid item flex={0.75}>
						<Button
							variant="contained"
							onClick={handleAddNoteClick}
						>
							PM Note
						</Button>
						<AddNoteModal open={open} handleClose={handleClose} />
					</Grid>
					<Grid item flex={1}>
						<Button variant="contained">Add Report</Button>
					</Grid>
					<Grid item flex={3}>
						<TextField
							id="noteSearch"
							label="Search Notes"
							variant="outlined"
							fullWidth={true}
							size="small"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
				<Grid item sx={{ margin: "auto" }}>
					{isLoading ? (
						<CircularProgress sx={{ display: "flex" }} />
					) : allProjects.length === 0 ? (
						<Typography variant="body1">No items found.</Typography>
					) : (
						<TableContainer
							component={Paper}
							style={{
								maxHeight: `${tableHeight}px`,
								overflowY: "auto",
							}}
						>
							<Table aria-label="User Table">
								<TableBody>
									{allProjects.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{row.User}</TableCell>
											<TableCell width={125}>
												{convertExcelDate(row.Date)}
											</TableCell>
											<TableCell>
												{row.Category}
											</TableCell>
											<TableCell>{row.Comment}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Grid>
			</Grid>
		</Typography>
	);
};

export default ProjectNotes;
