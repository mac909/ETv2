import React, { useEffect } from "react";

import { Storage } from "aws-amplify";

import { Container } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { useState } from "react";

import FolderStructure from "../FolderStructure/FolderStructure";

const FileStructure = () => {
	const [files, setFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);

	// useEffect(() => {
	// 	setSelectedFile(sessionStorage.getItem("selectedProjectID"));
	// 	getFiles();
	// }, [selectedFile]);

	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			const fileExtention = selectedFile.name.split(".")[1];
			const fileName = selectedFile.name.split(".")[0];
			try {
				const { key } = await Storage.put(
					`${sessionStorage.getItem(
						"selectedProjectID"
					)}/${fileName}.${fileExtention}`,
					selectedFile,
					{
						contentType: selectedFile.type,
					}
				).then((result) => {
					console.log(result);
					getFiles();
				});
			} catch {
				console.error();
			}
		}
	};

	const getFiles = async () => {
		try {
			const filesList = await Storage.list("");
			setFiles(filesList.results);
			console.log(filesList.results);
		} catch {
			console.log("error");
		}
	};

	const openFile = async (key) => {
		try {
			const fileUrl = await Storage.get(key);
			window.open(fileUrl, "_blank");
		} catch {
			console.log("error");
		}
	};

	return (
		<Container sx={{ margin: "1rem" }}>
			<FolderStructure />
		</Container>
	);
};

export default FileStructure;
