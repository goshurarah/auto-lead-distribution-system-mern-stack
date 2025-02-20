import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import {
  GET_AGENTS_QUERY,
  GET_CAMPAIGNS_QUERY,
  GET_LEADS_QUERY,
  DELETE_AGENT,
  DELETE_CAMPAIGN,
  DELETE_LEAD,
  UPDATE_TOGGLE_STATUS_MUTATION,
  UPDATE_TOGGLE_STATUS_CAMPAIGN_MUTATION,
  UPDATE_AGENT,
  UPDATE_LEAD_MUTATION,
  UPDATE_CAMPAIGN,
} from "../../GraphQl/mutation";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import { Leads, Agents, Campaign } from "./components";
import UnassignedLead from "./components/agents/components/unassignedLead";
import Navbar from "../Navbar/Navbar";
import AgentsModal from "../Agents/AgentsModal";

function Dashboard() {
  const location = useLocation();
  const role = localStorage.getItem("userRole");
  const [activeTab, setActiveTab] = useState(() => {
    // For USER role, check localStorage and fallback to "Campaigns"
    if (role === "USER") {
      return localStorage.getItem("activeTab") || "Leads";
    }

    // For Admin, check localStorage and fallback to "Agents"
    return localStorage.getItem("activeTab") || "Agents";
  });

  // const [activeTab, setActiveTab] = useState(() => {
  //   // Check the role and set the default tab accordingly
  //   if (role === "USER") {
  //     return "Campaigns";  // Default to Campaigns for users
  //   }
  //   // For Admin, use the value from localStorage or default to "Agents"
  //   return localStorage.getItem("activeTab") || "Agents";
  // });

  const { loading, error, data, refetch } = useQuery(GET_AGENTS_QUERY);

  // Edit Agent Potion start

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phoneNumber: "",
    email: "",
    npnNumber: "",
    agentId: "",
    licenseNo: "",
    licenseArea: "",
    // assignedLeads: "",
    policyStatus: "",
    toggleStatus: false,
  });
  const [updateToggleStatusMutation] = useMutation(
    UPDATE_TOGGLE_STATUS_MUTATION
  );

  const [formDataLead, setFormDataLead] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    location: "",
    insuranceType: "",
    agentId: "",
    createdAt: "",
    // Add other lead-specific fields here as needed
  });

  const [updateAgentMutation] = useMutation(UPDATE_AGENT);
  const [updateLeadMutation] = useMutation(UPDATE_LEAD_MUTATION);
  const [updateCampaignMutation] = useMutation(UPDATE_CAMPAIGN);

  // Edit Campaign Potion start
  const [formDataCampaign, setFormDataCampaign] = useState({
    id: "",
    name: "",
    targetedAudience: "",
    leadsCount: 0,
    createdAt: "",
    endTime: "",
    toggleStatus: false,
  });
  const [updateToggleStatusMutationCampaign] = useMutation(
    UPDATE_TOGGLE_STATUS_CAMPAIGN_MUTATION
  );

  const leadsCountInt = parseInt(formDataCampaign.leadsCount, 10);

  // Edit Camapign Potion end

  const {
    loading: loading_campaign,
    error: error_campaign,
    data: data_campaign,
    refetch: refetch_campaign,
  } = useQuery(GET_CAMPAIGNS_QUERY);
  const {
    loading: loading_lead,
    error: error_lead,
    data: data_lead,
    refetch: data_refecth,
  } = useQuery(GET_LEADS_QUERY);

  const [deleteAgent] = useMutation(DELETE_AGENT, {
    onCompleted: () => {
      refetch(); // Refresh the list after deletion
    },
    onError: (error) => {
      console.error("Error deleting agent:", error.message);
    },
  });

  const [deleteLead] = useMutation(DELETE_LEAD, {
    onCompleted: () => {
      data_refecth();
    },
    onError: (error) => {
      console.error("Error deleting agent:", error.message);
    },
  });

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    onCompleted: () => {
      refetch_campaign();
    },
    onError: (error) => {
      console.error("Error deleting agent:", error.message);
    },
  });

  useEffect(() => {
    // Save the active tab to localStorage whenever it changes
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderAddButton = () => {
    if (role === "ADMIN") {
      switch (activeTab) {
        case "Campaigns":
          return (
            <div className="add-button-container">
              <Link to="/add-campaign">
                <button className="add-button">Add Campaign</button>
              </Link>
            </div>
          );
          case "Agents":
            return (
              <div className="add-button-container">
            
                  <AgentsModal/>
               
              </div>
            );
        // case "Leads":
        //   return (
        //     <div className="add-button-container">
        //       <Link to="/add-lead">
        //         <button className="add-button">Add Leads</button>
        //       </Link>
        //     </div>
        //   );
        default:
          return null;
      }
    }

    switch (activeTab) {
      case "Agents":
        return (
          <div className="add-button-container">
            <Link to="/add-agent">
              <button className="add-button">Add Agents</button>
            </Link>
          </div>
        );
      case "Campaigns":
        return (
          <div className="add-button-container">
            {/* <Link to="/add-campaign"> */}
            <button className="add-button">Add Campaign</button>
            {/* </Link> */}
          </div>
        );
      // case "Leads":
      //   return (
      //     <div className="add-button-container">
      //       <Link to="/add-lead">
      //         <button className="add-button">Add Leads</button>
      //       </Link>
      //     </div>
      //   );
      default:
        return null;
    }
  };
  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateToggleStatusMutation({
        variables: {
          id: id,
          data: {
            toggleStatus: newStatus,
          },
        },
      });
    } catch (error) {
      console.error("Error updating toggle status:", error);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          {/* <div className="header_search">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div> */}
          <h2 className="mb-3">
            {role === "USER" ? "Agent Dashboard" : "Admin Dashboard"}
          </h2>
          <div className="agents-section">
            <div className="nametabs">
              <div className="tabs">
                <div className="agents_tab mb-3">
                  <h2 className="title_heading_head">{activeTab}</h2>
                  {role === "USER" ? (
                    <div className="three_btn_all">
                      <button
                        className={`tab ${
                          activeTab === "Leads" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("Leads")}
                      >
                        Leads
                      </button>
                      <button
                        className={`tab ${
                          activeTab === "Campaigns" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("Campaigns")}
                      >
                        Campaigns
                      </button>
                    </div>
                  ) : (
                    <div className="three_btn_all">
                      <button
                        className={`tab ${
                          activeTab === "Agents" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("Agents")}
                      >
                        Agents
                      </button>
                      <button
                        className={`tab ${
                          activeTab === "Campaigns" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("Campaigns")}
                      >
                        Campaigns
                      </button>
                      <button
                        className={`tab ${
                          activeTab === "Leads" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("Leads")}
                      >
                        Leads
                      </button>
                      <button
                        className={`tab ${
                          activeTab === "UnAssigned" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("UnAssigned")}
                      >
                        Unassigned Leads
                      </button>
                    </div>
                  )}
                </div>
                <div className="add-button-container">{renderAddButton()}</div>
              </div>
            </div>

            {/* Render different tables based on the active tab */}
            {/*
          {loading && <p>Loading agents...</p>}
          {error && <p>Error loading agents: {error.message}</p>}
          */}
            {role === "ADMIN" && activeTab === "Agents" && (
              <Agents
                data={data}
                handleToggleStatus={handleToggleStatus}
                deleteAgent={deleteAgent}
                formData={formData}
                setFormData={setFormData}
                updateAgentMutation={updateAgentMutation}
              />
            )}

            {/* {loading_campaign && <p>Loading agents...</p>}
          {error_campaign && <p>Error loading agents: {error.message}</p>} */}
            {activeTab === "Campaigns" && (
              <Campaign
                data_campaign={data_campaign}
                formDataCampaign={formDataCampaign}
                setFormDataCampaign={setFormDataCampaign}
                updateCampaignMutation={updateCampaignMutation}
                leadsCountInt={leadsCountInt}
                deleteCampaign={deleteCampaign}
                updateToggleStatusMutationCampaign={
                  updateToggleStatusMutationCampaign
                }
              />
            )}

            {/* {loading_lead && <p>Loading agents...</p>}
          {error_lead && <p>Error loading agents: {error.message}</p>} */}
            {activeTab === "Leads" && (
              <Leads
                deleteLead={deleteLead}
                data_lead={data_lead}
                updateLeadMutation={updateLeadMutation}
                formDataLead={formDataLead}
                setFormDataLead={setFormDataLead}
              />
            )}
            {activeTab === "UnAssigned" && (
              <UnassignedLead
                deleteLead={deleteLead}
                data_lead={data_lead}
                updateLeadMutation={updateLeadMutation}
                formDataLead={formDataLead}
                setFormDataLead={setFormDataLead}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
