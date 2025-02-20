import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CAMPAIGNS_QUERY,
  UPDATE_TOGGLE_STATUS_CAMPAIGN_MUTATION,
} from "../../../GraphQl/mutation";
import { GET_ALL_CAMPAIGNS_QUERY } from "../../../GraphQl/adminMutation";
import { Link } from "react-router-dom";
import EditCampaign from "../../Campaigns/EditCampaign";
import CampiagnFilter from "./agents/components/campaignFilter";

const Campaign = ({
  formDataCampaign,
  setFormDataCampaign,
  updateCampaignMutation,
  leadsCountInt,
  deleteCampaign,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(50); // You can change this to adjust per-page items777
  const role = localStorage.getItem("userRole");
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState(null);
  const [totalFilteredPages, setTotalFilteredPages] = useState(1); // To keep track of total pages for filtered data

  const [nextClicked, setNextClicked] = useState(false);
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1); // Track filtered pagination
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [filterFormData, setFilterFormData] = useState({
    locationIds: [],
    policyIds: [],
    leadWeight: "",
    totalLeads: "",
    toggleStatus: true,
  });
  const handleUpdateAgentFilter = (data) => {
    console.log("data campaign",data);
    // Update the filtered agents state
    setFilteredAgents(data?.filterCampaigns);
    setTotalFilteredPages(data?.filterCampaigns?.totalPages); // Update total pages for filtered agents
    setFilteredCurrentPage(data?.filterCampaigns?.currentPage); // Reset to first page when applying new filter
    setIsFilterApplied(true);
  };
  const handleClearFilter = () => {
    setFilteredAgents(null); // Clear filtered data
    setFilterFormData({
      locationIds: [],
      policyIds: [],
      leadWeight: "",
      totalLeads: "",
      toggleStatus: true,
    });
    setIsFilterApplied(false); // Mark filter as cleared
    refetch(); // Refetch unfiltered data
  };
  const campaignsQuery =
    role === "USER" ? GET_CAMPAIGNS_QUERY : GET_ALL_CAMPAIGNS_QUERY;

  const { loading, error, data, refetch } = useQuery(campaignsQuery, {
    variables: { page: currentPage, perPage },
    fetchPolicy: "network-only", // Bypasses cache initially
    nextFetchPolicy: "cache-first", // Uses cache after first fetch
  });

  const [updateToggleStatusMutationCampaign] = useMutation(
    UPDATE_TOGGLE_STATUS_CAMPAIGN_MUTATION
  );

  const [showModalCampaign, setShowModalCampaign] = useState(false);

  const handleShowModalCampaign = (campaign) => {
    setFormDataCampaign({
      id: campaign.id,
      name: campaign.name,
      targetedAudience: campaign.targetedAudience,
      leadsCount: campaign.leadsCount,
      toggleStatus: campaign.toggleStatus,
    });
    setShowModalCampaign(true);
  };

  const handleCloseModalCampaign = () => setShowModalCampaign(false);

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      await updateCampaignMutation({
        variables: {
          id: formDataCampaign.id,
          data: {
            name: formDataCampaign.name,
            targetedAudience: formDataCampaign.targetedAudience,
            leadsCount: leadsCountInt,
            toggleStatus: formDataCampaign.toggleStatus,
          },
        },
      });
      handleCloseModalCampaign();
    } catch (error) {
      console.error("Failed to update campaign", error);
    }
  };

  const handleDeleteCampaign = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (confirmDelete) {
      deleteCampaign({ variables: { id } });
      refetch();
    }
  };

  const tableData =
    role === "USER" ? data?.getCampaigns : data?.getAllCampaigns;

  const campaignsToDisplay = filteredAgents ? filteredAgents : tableData || [];

  const handleToggleStatusCampaign = async (id, newStatus) => {
    try {
      await updateToggleStatusMutationCampaign({
        variables: {
          id,
          data: {
            toggleStatus: newStatus,
          },
        },
      });
    } catch (error) {
      console.error("Error updating toggle status:", error);
    }
  };

  // Handle pagination changes
  const handleNextPage = () => {
    if (filteredAgents && filteredCurrentPage < totalFilteredPages) {
      setNextClicked(true);
      setFilteredCurrentPage((prevPage) => prevPage + 1);
    } else if (
      campaignsToDisplay?.currentPage < campaignsToDisplay?.totalPages
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (filteredAgents && filteredCurrentPage > 1) {
      // Handle pagination for filtered agents
      setFilteredCurrentPage((prevPage) => prevPage - 1);
      setNextClicked(true);
      // setNextClicked(false); // Reset nextClicked to avoid unnecessary API calls
    } else if (campaignsToDisplay?.currentPage > 1) {
      // Handle pagination for unfiltered agents (normal pagination)
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleShowModalFilter = () => {
    setShowModalFilter(true);
  };

  //SEARCH FILTER
  const handleSearchChange = (e) => {
    setFilterFormData({
      ...filterFormData,
      name: e.target.value,
    }); // Update searchTerm immediately
    // debouncedSearch(value); // Trigger debounced search
  };

  const handleCloseModalFilter = () => setShowModalFilter(false);
  return (
    <div>
      {role !== "USER" && (
      <div className="header_search_agent d-flex mb-3">
        <input
          type="text"
          placeholder="Campaign Name"
          className="search-bar_filter"
          value={filterFormData.name}
          onChange={handleSearchChange}
        />
        <p
          className="p-0 fa fa-filter filter_icon_agents"
          style={{ cursor: "pointer" }}
          onClick={() => handleShowModalFilter()}
        ></p>
        {isFilterApplied && (
          <button
            className="btn btn-secondary ms-3"
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
        )}
      </div>
      )}
      <table className="agents-table">
        <thead>
          <tr className="tr_head_css">
            <th>UUID</th>
            <th>Name</th>
            <th>On/Off</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Created</th>
            <th>End Date</th>
            {/* <th>Actions</th> */}
            {role === "USER" && (
              <>
                {" "}
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8">Loading...</td>
            </tr>
          ) : error ||
            !data ||
            (campaignsToDisplay &&
              campaignsToDisplay?.campaigns?.length === 0) ? (
            <tr>
              <td colSpan="8">No Data Found</td>
            </tr>
          ) : (
            campaignsToDisplay &&
            campaignsToDisplay?.campaigns?.map((campaign) => (
              
              <tr key={campaign.id}>
                  <td title={campaign.campaign_uuid}>
                  {campaign.campaign_uuid}
                </td>
                <td>
                  {campaign.name}
                  {/* <Link to={`/campaign/${campaign.id}`}>{campaign.name}</Link> */}
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={campaign.toggleStatus}
                      onChange={() =>
                        handleToggleStatusCampaign(
                          campaign.id,
                          !campaign.toggleStatus
                        )
                      }
                      disabled={role !== "USER"}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td title={campaign.targetedAudience}>
                  {campaign.targetedAudience}
                </td>
                <td>{campaign.leadsCount}</td>
                <td>
                  {new Date(parseInt(campaign.createdAt)).toLocaleDateString()}
                </td>
                <td>
                  {new Date(parseInt(campaign.endTime)).toLocaleDateString()}
                </td>
                {/* <td>
                  <select className="select_campaign">
                    <option value="">Select</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                  </select>
                </td> */}
                {role === "USER" && (
                  <>
                    <td>
                      <i
                        className="fas fa-edit"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleShowModalCampaign(campaign)}
                      ></i>
                      <i
                        className="fas fa-trash"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      ></i>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div>
        <div className="pagination-controls text-end mt-5">
          <button
            onClick={handlePrevPage}
            disabled={
              filteredAgents ? filteredCurrentPage === 1 : currentPage === 1
            }
          >
            Prev
          </button>
          <span className="p-3">
            Page {filteredAgents ? filteredCurrentPage : currentPage} of{" "}
            {filteredAgents
              ? totalFilteredPages
              : campaignsToDisplay?.totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={
              filteredAgents
                ? filteredCurrentPage === totalFilteredPages
                : currentPage === campaignsToDisplay?.totalPages
            }
          >
            Next
          </button>
        </div>
      </div>
      {/* Edit Campaign Modal */}
      <EditCampaign
        showModalCampaign={showModalCampaign}
        onCloseCampaign={handleCloseModalCampaign}
        formDataCampaign={formDataCampaign}
        setFormDataCampaign={setFormDataCampaign}
        onSubmitCampaign={handleUpdateCampaign}
      />
      <CampiagnFilter
        show={showModalFilter}
        onClose={handleCloseModalFilter}
        onSubmit={handleUpdateAgentFilter}
        nextClicked={nextClicked}
        setNextClicked={setNextClicked}
        filteredCurrentPage={filteredCurrentPage}
        setFilterFormData={setFilterFormData}
        filterFormData={filterFormData}
      />
    </div>
  );
};

export default Campaign;
