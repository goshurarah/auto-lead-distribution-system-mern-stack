import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { useMutation, useQuery } from "@apollo/client";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { SIGNUP_MUTATION } from "../GraphQl/mutation";
import {
  GET_ALL_LOCATIONS,
  GET_ALL_POLICIES,
  // GET_ALL_PLANS,
} from "../GraphQl/mutation";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    npnNumber: "",
    licenseNo: "",
    locationIds: [],
    policyIds: [],
    // planIds: [], // Make sure it's an array, even if it's a single plan selection
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [locationCheck, setLocationCheck] = useState({});
  const [policyCheck, setPolicyCheck] = useState({});

  // Queries to fetch locations, policies, and plans
  const { loading: loadingLocations, data: locationsData } =
    useQuery(GET_ALL_LOCATIONS);
  const { loading: loadingPolicies, data: policiesData } =
    useQuery(GET_ALL_POLICIES);
  // const { loading: loadingPlans, data: plansData } = useQuery(GET_ALL_PLANS);

  // Mutation for sign up
  const [signUp, { loading, error, data }] = useMutation(SIGNUP_MUTATION);
  const filteredLocations =
    locationsData?.getAllLocations?.filter((location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredPolicies =
    policiesData?.getAllPolicies?.filter((policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  const handleCheckboxChange = (e, type, locationId, policyId) => {
    setLocationCheck((prev) => ({
      ...prev,
      [locationId]: checked, // Set the checkbox state for the current location ID
    }));

    setPolicyCheck((prev) => ({
      ...prev,
      [policyId]: checked, // Set the checkbox state for the current location ID
    }));

    const { value, checked } = e.target;
    const updatedValues = checked
      ? [...formData[type], parseInt(value)] // Add value if checked
      : formData[type].filter((val) => val !== parseInt(value));

    setFormData({
      ...formData,
      [type]: updatedValues,
    });
  };

  console.log(formData, "FD");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "locationIds" || name === "policyIds") {
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
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({
        variables: {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          npnNumber: formData.npnNumber,
          licenseNo: formData.licenseNo,
          locationIds: formData.locationIds.map((id) => parseInt(id, 10)), // Ensure integers
          policyIds: formData.policyIds.map((id) => parseInt(id, 10)), // Ensure integers
          // planIds: formData.planIds.map(id => parseInt(id, 10)), // Plan IDs are now an array, even if one plan is selected
        },
      });
      navigate("/");
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        npnNumber: "",
        licenseNo: "",
        locationIds: [],
        policyIds: [],
        // planIds: [], // Reset the selected plans
      });
    } catch (err) {
      console.error("Error creating account", err);
    }
  };

  return (
    <div className="signup-container">
      <header className="header">
        <h2>AGENTSLY.AI</h2>
      </header>
      <div className="signup-form-container">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            className="input_signup"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            className="input_signup"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            className="input_signup"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input_signup"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="input_signup"
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            className="input_signup"
            type="text"
            name="npnNumber"
            placeholder="NPN Number"
            value={formData.npnNumber}
            onChange={handleChange}
            required
          />
          <input
            className="input_signup"
            type="text"
            name="licenseNo"
            placeholder="License Number"
            value={formData.licenseNo}
            onChange={handleChange}
            required
          />

          {/* Location Select with default "Select" option */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </Dropdown.ItemText>
            {!loadingLocations && filteredLocations?.length > 0 ? (
              filteredLocations?.map((location) => (
                <Dropdown.Item
                  key={location.id}
                  as="label"
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                >
                  <input
                    type="checkbox"
                    value={location.id} // Pass location ID as value
                    checked={locationCheck[location.id] || false} // Dynamic checked state
                    onChange={(e) =>
                      handleCheckboxChange(e, "locationIds", location.id, "")
                    }
                    style={{ marginRight: "8px" }}
                  />
                  {location.name}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.ItemText>No locations found</Dropdown.ItemText>
            )}
          </DropdownButton>

          {/* Policy Dropdown */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </Dropdown.ItemText>
            {!loadingPolicies && filteredPolicies?.length > 0 ? (
              filteredPolicies?.map((policy) => (
                <Dropdown.Item
                  key={policy.id}
                  as="label"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    value={policy.id}
                    checked={policyCheck[policy.id] || false} // Dynamic checked state
                    onChange={(e) =>
                      handleCheckboxChange(e, "policyIds", "", policy.id)
                    }
                    style={{ marginRight: "8px" }}
                  />
                  {policy.name}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.ItemText>No policies found</Dropdown.ItemText>
            )}
          </DropdownButton>

          {/* Submit Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create an account"}
          </button>

          {error && (
            <p className="error">Error creating account. Please try again.</p>
          )}
          {data && <p className="success">Account created successfully!</p>}
        </form>
        <p className="disclaimer">
          By clicking “Create account” above, you acknowledge that you will
          receive updates from the Agentsly Team and that you have read,
          understood, and agreed to Agentsly library's{" "}
          <a href="#">Terms & Conditions</a>,{" "}
          <a href="#">Licensing Agreement</a>, and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
        <div className="login-link">
          Already have an account?
          <Link to="/">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
