import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Sidebar from "../Sidebar/Sidebar";
import { GET_LEAD_DETAIL } from "../../GraphQl/mutation";
import "./LeadDetail.css";
const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_LEAD_DETAIL, {
    variables: { id },
  });
  // if (loading) return <p>Loading...</p>;

  const lead = data.getLead;

  return (
    <div className="detail-container">
      <Sidebar />
      {loading ? (
    <tr>
      <td colSpan="7">Loading...</td> {/* Adjust colSpan to match the number of columns */}
    </tr>
  ) : error ? (
    <tr>
      <td colSpan="7">Error: {error.message}</td> {/* Show error message */}
    </tr>
  ) : lead?.leads?.length === 0 ? (
    <tr>
      <td colSpan="7">No data available</td> {/* Show 'No data available' if no leads */}
    </tr>
  ) : (
      <div className="detail">
        <div className="arrow_content">
          <span>
            <i
              className="fas fa-arrow-left arrow_back_detail"
              onClick={() => window.history.go(-1)}
              style={{ cursor: "pointer", marginRight: "8px" }}
            ></i>
          </span>
          <h2>Agent Leads</h2>
        </div>

        <p>
          <strong>Name:</strong> {lead.name}
        </p>
        <div className="detail_content_main">
          <p>
            <strong>Phone:</strong> {lead.phone}
          </p>
          <p>
            <strong>Insurance Type:</strong> {lead.insuranceType}
          </p>
          <p>
            <strong>Email:</strong> {lead.email}
          </p>
        </div>
        <div className="detail_content_main">
          <p>
            <strong>Location:</strong> {lead.location}
          </p>

          <p>
            <strong>Assigned To:</strong> {lead.agentId}
          </p>
          <p>
            <strong>Start Insurance:</strong> {lead.startInsurance}
          </p>
        </div>
        <p>
          <strong>End Insurance:</strong> {lead.endInsurance}
        </p>
      </div>
       
      )}
    </div>
  );
};

export default LeadDetail;
