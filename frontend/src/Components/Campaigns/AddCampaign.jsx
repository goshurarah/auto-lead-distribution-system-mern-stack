import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { CREATE_CAMPAIGN_MUTATION } from "../../GraphQl/mutation";
import { GET_CAMPAIGNS_QUERY } from "../../GraphQl/mutation";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./AddCampaign.css";

function AddCampaign() {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const navigate = useNavigate();
  const [createAgent] = useMutation(CREATE_CAMPAIGN_MUTATION);
  const [formData, setFormData] = useState({
    name: "",
    targetedAudience: "",
    leadsCount: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createAgent({
        variables: {
          ...formData,
          leadsCount: parseInt(formData.leadsCount, 10),
          endTime: new Date(formData.endTime).toISOString(),
        },
        refetchQueries: [{ query: GET_CAMPAIGNS_QUERY }],
        awaitRefetchQueries: true,
      });
      setUpdateTrigger(!updateTrigger);
      toast.success("Campaign created successfully!");
      navigate("/dashboard", { state: { activeTab: "Campaigns" } });
      setFormData({
        name: "",
        targetedAudience: "",
        leadsCount: "",
        endTime: "",
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(`Failed to create campaign: ${error.message}`);
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
                Campaign Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* <label>
                Audience
                <input
                  type="text"
                  name="targetedAudience"
                  value={formData.targetedAudience}
                  onChange={handleChange}
                  required
                />
              </label> */}

              <label>
                Budget
                <input
                  type="number"
                  name="leadsCount"
                  value={formData.leadsCount}
                  min="0"
                  onChange={handleChange}
                  required
                />
              </label>

              {/* <label>
                Start Date
                <input
                  type="date"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </label> */}
              <label>
               End Date
                <input
                  type="date"
                  name="endTime"
                  value={formData.endTime}
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
            <h3>Campaign Introduction</h3>
            <p className="introduction-text">
              Hi there! <br/>My name is <b>{formData.name }</b>, and my budget is {formData.leadsCount}
            </p>

         
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCampaign;
