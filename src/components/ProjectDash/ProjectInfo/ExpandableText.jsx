import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ExpandableText = (props) => {
	const {
		id,
		label,
		menuItems,
		labelItems,
		itemIDs,
		itemNames,
		onChange,
		value,
	} = props;
	const [anchorEl, setAnchorEl] = useState(null);
	const [additionalInfo, setAdditionalInfo] = useState("");

	const handleExpandClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<TextField
				id={id}
				label={label}
				value={value}
				variant="outlined"
				fullWidth={true}
				size="small"
				margin="dense"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton edge="end" onClick={handleExpandClick}>
								<ExpandMoreIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				{menuItems.map((index, item) => (
					<MenuItem>
						<TextField
							id={itemIDs[item]}
							label={labelItems[item]}
							value={`${index}`}
							name={itemNames[item]}
							variant="outlined"
							size="small"
							onChange={onChange}
						/>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default ExpandableText;
