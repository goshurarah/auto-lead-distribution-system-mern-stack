import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Sidebar from "../Sidebar/Sidebar";
import { GET_Agents_Detail } from "../../GraphQl/mutation";
import "./AgentDetail.css";
const AgentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_Agents_Detail, {
    variables: { id },
  });

  const [copied, setCopied] = useState(false);

  const lead = data?.getAgent;

  const webhookURL = lead?.webhook_url;

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading data</p>;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(webhookURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy:", err));
  };
  return (
    <div className="detail-container">
      <Sidebar />
      <div className="agent_lead_main_div">
        <div className="detail">
          <div className="arrow_content">
            <span className="m-2">
              <i
                className="fas fa-arrow-left arrow_back_detail"
                onClick={() => window.history.go(-1)}
                style={{ cursor: "pointer", marginRight: "8px" }}
              ></i>
            </span>
            <h2 className="m-2">Agent Leads</h2>
          </div>

          <div className="agent-info">
            <p>
              <div className="d-flex gap-5 mt-3">
                <p className="p-0 m-0  d-flex align-items-center">
                  <strong className="strong_css name_detail">Name: </strong>{" "}
                  <span className="m-2 content_detail_page_agent">
                    {" "}
                    {lead?.firstName && lead?.lastName
                      ? `${lead.firstName} ${lead.lastName}`
                      : "N/A"}
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "14rem",
                    borderRadius: "30px",
                  }}
                  className="w-50"
                >
                  <input
                    type="text"
                    value={webhookURL || "N/A"}
                    readOnly
                    className="input_search"
                    style={{
                      marginRight: "10px",
                      padding: "5px",
                      width: "100%",
                      borderRadius: "30px",
                    }}
                  />
                  <button onClick={handleCopy} style={{ padding: "5px" }}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </p>
            <div className="p-3">
              <div className="row mb-2">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Assigned Leads:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.assignedLeads || "0"}
                    </span>
                  </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">NPN Number:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.npnNumber || "0"}
                    </span>
                  </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Email:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.email || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Product:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.policies?.length > 0
                        ? lead.policies?.map((policy, index) => (
                            <span key={index}>
                              {policy.name}
                              {index < lead?.policies?.length - 1 && ", "}
                            </span>
                          ))
                        : "No policies available"}
                    </span>
                  </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Location:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.locations?.length > 0
                        ? lead?.locations?.map((location, index) => (
                            <span key={index}>
                              {location.name}
                              {index < lead?.locations?.length - 1 && ", "}
                            </span>
                          ))
                        : "No locations available"}
                    </span>
                  </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Phone Number:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.phoneNumber}
                    </span>
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Global Cap: </strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.globalCap || "0"}
                    </span>
                  </p>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Monthly Cap: </strong>
                    <span className="content_detail_page_agent">
                      {lead?.monthlyCap || "0"}
                    </span>
                  </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Daily Cap: </strong>
                    <span className="content_detail_page_agent">
                      {lead?.dailyCap || "0"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Remaining Leads: </strong>
                    <span className="content_detail_page_agent">
                      {lead?.remainingCap || "0"}
                    </span>
                  </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Priority : </strong>
                    <span className="content_detail_page_agent">
                      {lead?.priority || "0"}
                    </span>
                  </p>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-0">
                  <p>
                    <strong className="strong_css">Weight:</strong>{" "}
                    <span className="content_detail_page_agent">
                      {lead?.weight || "0"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-3">Leads</h3>
          <table className="agents-table">
            <thead>
              <tr className="tr_head_css">
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location/Zip</th>
                {/* <th>Assigned To</th> */}
                <th>Product</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading...</td>{" "}
                  {/* Adjust colSpan to match the number of columns */}
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7">Error: {error.message}</td>{" "}
                  {/* Show error message */}
                </tr>
              ) : lead?.leads?.length === 0 ? (
                <tr>
                  <td colSpan="7">No data available</td>{" "}
                  {/* Show 'No data available' if no leads */}
                </tr>
              ) : (
                lead.leads &&
                lead?.leads?.map((leadItem) => (
                  <tr key={leadItem.id}>
                    <td>{leadItem.name || "N/A"}</td>
                    <td>{leadItem.phone || "N/A"}</td>
                    <td>{leadItem.email || "N/A"}</td>
                    <td>{leadItem.postal_code || "N/A"}</td>
                    {/* <td>{leadItem.agentId}</td> */}
                    <td>
                      {lead?.policies?.length > 0
                        ? lead.policies?.map((policy, index) => (
                            <span key={index}>
                              {policy.name}
                              {index < lead?.policies?.length - 1 && ", "}
                            </span>
                          ))
                        : "No policies available"}
                    </td>
                    <td>
                      {new Date(
                        parseInt(leadItem.createdAt || "N/A")
                      ).toLocaleDateString()}
                    </td>
                    {/* <td>{leadItem.createdAt || "N/A"}</td> */}
                    <td>{leadItem.endInsurance || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
