import React, { useEffect, useState } from "react";
import {
	Container,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	ListItem,
	ListItemIcon,
	ListItemText,
	List,
	CssBaseline,
	ListItemButton,
	TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

import { Storage } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";

import { getProject } from "../../graphql/queries";

const folderData = [
	{
		name: "010 - CORRESPONDENCE",
	},
	{
		name: "020 - AGREEMENT",
		subfolders: [
			{
				name: "Nora",
			},
			{
				name: "Ra",
			},
		],
	},
	{
		name: "030 - ENGINEERING",
		subfolders: [
			{
				name: "Cost Estimate",
			},
			{
				name: "Drawings",
			},
			{
				name: "Scope of Work",
			},
			{
				name: "Cost Comparison",
			},
			{
				name: "KMZ Centerline One Call",
			},
		],
	},
	{
		name: "040 - SURVEY",
		subfolders: [
			{
				name: "Drawings",
			},
		],
	},
	{
		name: "050 - ENVIRONMENTAL",
	},
	{
		name: "060 - WBS",
		subfolders: [
			{
				name: "Initial",
			},
			{
				name: "Supplemental",
			},
		],
	},
	{
		name: "070 - ROW",
		subfolders: [
			{
				name: "Easement",
			},
			{
				name: "Line List",
			},
			{
				name: "Tws",
			},
			{
				name: "Permit",
			},
			{
				name: "QuitClaim Dwg",
			},
		],
	},
	{
		name: "080 - MATERIAL",
		subfolders: [
			{
				name: "Material List",
			},
			{
				name: "Bid Tab",
			},
			{
				name: "Purchase Order",
			},
		],
	},
	{
		name: "090 - VENDOR AGREEMENTS",
		subfolders: [
			{
				name: "Proposal",
			},
			{
				name: "Change Order",
			},
			{
				name: "Work Offer",
			},
		],
	},
	{
		name: "100 - CONSTRUCTION AGREEMENTS",
		subfolders: [
			{
				name: "GSMA - V-Force Verification",
			},
			{
				name: "Bids",
			},
			{
				name: "Bid Tab",
			},
			{
				name: "Award",
			},
			{
				name: "Work Offer",
			},
			{
				name: "Change Order",
			},
		],
	},
	{
		name: "110 - INSPECTION",
		subfolders: [
			{
				name: "Oq",
			},
			{
				name: "Feild Reports",
			},
		],
	},
	{
		name: "120 - INVOICES",
		subfolders: [
			{
				name: "Open Text",
			},
			{
				name: "WO Time - Invoice",
			},
		],
	},
	{
		name: "130 - COMPLETION REPORT",
	},
	{
		name: "140 - PULSE SYNC",
	},
	{
		name: "150 - REIMBURSABLE PARTY",
		subfolders: [
			{
				name: "Accounting",
			},
			{
				name: "Deliverables",
			},
		],
	},
	{
		name: "200 - PROJECT MANAGER",
		subfolders: [
			{
				name: "Temporary",
			},
		],
	},
];

const FolderStructure = () => {
	const id = sessionStorage.selectedProjectID;
	const [wbs, setWbs] = useState(null);
	const [documents, setDocuments] = useState([]);

	const fetchWBSId = () => {
		API.graphql(graphqlOperation(getProject, { id: id }))
			.then((res) => {
				setWbs(res.data.getProject.WBSElement);
				console.log(res.data.getProject.WBSElement);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchDocuments = () => {
		Storage.list(`${id}`)
			.then((result) => {
				console.log(result);
				const documents = result.results.map((doc) => {
					const keyParts = doc.key.split("/");
					const subfolderName = keyParts[keyParts.length - 2];
					const folderName = keyParts[keyParts.length - 3];
					return {
						name: keyParts[keyParts.length - 1],
						folderName,
						subfolderName,
						key: doc.key,
					};
				});
				setDocuments(documents);
				console.log(documents);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleOnDrop = async (e, folderName, subfolderName) => {
		e.preventDefault();
		const selectedFile = e.dataTransfer.files[0];
		if (selectedFile) {
			const fileExtention = selectedFile.name.split(".")[1];
			const fileName = selectedFile.name.split(".")[0];
			try {
				await Storage.put(
					`${id}/${wbs}/${folderName}/${subfolderName}/${fileName}.${fileExtention}`,
					selectedFile,
					{
						contentType: selectedFile.type,
					}
				).then((result) => {
					console.log(result);
					fetchDocuments();
				});
			} catch {
				console.error();
			}
		}
	};

	const handleOnclick = async (key) => {
		try {
			const data = await Storage.get(key);
			window.open(data, "_blank");
		} catch (error) {
			console.log("error on fetching documents", error);
		}
	};

	useEffect(() => {
		fetchWBSId();
		fetchDocuments();
	}, []);

	return (
		<Container>
			<CssBaseline />

			{folderData.map((folder, index) => (
				<Accordion
					key={index}
					sx={{
						boxShadow: "none", // Remove the shadow effect
						"&:before": {
							display: "none", // Remove the bullet
						},
					}}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<ListItemIcon>
							<FolderIcon />
						</ListItemIcon>
						<Typography>{folder.name}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<List>
							{folder.documents &&
								folder.documents.map((document, docIndex) => (
									<ListItem key={docIndex}>
										<ListItemIcon>
											<DescriptionIcon />
										</ListItemIcon>
										<ListItemText primary={document} />
									</ListItem>
								))}
							{folder.subfolders &&
								folder.subfolders.map((subfolder, subIndex) => (
									<Accordion
										key={subIndex}
										sx={{
											boxShadow: "none", // Remove the shadow effect
											"&:before": {
												display: "none", // Remove the bullet
											},
										}}
									>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<ListItemIcon>
												<FolderIcon />
											</ListItemIcon>
											<Typography>
												{subfolder.name}
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<List>
												{documents
													.filter(
														(doc) =>
															doc.subfolderName ===
															subfolder.name
													)
													.map(
														(
															document,
															docIndex
														) => (
															<ListItemButton
																key={
																	document.key
																}
																onClick={() =>
																	handleOnclick(
																		document.key
																	)
																}
															>
																<ListItemIcon>
																	<DescriptionIcon />
																</ListItemIcon>
																<ListItemText
																	primary={
																		document.name
																	}
																/>
															</ListItemButton>
														)
													)}
											</List>
											<div
												onDragOver={(e) =>
													e.preventDefault()
												}
												onDrop={(e) => {
													handleOnDrop(
														e,
														folder.name,
														subfolder.name
													);
												}}
												style={{
													width: "100%",
													height: "50px",
													border: "1px dashed gray",
													marginTop: "10px",
													textAlign: "center",
												}}
											>
												Drag and Drop File Here
											</div>
										</AccordionDetails>
									</Accordion>
								))}
						</List>
					</AccordionDetails>
				</Accordion>
			))}
		</Container>
	);
};

export default FolderStructure;
