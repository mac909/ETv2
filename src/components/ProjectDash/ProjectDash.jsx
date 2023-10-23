import React from "react";
import { Container, Grid, Modal, Button } from "@mui/material";
import ProjectInfo from "./ProjectInfo/ProjectInfo";

import ProjectDetails from "./ProjectDetails/ProjectDetails";
import Milestones from "../Milestones/Milestones";
import SearchFields from "../SearchFields/SearchFields";

import { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getProject } from "../../graphql/queries";
import { updateProject } from "../../graphql/mutations";

import SaveChangesModal from "./SaveChanges/SaveChangesModal";

const ProjectDash = () => {
	const [project, setProject] = useState({});
	const [formData, setFormData] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [changeMade, setChangeMade] = useState(false);
	const id = sessionStorage.getItem("selectedProjectID");

	const fetchProjectData = async () => {
		try {
			const projectData = await API.graphql(
				graphqlOperation(getProject, { id })
			);
			const project = projectData.data.getProject;
			setProject(project);
			setFormData(project);
		} catch (error) {
			console.log("error on fetching projects", error);
		}
	};

	const updateProjectData = async (formData, projectId) => {
		const {
			AR,
			ARAgent,
			ARStatus,
			Area,
			Actuals,
			Analyst,
			ApprovedGrossBudget,
			CostCenter,
			ProfitCenter,
			MAOP,
			Product,
			TaxJurisdiction,
			CurrentForecast,
			DirectCosts,
			IndirectCosts,
			InitialPlan,
			OpenPOCommitments,
			OriginalARAmount,
			PersonResponsible,
			PersonResponsibleName,
			ProjectType,
			SystemStatus,
			TM1Reference,
			TM1InitialDate,
			TM1CurrentDate,
			TM1CurrentAmount,
			TM1NetAmount,
			WBSDescription,
			WBSElement,
			WBSUserStatus,
			WFAgent,
			WorkType,
			ProjectNumber,
			Company,
			DistrictDivision,
			ReimbursementPercentage,
			OverheadPercentage,
			Client,
			Scope,
			Line,
			FilePath,
			OpsVP,
			OpsDirector,
			OpsManager,
			LinePatrol,
			CustomUtilityNumber,
			WBSSAPStatus,
			State,
			County,
			City,
			GPSCoordinates,
			Active,
			Weekly,
			Monthly,
		} = formData;
		try {
			await API.graphql({
				query: updateProject,
				variables: {
					input: {
						AR,
						ARAgent,
						ARStatus,
						Area,
						Actuals,
						Analyst,
						ApprovedGrossBudget,
						CostCenter,
						ProfitCenter,
						MAOP,
						Product,
						TaxJurisdiction,
						CurrentForecast,
						DirectCosts,
						IndirectCosts,
						InitialPlan,
						OpenPOCommitments,
						OriginalARAmount,
						PersonResponsible,
						PersonResponsibleName,
						ProjectType,
						SystemStatus,
						TM1Reference,
						TM1InitialDate,
						TM1CurrentDate,
						TM1CurrentAmount,
						TM1NetAmount,
						WBSDescription,
						WBSElement,
						WBSUserStatus,
						WFAgent,
						WorkType,
						ProjectNumber,
						Company,
						DistrictDivision,
						ReimbursementPercentage,
						OverheadPercentage,
						Client,
						Scope,
						Line,
						FilePath,
						OpsVP,
						OpsDirector,
						OpsManager,
						LinePatrol,
						CustomUtilityNumber,
						WBSSAPStatus,
						State,
						County,
						City,
						GPSCoordinates,
						Active,
						Weekly,
						Monthly,
						id: id,
					},
				},
			});
			console.log("Project data successfully updated");
			return;
		} catch (error) {
			console.error("Error saving project data:", error);
		}
	};

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setChangeMade(true);
		sessionStorage.setItem("changeMade", true);
	};

	const onChangeCheckbox = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.checked });
		setChangeMade(true);
		sessionStorage.setItem("changeMade", true);
	};

	const handleSaveChanges = async () => {
		// replace null formdata with empty string
		for (const [key, value] of Object.entries(formData)) {
			if (value === null) {
				formData[key] = "";
			}
		}
		updateProjectData(formData, id);
		handleCloseModal();
		setChangeMade(false);
		sessionStorage.setItem("changeMade", false);
	};

	const handleDiscardChanges = () => {
		handleCloseModal();
		setFormData(project);
		setChangeMade(false);
		sessionStorage.setItem("changeMade", false);
	};

	useEffect(() => {
		if (changeMade === true) {
			sessionStorage.setItem("selectedProjectID", formData.id);
			handleOpenModal();
		} else {
			fetchProjectData();
		}
	}, [id]);

	return (
		<Grid container spacing={2}>
			<SaveChangesModal
				open={showModal}
				onClose={handleCloseModal}
				onSave={handleSaveChanges}
				onDiscard={handleDiscardChanges}
			/>
			<Grid item lg={2.5}>
				<ProjectInfo project={formData} onChange={onChange} />
			</Grid>
			<Grid item lg={5.5}>
				<ProjectDetails
					project={formData}
					onChange={onChange}
					onChangeCheckbox={onChangeCheckbox}
					onSave={handleSaveChanges}
				/>
			</Grid>
			<Grid item lg={4}>
				<SearchFields />
				<Milestones />
			</Grid>
		</Grid>
	);
};

export default ProjectDash;
