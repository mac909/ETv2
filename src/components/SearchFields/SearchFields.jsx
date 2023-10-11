import React, { useRef } from "react";
import { Paper, Typography, TextField, Grid } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchFields = () => {
	const fieldSearchRef = useRef(null);
	const componentRef = useRef(null);

	const handleFieldSearchClick = () => {
		const element = document.getElementById(fieldSearchRef.current.value);
		console.log("element", element);
		if (element) {
			element.focus();
		}
	};

	return (
		<Typography variant="body1" component="div" align="center" gutterBottom>
			<Paper elevation={8} sx={{ padding: "1rem" }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							id="fileSearch"
							label="Search Files"
							variant="outlined"
							fullWidth={true}
							size="small"
							helperText="Where do I file......?"
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
					<Grid item xs={12}>
						<TextField
							id="fieldSearch"
							label="Search Fields"
							variant="outlined"
							fullWidth={true}
							size="small"
							inputRef={fieldSearchRef}
							helperText="Where do I find......?"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={handleFieldSearchClick}
										>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Paper>
		</Typography>
	);
};

export default SearchFields;
