import { Button, Topography, Tabs, Tab, Box, Grid } from "@mui/material";
import PropTypes from "prop-types";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import React from "react";
import { useNavigate } from "react-router-dom";

const SiteNav = ({ signOut }) => {
	const navigate = useNavigate();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const a11yProps = (index) => {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`,
		};
	};

	return (
		<Grid container spacing={2} mb={2} pt={"5px"}>
			<Grid item xs={8}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example"
					>
						<Tab
							label="Home"
							{...a11yProps(0)}
							onClick={() => {
								navigate("/");
							}}
						/>
						<Tab
							label="Committment Report"
							{...a11yProps(1)}
							onClick={() => {
								navigate("/committment");
							}}
						/>
						<Tab
							label="Transaction Report"
							{...a11yProps(2)}
							onClick={() => {
								navigate("/transaction");
							}}
						/>
						<Tab
							label="Import Data"
							{...a11yProps(3)}
							onClick={() => {
								navigate("/upload");
							}}
						/>
					</Tabs>
				</Box>
			</Grid>
			<Grid item xs={4}>
				<Button variant="contained" onClick={signOut}>
					Sign Out
					<ExitToAppIcon style={{ marginLeft: "2px" }} />
				</Button>
			</Grid>
		</Grid>
	);
};

export default SiteNav;
