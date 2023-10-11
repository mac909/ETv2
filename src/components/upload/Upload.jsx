import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { createProject, updateProject } from "../../graphql/mutations";
import { listProjects } from "../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

function Upload() {
	const [isImported, setIsImported] = useState(false);
	const [data, setData] = useState([]);

	const cleanHeader = (header) => {
		return header.replace(/\s/g, "").replace(/[^\w\s]/gi, "");
	};

	useEffect(() => {
		fetchWBSdata();
	}, []);

	const fetchWBSdata = async () => {
		let allProjects = [];
		let nextToken = null;

		try {
			do {
				const projectData = await API.graphql(
					graphqlOperation(listProjects, {
						nextToken,
					})
				);

				const projectList = projectData.data.listProjects.items;
				allProjects = allProjects.concat(projectList);
				nextToken = projectData.data.listProjects.nextToken;
			} while (nextToken);

			setData(allProjects);
		} catch (error) {
			console.log("error on fetching projects", error);
		}
	};

	// import formatted excel data to database
	const importToDatabase = async ({ project }) => {
		const wbs = project.WBSElement;
		const isUpdate = data.filter((item) => item.WBSElement === wbs);
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
		} = project;

		if (isUpdate.length > 0) {
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
							id: isUpdate[0].id,
						},
					},
				});
				return;
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				await API.graphql(
					graphqlOperation(createProject, {
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
						},
					})
				);
				return;
			} catch (err) {
				console.log(err);
			}
		}
	};

	const handleFileUpload = (event) => {
		const numFields = [
			"Actuals",
			"ApprovedGrossBudget",
			"CurrentForecast",
			"DirectCosts",
			"IndirectCosts",
			"InitialPlan",
			"OpenPOCommitments",
			"OriginalARAmount",
			"PersonResponsible",
			"SystemStatus",
			"ReimburesementPercentage",
			"OverheadPercentage",
			"TM1CurrentAmount",
			"TM1NetAmount",
		];
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: "array" });

				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				const excelJson = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
				});

				const headers = excelJson[0];
				const dataRows = excelJson.slice(1);

				const dataArray = dataRows.map((row) => {
					const rowData = {};
					headers.forEach((header, index) => {
						const cleadedHeader = cleanHeader(header);
						if (row[index] !== undefined) {
							rowData[cleadedHeader] = row[index];
						} else {
							if (numFields.includes(cleadedHeader)) {
								rowData[cleadedHeader] = 0;
							} else {
								rowData[cleadedHeader] = "-";
							}
						}
					});
					return rowData;
				});
				dataArray.forEach((project) => {
					importToDatabase({ project });
				});
				setIsImported(true);
				setTimeout(() => {
					setIsImported(false);
				}, 5000);

				return;
			};
			reader.readAsArrayBuffer(file);
		}
	};

	return (
		<div style={{ marginBottom: "1rem" }}>
			{isImported ? (
				<div>
					<h2>Import Successful</h2>
					<p>Check the console for the data</p>
				</div>
			) : (
				<div>
					<h2>Import WBS Summary (.xlsx or .xls file)</h2>
					<p>File must be less than 1MB</p>
				</div>
			)}
			<input
				type="file"
				accept=".xlsx, .xls"
				onChange={handleFileUpload}
			/>
		</div>
	);
}

export default Upload;
