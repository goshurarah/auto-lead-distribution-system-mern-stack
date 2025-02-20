import React, { useEffect } from "react";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Login from "./LoginPage/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import SignUp from "./LoginPage/SignUp";
import Modal from "./Components/Agents/AddAgent";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import AddCampaign from "./Components/Campaigns/AddCampaign";
import AddLeads from "./Components/Leads/AddLeads";
import OverviewDashboard from "./Components/Overview/OverviewDashboard";
import LeadDetail from "./Components/DetailedPage/LeadDetail";
import CampaignDetail from "./Components/DetailedPage/CampaignDetail";
import AgentsDetail from "./Components/DetailedPage/AgentsDetail";
import ForgotPassword from "./LoginPage/ForgotPassword";
import ResetPassword from "./LoginPage/ResetPassword";
import AgentsFilter from "./Components/Dashboard/components/agents/components/agentsFilter";
import Setting from "./Components/Setting/Setting";
import GhlSignIn from "./LoginPage/GHLSignIn/ghlSignIn";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />

          <Route
            exact
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* Protected Routes */}
          <Route exact path="/overview" element={<OverviewDashboard />} />
          <Route exact path="/agent-filter" element={<AgentsFilter />} />
          <Route
            exact
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/ghl-app"
            element={
              <ProtectedRoute requiredRole="USER">
                <GhlSignIn />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/add-agent"
            element={
              <ProtectedRoute>
                <Modal />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/add-campaign"
            element={
              <ProtectedRoute>
                <AddCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/add-lead"
            element={
              <ProtectedRoute>
                <AddLeads />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/lead/:id"
            element={
              <ProtectedRoute>
                <LeadDetail />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/campaign/:id"
            element={
              <ProtectedRoute>
                <CampaignDetail />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/agent/:id"
            element={
              <ProtectedRoute>
                <AgentsDetail />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
