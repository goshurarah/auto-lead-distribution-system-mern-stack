import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_LEADS_QUERY,
  UPDATE_LEAD_MUTATION,
} from "../../../../../GraphQl/mutation";
import { GET_ALL_LEAD_QUERY } from "../../../../../GraphQl/adminMutation";
import { Link } from "react-router-dom";
import EditLead from "../../../../Leads/EditLead";

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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= data?.getLeads?.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
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
            <th>Policy Type</th>
            <th>Created</th>
         
            {/* <th>Edit/Delete</th> */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8">Loading...</td>
            </tr>
         ) : (error || !data || (tableData?.leads?.length === 0 && tableData?.leads?.status === "UnAssigned")) ? (

            
            <tr>
              <td colSpan="8">No Data Found</td>
            </tr>
            
          ) : (
            tableData.leads
              .filter((lead) => lead.status === "UnAssigned")
              .map((lead) => (
                <tr key={lead.id}>
                  <td>
                    {lead.name}
                    {/* <Link to={`/lead/${lead.id}`}>{lead.name}</Link> */}
                  </td>
                  <td>{lead.phone || "N/A"} </td>
                  <td>{lead.email || "N/A"}</td>
                  <td>{lead.postal_code || "N/A"}</td>
                  <td>{lead.city || "N/A"}</td>
                  <td>{lead.state || "N/A"}</td>
                  <td>{lead.full_address || "N/A"}</td>
                  <td>{lead.insuranceType || "N/A"}</td>
                  <td>
                    {new Date(parseInt(lead.createdAt)).toLocaleDateString()}
                  </td>
                

                  {/* <td>
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
                  </td> */}
                </tr>
              ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}

      <div className="pagination mt-5" style={{ float: "right" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="p-2">
          Page {currentPage} of {tableData?.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === tableData?.totalPages}
        >
          Next
        </button>
      </div>

      {/* Lead Modal */}
      <EditLead
        showModalLead={showModalLead}
        onCloseLead={handleCloseModalLead}
        formDataLead={formDataLead}
        setFormDataLead={setFormDataLead}
        onSubmitLead={handleUpdateLead}
      />
    </div>
  );
};

export default Leads;
