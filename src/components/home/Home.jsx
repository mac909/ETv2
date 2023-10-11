import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectList from "../ProjectList/ProjectList";
import FileStructure from "../FileStructure/FileStructure";
import ProjectDash from "../ProjectDash/ProjectDash";

import { Grid, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FolderIcon from "@mui/icons-material/Folder";
import SideBarProjectList from "../SideBarProjectList/SideBarProjectList";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

const Home = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerOpenLeft, setDrawerOpenLeft] = useState(false);

	const navigate = useNavigate();

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const toggleDrawerLeft = () => {
		setDrawerOpenLeft(!drawerOpenLeft);
	};

	const openAdmin = () => {
		navigate("/admin");
	};

	return (
		<Grid container>
			<Grid item md={0.5}>
				<Drawer
					anchor="left"
					open={drawerOpenLeft}
					onClose={toggleDrawerLeft}
					transitionDuration={{ enter: 300, exit: 200 }}
				>
					<SideBarProjectList />
				</Drawer>
				<IconButton onClick={toggleDrawerLeft}>
					<MenuIcon />
				</IconButton>
				<IconButton>
					<SupervisorAccountIcon onClick={openAdmin} />
				</IconButton>
			</Grid>
			<Grid
				item
				md={11}
				style={{
					width: drawerOpen ? "75%" : "100%",
					transition: "width 0.3s",
				}}
			>
				<ProjectDash />
			</Grid>
			<Grid item md={0.5}>
				<Drawer
					anchor="right"
					open={drawerOpen}
					onClose={toggleDrawer}
					transitionDuration={{ enter: 300, exit: 200 }}
				>
					<FileStructure />
				</Drawer>
				<IconButton onClick={toggleDrawer}>
					<FolderIcon />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Home;
