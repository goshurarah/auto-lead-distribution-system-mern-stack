import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { CREATE_AGENT_MUTATION, UPDATE_AGENT } from "../../GraphQl/mutation";
import { GET_AGENTS_QUERY } from "../../GraphQl/mutation";
import { ToastContainer, toast } from "react-toastify";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css";

function Modal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [createAgent] = useMutation(CREATE_AGENT_MUTATION);
  const { id } = useParams(); 
  const [updateAgent] = useMutation(UPDATE_AGENT);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    npnNumber: "",
    phoneNumber: "",
    email: "",
    agentId: "",
    licenseArea: "",
    // assignedLeads: "",
    policyStatus: "",
    licenseNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (location.state && location.state.agent) {
      setFormData(location.state.agent);
    }
  }, [location.state]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const { data } = await createAgent({
        variables: {
          ...formData,
          // assignedLeads: parseInt(formData.assignedLeads),
        },
        refetchQueries: [{ query: GET_AGENTS_QUERY }],
        awaitRefetchQueries: true,
      });
      setUpdateTrigger(!updateTrigger);

      toast.success("Agent created successfully!");
      navigate("/dashboard", { state: { activeTab: "Agents" } });
      setFormData({
        name: "",
        npnNumber: "",
        phoneNumber: "",
        email: "",
        agentId: "",
        licenseArea: "",
        // assignedLeads: "",
        policyStatus: "",
        licenseNo: "",
      });
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error(`Failed to create agent: ${error.message}`);
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
                Agent Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                NPN Number
                <input
                  type="text"
                  name="npnNumber"
                  value={formData.npnNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Agent Email Address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                License Area
                <input
                  type="text"
                  name="licenseArea"
                  value={formData.licenseArea}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Agent ID
                <input
                  type="text"
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* <label>
                Assigned Leads
                <input
                  type="number" 
                  name="assignedLeads"
                  value={formData.assignedLeads}
                  onChange={handleChange}
                  required
                />
              </label> */}

              <label>
                Policy Type
                <input
                  type="text"
                  name="policyStatus"
                  value={formData.policyStatus}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                License Number
                <input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
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
              call at <b>{formData.phoneNumber || "+12015551234"}</b>. You can
              also review and sign the consent form.
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

export default Modal;
