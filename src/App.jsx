import "./App.css";

import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";

import { Route, Routes } from "react-router-dom";

import AWS from "aws-sdk";

import SiteNav from "./components/common/SiteNav/SiteNav";
import Home from "./components/home/Home";
import SignIn from "./components/auth/SignIn";
import SiteFooter from "./components/common/SiteFooter/SiteFooter";
import CommitmentReport from "./components/CommitmentReport/CommitmentReport";
import TransactionReport from "./components/TransactionReport/TransactionReport";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

Amplify.configure(awsconfig);

function App() {
	return (
		<Authenticator loginMechanisms={["email"]}>
			{({ signOut, user }) => (
				<div className="App">
					{/* <SiteNav signOut={signOut} /> */}
					<Routes>
						<Route path="*" element={<Home />} />
						<Route path="/" exact={true} element={<Home />} />
						<Route path="/signin" element={<SignIn />} />
						<Route
							path="/commitment/:id"
							element={<CommitmentReport />}
						/>
						<Route
							path="/transaction/:id"
							element={<TransactionReport />}
						/>
						<Route path="/admin" element={<AdminDashboard />} />
					</Routes>
					<SiteFooter />
				</div>
			)}
		</Authenticator>
	);
}

export default App;
