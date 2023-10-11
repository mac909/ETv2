import React, { useState } from "react";
import UserManager from "../UserManager/UserManager";
import KeywordManager from "../KeywordManager/KeywordManager";
import WeeklyCalender from "../WeeklyCalender/WeeklyCalender";
import MonthlyCalender from "../MonthlyCalender/MonthlyCalender";
import UploadImport from "../UploadImport/UploadImport";
import FileUpload from "../DevTest/FileUpload/FileUpload";
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Container,
} from "@mui/material";
import {
	Dashboard as DashboardIcon,
	Assignment,
	AssignmentTurnedIn,
	Settings,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
	const [display, setDisplay] = useState("UserManager");

	const navigate = useNavigate();

	const handleDisplayClick = (componentName) => {
		setDisplay(componentName);
	};

	const handleHomeClick = () => {
		navigate("/");
	};

	return (
		<Container sx={{ height: "100vh" }}>
			<Drawer variant="permanent">
				<List>
					<ListItem
						button
						onClick={() => handleDisplayClick("User Manager")}
					>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary="User Manager" />
					</ListItem>
					<ListItem
						button
						onClick={() => handleDisplayClick("Upload Manager")}
					>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary="Upload Manager" />
					</ListItem>
					<ListItem
						button
						onClick={() => handleDisplayClick("Weekly Calender")}
					>
						<ListItemIcon>
							<Assignment />
						</ListItemIcon>
						<ListItemText primary="Weekly Calender" />
					</ListItem>
					<ListItem
						button
						onClick={() => handleDisplayClick("Monthly Calender")}
					>
						<ListItemIcon>
							<AssignmentTurnedIn />
						</ListItemIcon>
						<ListItemText primary="Monthly Calender" />
					</ListItem>
					<ListItem
						button
						onClick={() => handleDisplayClick("Keyword Manager")}
					>
						<ListItemIcon>
							<Settings />
						</ListItemIcon>
						<ListItemText primary="Keyword Manager" />
					</ListItem>
					<ListItem
						button
						onClick={() => handleDisplayClick("Developer Test")}
					>
						<ListItemIcon>
							<Assignment />
						</ListItemIcon>
						<ListItemText primary="Developer Test" />
					</ListItem>
					<ListItem
						button
						onClick={() => handleHomeClick()}
						style={{ position: "absolute", bottom: -600 }}
					>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItem>
				</List>
			</Drawer>
			{/* Render the selected component based on the 'display' state */}
			{display === "User Manager" && <UserManager />}
			{display === "Upload Manager" && <UploadImport />}
			{display === "Weekly Calender" && <WeeklyCalender />}
			{display === "Monthly Calender" && <MonthlyCalender />}
			{display === "Keyword Manager" && <KeywordManager />}
			{display === "Developer Test" && <FileUpload />}
		</Container>
	);
};

export default AdminDashboard;
