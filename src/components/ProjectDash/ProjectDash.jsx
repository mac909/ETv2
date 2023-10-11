import React from "react";
import { Container, Grid } from "@mui/material";
import ProjectInfo from "./ProjectInfo/ProjectInfo";

import ProjectDetails from "./ProjectDetails/ProjectDetails";
import Milestones from "../Milestones/Milestones";
import SearchFields from "../SearchFields/SearchFields";

const ProjectDash = () => {
	return (
		<Grid container spacing={2}>
			<Grid item lg={2.5}>
				<ProjectInfo />
			</Grid>
			<Grid item lg={5.5}>
				<ProjectDetails />
			</Grid>

			<Grid item lg={4}>
				<SearchFields />
				<Milestones />
			</Grid>
		</Grid>
	);
};

export default ProjectDash;
