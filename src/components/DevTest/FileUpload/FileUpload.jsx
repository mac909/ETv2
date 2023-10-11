import { useEffect, useState } from "react";
import {
	Typography,
	Container,
	Button,
	Modal,
	Box,
	List,
	ListItemIcon,
	ListItemText,
	ListItem,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Storage } from "aws-amplify";

const folderStructure = [
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
				name: "GSMA / V-Force Verification",
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
				name: "WO Time/Invoice",
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

const FileUpload = () => {
	const [files, setFiles] = useState([]);
	const fetchDocuments = async () => {
		try {
			const data = await Storage.list("");
			setFiles(data.results);
		} catch (error) {
			console.log("error on fetching documents", error);
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
		fetchDocuments();
	}, []);

	return (
		<Typography variant="body1">
			<Container>
				{files.map((file) => (
					<Button
						variant="contained"
						key={file.key}
						onClick={() => handleOnclick(file.key)}
					>
						{file.key}
					</Button>
				))}
			</Container>
		</Typography>
	);
};

export default FileUpload;
