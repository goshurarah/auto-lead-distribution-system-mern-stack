import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_ALL_POLICIES, GET_ALL_LOCATIONS } from "../../GraphQl/mutation";
import { Dropdown, DropdownButton } from "react-bootstrap";

import "./EditAgent.css";
function EditAgentModal({ show, onClose, formData, setFormData, onSubmit }) {
  console.log(formData, "FM");
  // Fetch policies data using the GraphQL query
  const { loading: loadingPolicies, data: policiesData } =
    useQuery(GET_ALL_POLICIES);
  const { loading: loadingLocations, data: locationsData } =
    useQuery(GET_ALL_LOCATIONS);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationCheck, setLocationCheck] = useState({});
  const [policyCheck, setPolicyCheck] = useState({});
  // Handle change in form input
  const filteredLocations =
    locationsData?.getAllLocations?.filter((location) =>
      location.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
    ) || [];

  const filteredPolicies =
    policiesData?.getAllPolicies?.filter((policy) =>
      policy.name.toLowerCase().includes(policySearchTerm.toLowerCase())
    ) || [];
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target; // Correctly destructure here
    const id = parseInt(value); // Ensure ID is parsed as an integer

    // Update formData based on the checkbox state
    const updatedValues = checked
      ? [...formData[type], id] // Add the ID if checked
      : formData[type].filter((val) => val !== id); // Remove the ID if unchecked

    const uniqueValues = [...new Set(updatedValues)];

    setFormData((prev) => ({
      ...prev,
      [type]: uniqueValues,
    }));
  };

  const handleChange = (e) => {
    const { name, value, id } = e.target;

    if (name === "locations" || name === "policies") {
      const updatedValues = Array.from(e.target.selectedOptions, (option) =>
        parseInt(option.value)
      ); // Ensure IDs are integers
      setFormData({
        ...formData,
        [name]: updatedValues,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  useEffect(() => {
    // Set initial formData based on response data (if necessary)
  }, [policiesData, formData]);

  // Function to check if policy is in response data
  const isPolicySelected = (policyId) => {
    return formData?.policies?.some((policy) => policy.id === policyId);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Agent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <label>First Name</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Agent Name"
          />
          <label>Last Name</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Agent Name"
          />
          <label>Phone Number</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            placeholder="Phone Number"
          />
          <label>Email</label>
          <input
            type="email"
            disabled
            className="form-control mb-2"
            value={formData.email}
            placeholder="Email"
          />
          <label>NPN Number</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formData.npnNumber}
            onChange={(e) =>
              setFormData({ ...formData, npnNumber: e.target.value })
            }
            placeholder="NPN Number"
          />
          <label>Global Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            value={formData.globalCap}
            min="0"
            onChange={(e) =>
              setFormData({ ...formData, globalCap: e.target.value })
            }
            placeholder="Global Cap"
          />
          <label>Monthly Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            value={formData.monthlyCap}
            min="0"
            onChange={(e) =>
              setFormData({ ...formData, monthlyCap: e.target.value })
            }
            placeholder="Monthly Cap"
          />
          <label>Daily Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            value={formData.dailyCap}
            min="0"
            onChange={(e) =>
              setFormData({ ...formData, dailyCap: e.target.value })
            }
            placeholder="Daily Cap"
          />

          <label>Priority</label>
          <select
            className="form-control mb-2"
            value={formData.priority || "1"}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            {[...Array(10)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <label>Weight</label>
          <select
            className="form-control mb-2"
            value={formData.weight || "1"}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
          >
            {[...Array(5)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          {/* <label>Weight</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            placeholder="Weight"
          /> */}
          {/* <label>Lead Weight</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formData.leadWeight || "0"}
            onChange={(e) =>
              setFormData({ ...formData, leadWeight: e.target.value })
            }
            placeholder="Lead Weight"
          /> */}

          {/* Policy select field */}
          <div className="d-flex justify-content-between">
            <DropdownButton
              id="dropdown-location"
              title="Select Locations"
              variant="secondary"
              className="text-start"
            >
              <Dropdown.ItemText>
                <input
                  type="text"
                  placeholder="Search Locations"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "8px",
                  }}
                />
              </Dropdown.ItemText>
              {!loadingLocations && filteredLocations?.length > 0 ? (
                filteredLocations?.map((location) => (
                  <Dropdown.Item
                    key={location.id}
                    as="label"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                  >
                    <input
                      type="checkbox"
                      value={location.id}
                      checked={
                        formData?.locations?.includes(parseInt(location.id)) ||
                        false
                      } // Sync with formData
                      onChange={(e) => handleCheckboxChange(e, "locations")}
                      style={{ marginRight: "8px" }}
                    />
                    {location.name}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.ItemText>No locations found</Dropdown.ItemText>
              )}
            </DropdownButton>
            <DropdownButton
              id="dropdown-policy"
              title="Select Product"
              variant="secondary"
              className="text-start "
            >
              <Dropdown.ItemText>
                <input
                  type="text"
                  placeholder="Search Policies"
                  value={policySearchTerm}
                  onChange={(e) => setFormData(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "8px",
                  }}
                />
              </Dropdown.ItemText>
              {!loadingPolicies && filteredPolicies?.length > 0 ? (
                filteredPolicies?.map((policy) => (
                  <Dropdown.Item
                    key={policy.id}
                    as="label"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                  >
                    <input
                      type="checkbox"
                      value={policy.id}
                      checked={
                        formData?.policies?.includes(parseInt(policy.id)) ||
                        false
                      } // Sync with formData
                      onChange={(e) => handleCheckboxChange(e, "policies")}
                      style={{ marginRight: "8px" }}
                    />
                    {policy.name}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.ItemText>No policies found</Dropdown.ItemText>
              )}
            </DropdownButton>
          </div>
          <div className="form-check mb-2 p-0">
            <label>ON/OFF</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={formData.toggleStatus}
                onChange={(e) =>
                  setFormData({ ...formData, toggleStatus: e.target.checked })
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default EditAgentModal;
