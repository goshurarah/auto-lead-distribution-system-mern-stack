import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_LEADS_QUERY,
  UPDATE_LEAD_MUTATION,
} from "../../../GraphQl/mutation";
import { GET_ALL_LEAD_QUERY } from "../../../GraphQl/adminMutation";
import { Link } from "react-router-dom";
import EditLead from "../../Leads/EditLead";
import LeadsFilter from "./agents/components/leadsFilter";

// Pagination component
const Leads = ({
  deleteLead,
  updateLeadMutation,
  formDataLead,
  setFormDataLead,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(50); // You can adjust this value if you want different page sizes
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
    console.log(data, "dtaa check");
    // Update the filtered agents state
    setFilteredAgents(data?.filterLeads);
    setTotalFilteredPages(data?.filterLeads?.totalPages); // Update total pages for filtered agents
    setFilteredCurrentPage(data?.filterLeads?.currentPage); // Reset to first page when applying new filter
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
  const leadqueryQuery = role === "USER" ? GET_LEADS_QUERY : GET_ALL_LEAD_QUERY;
  const { loading, error, data, refetch } = useQuery(leadqueryQuery, {
    variables: { page: currentPage, perPage },
    fetchPolicy: "network-only", // Bypasses cache initially
    nextFetchPolicy: "cache-first", // Uses cache after first fetch
  });
  const [showModalLead, setShowModalLead] = useState(false);

  const handleShowModalLead = (lead) => {
    setFormDataLead({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      location: lead.location,
      state: lead.state,
      city: lead.city,
      postal_code: lead.postal_code,
      full_address: lead.full_address,
      insuranceType: lead.insuranceType,
      agentId: lead.agentId,
    });
    setShowModalLead(true);
  };
  const tableData = role === "USER" ? data?.getLeads : data?.getAllLeads;
  const campaignsToDisplay = filteredAgents ? filteredAgents : tableData || [];
  console.log("campaign to display", campaignsToDisplay);
  const handleCloseModalLead = () => setShowModalLead(false);

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      await updateLeadMutation({
        variables: {
          id: formDataLead.id,
          data: {
            name: formDataLead.name,
            phone: formDataLead.phone,
            email: formDataLead.email,
            full_address: formDataLead.full_address,
            // insuranceType: formDataLead.insuranceType,
            city: formDataLead.city,
            state: formDataLead.state,
            postal_code: formDataLead.postal_code,
          },
        },
      });
      handleCloseModalLead();
    } catch (error) {
      console.error("Failed to update lead", error);
    }
  };

  const handleDeleteLead = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (confirmDelete) {
      deleteLead({ variables: { id } });
      refetch();
    }
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= data?.getLeads?.totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };
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
      {role === "ADMIN" && (
        <div className="header_search_agent d-flex mb-3">
          <input
            type="text"
            placeholder="Name"
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
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Postal/Zip</th>
            <th>City</th>
            <th>State</th>
            <th>Address</th>
            {/* <th>Policy Type</th> */}
            <th>Created</th>
            {role !== "USER" && <th>Assigned to</th>}
            {role == "USER" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8">Loading...</td>
            </tr>
          ) : error ||
            !data ||
            (campaignsToDisplay && campaignsToDisplay?.leads?.length === 0) ? (
            <tr>
              <td colSpan="8">No Data Found</td>
            </tr>
          ) : (
            campaignsToDisplay &&
            campaignsToDisplay?.leads
              .filter((lead) => lead.status === "Assigned")
              ?.map((lead) => (
                <tr key={lead.id}>
                  <td title={lead.name}>
                    {lead.name || "N/A"}
                    {/* <Link to={`/lead/${lead.id}`}>{lead.name}</Link> */}
                  </td>
                  <td>{lead.phone || "N/A"} </td>
                  <td title={lead.email}>{lead.email || "N/A"}</td>
                  <td>{lead.postal_code || "N/A"}</td>
                  <td>{lead.city || "N/A"}</td>
                  <td>{lead.state || "N/A"}</td>
                  <td title={lead.full_address}>
                    {lead.full_address || "N/A"}
                  </td>
                  {/* <td>{lead.insuranceType || "N/A"}</td> */}
                  <td>
                    {new Date(parseInt(lead.createdAt)).toLocaleDateString()}
                  </td>
                  {role !== "USER" && (
                    <td>
                      {lead?.agentLeads[0]?.agent?.firstName +
                        " " +
                        lead?.agentLeads[0]?.agent?.lastName || "N/A"}
                    </td>
                  )}
                  {role == "USER" && (
                    <td>
                      <i
                        className="fas fa-edit"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleShowModalLead(lead)}
                      ></i>
                      <i
                        className="fas fa-trash"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteLead(lead.id)}
                      ></i>
                    </td>
                  )}
                </tr>
              ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}

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

      {/* Lead Modal */}
      <EditLead
        showModalLead={showModalLead}
        onCloseLead={handleCloseModalLead}
        formDataLead={formDataLead}
        setFormDataLead={setFormDataLead}
        onSubmitLead={handleUpdateLead}
      />
      <LeadsFilter
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

export default Leads;
