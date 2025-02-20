import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { CREATE_LEAD_MUTATION } from "../../GraphQl/mutation";
import { GET_AGENTS_QUERY, GET_LEADS_QUERY } from "../../GraphQl/mutation";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function AddLeads() {
  const navigate = useNavigate();
  const {
    data: agentsData,
    loading: agentsLoading,
    error: agentsError,
  } = useQuery(GET_AGENTS_QUERY);
  const [createLead] = useMutation(CREATE_LEAD_MUTATION);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    insuranceType: "",
    assignedTo: "",
    startInsurance: new Date().toISOString().slice(0, 10),
    endInsurance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAgentChange = (e) => {
    const selectedAgentId = parseInt(e.target.value, 10);
    setFormData((prevData) => ({
      ...prevData,
      assignedTo: { id: selectedAgentId },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createLead({
        variables: {
          ...formData,
          assignedTo: { id: formData.assignedTo.id },
          startInsurance: new Date(formData.startInsurance).toISOString(),
          endInsurance: new Date(formData.endInsurance).toISOString(),
        },
        refetchQueries: [
          { query: GET_LEADS_QUERY },
          { query: GET_AGENTS_QUERY },
        ],
       
        awaitRefetchQueries: true,
      });
      setUpdateTrigger(!updateTrigger);
      toast.success("Lead created successfully!");
      navigate("/dashboard", { state: { activeTab: "Leads" } });
      // Reset formData
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(`Failed to create lead: ${error.message}`);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="row m-0">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <form onSubmit={handleSubmit} className="agent-form-container">
            <div className="form-section">
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Location
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Insurance Type
                <input
                  type="text"
                  name="insuranceType"
                  value={formData.insuranceType}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* <label>
                Assigned To
                <select name="assignedTo" onChange={handleAgentChange} required>
                  <option value="">Select an Agent</option>
                  {agentsLoading && <option value="">Loading agents...</option>}
                  {agentsError && (
                    <option value="">Error loading agents</option>
                  )}
                  {agentsData &&
                    agentsData.getAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                </select>
              </label> */}

              <label>
                Start Insurance Date
                <input
                  type="date"
                  name="startInsurance"
                  value={formData.startInsurance}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                End Insurance Date
                <input
                  type="date"
                  name="endInsurance"
                  value={formData.endInsurance}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="button-section">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <Link to="/dashboard">
                  <button type="button" className="cancel-btn">
                    Cancel
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="intro-section">
            <h3>Agent Introduction</h3>
            <p className="introduction-text">
              Hi there! My name is <b>{formData.name || "Johnny"}</b>, and I’m
              <b> {formData.assistantName || "Sally"}</b>'s AI assistant. Sally
              is a licensed healthcare insurance agent (NPN Number:{" "}
              <b>{formData.npnNumber || "1234567"}</b>), and together, we’re
              here to help you find the best healthcare plan tailored to your
              needs.
            </p>
            <p>
              Feel free to reach out via email at{" "}
              <b>{formData.email || "AgentSlytest1@gmail.com"}</b> or give me a
              call at <b>{formData.phone || "+12015551234"}</b>. You can also
              review and sign the consent form.
            </p>
            <p>
              To get started, could you please share your zip code, yearly
              salary, and age? I’ll then be able to recommend the perfect
              healthcare plan for you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLeads;
