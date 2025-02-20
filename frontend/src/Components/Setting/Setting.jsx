import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { GET_PROFILE_QUERY } from "../../GraphQl/mutation";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_AGENT } from "../../GraphQl/mutation"; // Import the mutation
import { ToastContainer, toast } from "react-toastify";
import {
  GET_ALL_LOCATIONS,
  GET_ALL_POLICIES,
  // GET_ALL_PLANS,
} from "../../GraphQl/mutation";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./Setting.css";
import { useNavigate } from "react-router-dom";

function Setting() {
  const navigate = useNavigate(); // Initialize navigate
  const role = localStorage.getItem("userRole");

  const { data, loading, error, refetch } = useQuery(GET_PROFILE_QUERY, {
    fetchPolicy: "network-only",
  });
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  const [updateAgent] = useMutation(UPDATE_AGENT); // Use the mutation hook

  // Initialize form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    npnNumber: "",
    licenseNo: "",
    webhookURL: "",
    locations: [],
    policies: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [locationCheck, setLocationCheck] = useState({});
  const [policyCheck, setPolicyCheck] = useState({});
  // Queries to fetch locations, policies, and plans
  const { loading: loadingLocations, data: locationsData } =
    useQuery(GET_ALL_LOCATIONS);
  const { loading: loadingPolicies, data: policiesData } =
    useQuery(GET_ALL_POLICIES);
  const filteredLocations =
    locationsData?.getAllLocations?.filter((location) =>
      location.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
    ) || [];

  const filteredPolicies =
    policiesData?.getAllPolicies?.filter((policy) =>
      policy.name.toLowerCase().includes(policySearchTerm.toLowerCase())
    ) || [];

  // const handleCheckboxChange = (e, type, id) => {
  //   setLocationCheck((prev) => ({
  //     ...prev,
  //     [id]: checked, // Set the checkbox state for the current location ID
  //   }));

  //   setPolicyCheck((prev) => ({
  //     ...prev,
  //     [id]: checked, // Set the checkbox state for the current location ID
  //   }));

  //   const { value, checked } = e.target;
  //   const updatedValues = checked
  //     ? [...formData[type], parseInt(value)] // Add value if checked
  //     : formData[type].filter((val) => val !== parseInt(value));

  //   setFormData({
  //     ...formData,
  //     [type]: updatedValues,
  //   });
  // };

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

  // const handleChange = (e) => {
  //   const { id, value, name } = e.target;
  //      if (name === "locations" || name === "policies") {
  //     const updatedValues = Array.from(e.target.selectedOptions, (option) =>
  //       parseInt(option.value)
  //     ); // Ensure IDs are integers
  //     setFormData({
  //       ...formData,
  //       [name]: updatedValues,
  //     });
  //   }
  //   else{
  //   setFormData({
  //     ...formData,
  //     [id]: value,
  //   });
  // }
  // };
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
  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "locations" || name === "policies") {
  //     const updatedValues = Array.from(e.target.selectedOptions, (option) =>
  //       parseInt(option.value)
  //     ); // Ensure IDs are integers
  //     setFormData({
  //       ...formData,
  //       [name]: updatedValues,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };
  // Update form data when profile data is fetched
  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data?.getProfile?.firstName || "",
        lastName: data?.getProfile?.lastName || "",
        email: data?.getProfile?.email || "",
        phoneNumber: data?.getProfile?.phoneNumber || "",
        npnNumber: data?.getProfile?.npnNumber || "",
        licenseNo: data?.getProfile?.licenseNo || "",
        webhookURL: data?.getProfile?.webhook_url || "",
        locations:
          [
            ...new Set(
              data?.getProfile?.locations?.map((loc) => parseInt(loc.id))
            ),
          ] || [],
        policies:
          [
            ...new Set(
              data?.getProfile?.policies?.map((pol) => parseInt(pol.id))
            ),
          ] || [],
      });

      // Initialize checkbox state
      const initialLocationCheck = {};
      const initialPolicyCheck = {};

      data?.getProfile?.locations?.forEach((loc) => {
        initialLocationCheck[loc.id] = true;
      });

      data?.getProfile?.policies?.forEach((pol) => {
        initialPolicyCheck[pol.id] = true;
      });

      setLocationCheck(initialLocationCheck);
      setPolicyCheck(initialPolicyCheck);
    }
  }, [data]);

  // Handle input field change

  // Handle form submission to update profile
  const handleSave = async () => {
    try {
      await updateAgent({
        variables: {
          id: data?.getProfile?.id,
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            npnNumber: formData.npnNumber,
            licenseNo: formData.licenseNo,
            webhook_url: formData.webhookURL,
            locations: formData.locations.map((id) => parseInt(id, 10)), // Ensure integers
            policies: formData.policies.map((id) => parseInt(id, 10)), // Ensure integers
            // locations: formData.locations,
            // policies: formData.policies,
          },
        },
      });
      toast.success("Profile updated successfully!");

      // Reset form fields after successful update

      // Refetch profile data after update
      refetch();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="setting-main">
      <Sidebar />
      <div className="row m-0 p-0 w-100">
        <div className="col-12 w-100 p-5">
          <h1>
            <span onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
              <i className="fa fa-arrow-left back_arow"></i>{" "}
              {/* FontAwesome icon for back */}
            </span>
            Profile Settings
          </h1>
          <div className="row mt-3">
            <div className="col-3">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="col-3">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-3">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                disabled
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-3">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                className="form-control"
                placeholder="Enter your phone number"
                value={formData.phoneNumber || "N/A"}
                onChange={handleChange}
              />
            </div>
          </div>
          {role === "USER" && (
            <div className="row mt-3">
              <div className="col-3">
                <label htmlFor="npnNumber">NPN</label>
                <input
                  type="text"
                  id="npnNumber"
                  className="form-control"
                  placeholder="Enter your NPN"
                  value={formData.npnNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-3">
                <label htmlFor="licenseNo">License Number</label>
                <input
                  type="text"
                  id="licenseNo"
                  className="form-control"
                  placeholder="Enter your license number"
                  value={formData.licenseNo}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {role === "USER" && (
            <div className="row mt-3">
              <div className="col-3">
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
                      value={locationSearchTerm}
                      onChange={(e) => setLocationSearchTerm(e.target.value)}
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
                            formData?.locations?.includes(
                              parseInt(location.id)
                            ) || false
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
              </div>

              <div className="col-3">
                <DropdownButton
                  id="dropdown-policy"
                  title="Select Policies"
                  variant="secondary"
                  className="text-start"
                >
                  <Dropdown.ItemText>
                    <input
                      type="text"
                      placeholder="Search Policies"
                      value={policySearchTerm}
                      onChange={(e) => setPolicySearchTerm(e.target.value)}
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
            </div>
          )}
          {role === "USER" && (
            <div className="row mt-3">
              <div className="col-6">
                <label htmlFor="webHookURL">Web Hook URL</label>
                <input
                  type="text"
                  id="webHookURL"
                  className="form-control"
                  placeholder="Enter your web hook URL"
                  value={formData.webhookURL}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          <div className="mt-3">
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Setting;
