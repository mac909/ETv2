import React, { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { API, graphqlOperation } from "aws-amplify";
import { createProjectManagerNotes } from "../../../graphql/mutations";

const AddNoteModal = ({ open, handleClose }) => {
	const [comment, setComment] = useState("");

	const wbsId = sessionStorage.getItem("selectedProjectID");

	const handleCommentChange = (event) => {
		setComment(event.target.value);
	};

	const convertToExcelDate = (date) => {
		const dateObj = new Date(date);
		const excelDate = Math.floor(
			(dateObj.getTime() - new Date("1899-12-30").getTime()) /
				(1000 * 60 * 60 * 24)
		);
		return excelDate;
	};

	const handleSubmit = async () => {
		try {
			const input = {
				WBSID: wbsId,
				Comment: comment,
				Date: convertToExcelDate(new Date()),
				User: "MTM",
				Category: "PM Note",
			};
			await API.graphql(
				graphqlOperation(createProjectManagerNotes, { input })
			);
			handleClose();
		} catch (error) {
			console.log("error creating PM note:", error);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth>
			<DialogTitle>Add PM Note</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Comment"
					type="text"
					fullWidth
					multiline
					rows={4}
					value={comment}
					onChange={handleCommentChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary">
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddNoteModal;
