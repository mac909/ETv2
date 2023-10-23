import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

const SaveChangesModal = ({ open, onClose, onSave, onDiscard }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Save Changes?</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You have unsaved changes. Do you want to save them?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onDiscard}>Discard</Button>
				<Button onClick={onSave} variant="contained" color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SaveChangesModal;
