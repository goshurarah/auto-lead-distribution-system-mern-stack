import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Sidebar from "../Sidebar/Sidebar";
import { GET_Campaign_DETAIL } from "../../GraphQl/mutation";
import "./CampaignDetail.css";
const CampaignDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_Campaign_DETAIL, {
    variables: { id },
  });
  // console.log("data campaign", data);
 
  const lead = data?.getCampaign;

  return (
    <div className="detail-container">
      <Sidebar />
      {loading ? (
    <tr>
      <td colSpan="7">Loading...</td> {/* Adjust colSpan to match the number of columns */}
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
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", marginRight: "8px" }}
            ></i>
          </span>
          <h2>Agent Campaign</h2>
        </div>

        <p>
          <strong>Name:</strong> {lead?.name || "N/A"}
        </p>
        <div className="detail_content_main">
          <p>
            <strong>targetedAudience:</strong> {lead?.targetedAudience  || "N/A"}
          </p>
          <p>
            <strong>Leads Coount:</strong> {lead?.leadsCount || "N/A"}
          </p>
          <p>
            <strong>End Time:</strong> {lead?.endTime || "N/A"}
          </p>
        </div>
        {/* <div className="detail_content_main">
          <p>
            <strong>Location:</strong> {lead?.location}
          </p>

          <p>
            <strong>Assigned To:</strong> {lead.agentId}
          </p>
          <p>
            <strong>Start Insurance:</strong> {lead.startInsurance}
          </p>
        </div> */}
      </div>
  )}
    </div>
  );
};

export default CampaignDetail;
