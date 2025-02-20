import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditAgentModal from "../../../Agents/EditAgentModal";
import { useQuery } from "@apollo/client";
import { GET_AGENTS_QUERY } from "../../../../GraphQl/mutation";
import AgentsFilter from "./components/agentsFilter";
import "./agent.css";

const Agents = ({
  handleToggleStatus,
  formData,
  setFormData,
  updateAgentMutation,
  deleteAgent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1); // Track filtered pagination
  const [showModal, setShowModal] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState(null);
  const [totalFilteredPages, setTotalFilteredPages] = useState(1); // To keep track of total pages for filtered data
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Initial form data state
  const [filterFormData, setFilterFormData] = useState({
    locationIds: [],
    policyIds: [],
    leadWeight: "",
    totalLeads: "",
    toggleStatus: true,
  });

  const [perPage] = useState(50);
  const role = localStorage.getItem("userRole");

  const { loading, error, data, refetch } = useQuery(GET_AGENTS_QUERY, {
    variables: { page: currentPage, perPage },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
  const handleShowModal = (agent) => {
    const agentLocations = agent.locations.map((location) =>
      parseInt(location.id)
    );
    const agentPolicies = agent.policies.map((policy) => parseInt(policy.id));

    setFormData({
      id: agent.id,
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      phoneNumber: agent.phoneNumber,
      npnNumber: agent.npnNumber,
      leadCap: agent.leadCap,
      leadWeight: agent.leadWeight,
      licenseNo: agent.licenseNo,
      assignedLeads: agent.assignedLeads,
      totalLeadCap: agent.totalLeadCap,
      toggleStatus: agent.toggleStatus,
      role: agent.role,
      campaigns: agent.campaigns,
      weight: agent.weight,
      monthlyCap: agent.monthlyCap,
      priority: agent.priority,
      dailyCap: agent.dailyCap,
      globalCap: agent.globalCap,
      // leadWeight:agent.leadWeight,
      locations: agentLocations,
      policies: agentPolicies,
      plans: agent.plans,
    });

    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleShowModalFilter = () => {
    setShowModalFilter(true);
  };

  const handleCloseModalFilter = () => setShowModalFilter(false);

  const handleUpdateAgentFilter = (data) => {
    console.log("data check filter", data);
    // Update the filtered agents state
    setFilteredAgents(data.filterAgents.agents);
    setTotalFilteredPages(data.filterAgents.totalPages); // Update total pages for filtered agents
    setFilteredCurrentPage(data.filterAgents.currentPage); // Reset to first page when applying new filter
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

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      const { data: updatedAgentData } = await updateAgentMutation({
        variables: {
          id: formData.id,
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            npnNumber: formData.npnNumber,
            priority: parseInt(formData.priority),
            weight: parseInt(formData.weight),
            dailyCap: parseInt(formData.dailyCap),
            globalCap: parseInt(formData.globalCap),
            monthlyCap: parseInt(formData.monthlyCap),
            remainingCap: formData.remainingCap,
            // leadWeight: parseInt(formData.leadWeight),
            toggleStatus: formData.toggleStatus,
            locations: formData.locations,
            policies: formData.policies,
            // policyIds: formData.policyIds.map((id) => parseInt(id, 10)),
          },
        },
      });

      const updatedAgent = updatedAgentData.updateAgent;

      // Update filteredAgents if filter is applied
      if (isFilterApplied && filteredAgents) {
        setFilteredAgents((prevAgents) =>
          prevAgents?.map((agent) =>
            agent.id === updatedAgent.id ? updatedAgent : agent
          )
        );
      }

      // Update main data (refetch for consistency)
      refetch();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update agent", error);
    }
  };

  const handleDeleteAgent = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agent?"
    );
    if (confirmDelete) {
      deleteAgent({ variables: { id } });
      refetch();
    }
  };

  // Pagination for filtered agents
  const handleNextPage = () => {
    if (filteredAgents && filteredCurrentPage < totalFilteredPages) {
      setNextClicked(true);
      setFilteredCurrentPage((prevPage) => prevPage + 1);
    } else if (data?.getAgents?.currentPage < data?.getAgents?.totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (filteredAgents && filteredCurrentPage > 1) {
      // Handle pagination for filtered agents
      setFilteredCurrentPage((prevPage) => prevPage - 1);
      setNextClicked(true);
      // setNextClicked(false); // Reset nextClicked to avoid unnecessary API calls
    } else if (data?.getAgents?.currentPage > 1) {
      // Handle pagination for unfiltered agents (normal pagination)
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Slice the filtered data according to the current page and items per page
  const getPaginatedAgents = (agents) => {
    const startIndex = (filteredCurrentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return agents.slice(startIndex, endIndex);
  };

  // Choose agents to display (filtered or unfiltered)
  const agentsToDisplay = filteredAgents
    ? filteredAgents
    : data?.getAgents?.agents || [];

  //SEARCH FILTER
  const handleSearchChange = (e) => {
    setFilterFormData({
      ...filterFormData,
      firstName: e.target.value,
    }); // Update searchTerm immediately
    // debouncedSearch(value); // Trigger debounced search
  };

  return (
    <div>
      <div className="header_search_agent d-flex mb-3">
        <input
          type="text"
          placeholder="First Name"
          className="search-bar_filter"
          value={filterFormData.firstName}
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

      <table className="agents-table">
        <thead className="thead_fixed">
          <tr className="tr_head_css">
            <th>Name</th>
            <th>On/Off</th>
            <th>Joined Since</th>
            <th>NPN</th>
            <th>Location</th>
            <th>Product</th>
            <th>Priority</th>
            <th>Weight</th>
            <th>Global Cap</th>
            <th>Current Leads</th>
            <th>Remaining Leads</th>
            <th>Monthly</th>
            {/* <th>Monthly Performance</th> */}
            <th>Daily</th>

            {/* <th>Lead Weight</th> */}

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9">Loading...</td>
            </tr>
          ) : error || agentsToDisplay?.length === 0 ? (
            <tr>
              <td colSpan="9">No Data Found</td>
            </tr>
          ) : (
            agentsToDisplay?.map((agent) => (
              <tr key={agent.id}>
                <td title={`${agent.firstName} ${agent.lastName}`}>
                  <Link to={`/agent/${agent.id}`}>
                    {agent.firstName} {agent.lastName}
                  </Link>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={agent.toggleStatus}
                      onChange={() =>
                        handleToggleStatus(agent.id, !agent.toggleStatus)
                      }
                      disabled={isFilterApplied}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>2024</td>
                <td>{agent.npnNumber}</td>
                <td
                  title={
                    agent?.locations?.length > 0
                      ? agent.locations
                          ?.map((location) => location.name)
                          .join(", ")
                      : "N/A"
                  }
                >
                  {agent?.locations?.length > 0
                    ? agent.locations
                        ?.map((location) => location.name)
                        .join(", ")
                    : "N/A"}
                </td>
                <td
                  title={
                    agent?.policies?.length > 0
                      ? agent?.policies?.map((policy) => policy.name).join(", ")
                      : "N/A"
                  }
                >
                  {agent?.policies?.length > 0
                    ? agent?.policies?.map((policy) => policy.name).join(", ")
                    : "N/A"}
                </td>
                <td>{agent.priority}</td>
                <td>{agent?.weight || "0"}</td>
                <td>{agent.globalCap}</td>
                <td>{agent.assignedLeads}</td>
                <td>{agent.remainingCap}</td>
                {/* <td>{agent?.monthlyCap || "0"}</td> */}
                {/* <td>
                  {agent?.monthlyCap > 0 && agent.monthlyLeadsCount > 0
                    ? `${agent.monthlyCap}/${agent.monthlyLeadsCount}`
                    : agent?.monthlyLeadsCount || "0"}
                </td> */}
                <td>
                  {agent?.monthlyCap > 0
                    ? `${agent.monthlyLeadsCount}/${agent.monthlyCap}`
                    : 0}
                </td>
                <td>
                  {agent?.dailyCap > 0
                    ? `${agent.dailyLeadsCount}/${agent.dailyCap}`
                    : 0}
                </td>
                {/* <td>{agent?.dailyCap || "0"}</td> */}

                {/* <td>{agent?.leadWeight || "0"}</td> */}

                <td>
                  <i
                    className="fas fa-edit"
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleShowModal(agent)}
                  ></i>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
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
          {filteredAgents ? totalFilteredPages : data?.getAgents?.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            filteredAgents
              ? filteredCurrentPage === totalFilteredPages
              : currentPage === data?.getAgents?.totalPages
          }
        >
          Next
        </button>
      </div>

      <EditAgentModal
        show={showModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateAgent}
      />

      <AgentsFilter
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

export default Agents;
