import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import {
  GET_ALL_LOCATIONS,
  GET_ALL_POLICIES,
  FILTER_AGENTS,
} from "../../../../../GraphQl/mutation";

import { useQuery, useLazyQuery } from "@apollo/client";
import "./agentsFilter.css";
import { debounce } from "lodash";

function AgentsFilter({
  show,
  onClose,
  onSubmit,
  setNextClicked,
  nextClicked,
  filteredCurrentPage,
  filterFormData,
  setFilterFormData,
}) {
  const [filterAgents, { loading, data, error }] = useLazyQuery(FILTER_AGENTS);

  const { loading: loadingLocations, data: locationsData } =
    useQuery(GET_ALL_LOCATIONS);
  const { loading: loadingPolicies, data: policiesData } =
    useQuery(GET_ALL_POLICIES);

  // State to track selected locations and policies
  const [selectedLocations, setSelectedLocations] = useState(
    filterFormData.locationIds
  );
  const [selectedPolicies, setSelectedPolicies] = useState(
    filterFormData.policyIds
  );

  // Search term for locations
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceValue, setDebounceValue] = useState("");

  // Pagination state
  // const [currentPage, setCurrentPage] = useState(1); // Page state to manage current page
  const [itemsPerPage] = useState(50); // You can modify this if needed

  const handleCheckboxChangeLocation = (event) => {
    const value = event.target.value;
    const updatedLocations = selectedLocations.includes(value)
      ? selectedLocations.filter((id) => id !== value)
      : [...selectedLocations, value];

    setSelectedLocations(updatedLocations);
    setFilterFormData({ ...filterFormData, locationIds: updatedLocations });
  };

  const handleCheckboxChangePolicy = (event) => {
    const value = event.target.value;
    const updatedPolicies = selectedPolicies.includes(value)
      ? selectedPolicies.filter((id) => id !== value)
      : [...selectedPolicies, value];

    setSelectedPolicies(updatedPolicies);
    setFilterFormData({ ...filterFormData, policyIds: updatedPolicies });
  };

  const filteredLocations = locationsData?.getAllLocations?.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filter = {
    email: filterFormData.email || undefined,
    firstName: filterFormData.firstName || undefined,
    lastName: filterFormData.lastName || undefined,
    role: filterFormData.role || undefined,
    phoneNumber: filterFormData.phoneNumber || undefined,
    npnNumber: filterFormData.npnNumber || undefined,
    licenseNo: filterFormData.licenseNo || undefined,
    // toggleStatus: filterFormData.toggleStatus || undefined,
    leadWeight: filterFormData.leadWeight
      ? parseInt(filterFormData.leadWeight, 10)
      : undefined,
    totalLeadCap: filterFormData.totalLeads
      ? parseInt(filterFormData.totalLeads, 10)
      : undefined,
  };

  const getFilteredData = async () => {
    try {
      const { data: queryData } = await filterAgents({
        variables: {
          filter,
          page: filteredCurrentPage,
          perPage: itemsPerPage,
        },
      });

      if (queryData) {
        onSubmit(queryData); // Pass the query response to the parent component
      }

      setSelectedLocations([]);
      setSelectedPolicies([]);
      setSearchTerm("");
      setNextClicked(false);

      onClose(); // Close the modal
    } catch (err) {
      console.error("Error while fetching filter agents: ", err);
    }
  };

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setFilterFormData((prevData) => ({
        ...prevData,
        firstName: searchValue || undefined, // Clear if empty
      }));
      setDebounceValue(searchValue);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSearch(filterFormData.firstName);
  }, [filterFormData.firstName]); // Add debouncedSearch to dependencies

  useEffect(() => {
    if (nextClicked === true || !filter || debounceValue) {
      getFilteredData();
    }
  }, [nextClicked !== false, !filter, debounceValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filter = {
      email: filterFormData.email || undefined,
      firstName: filterFormData.firstName || undefined,
      lastName: filterFormData.lastName || undefined,
      role: filterFormData.role || undefined,
      phoneNumber: filterFormData.phoneNumber || undefined,
      npnNumber: filterFormData.npnNumber || undefined,
      monthlyCap: parseInt(filterFormData.monthlyCap) || undefined,
      remainingCap: parseInt(filterFormData.remainingCap) || undefined,
      priority: parseInt(filterFormData.priority) || undefined,
      weight: parseInt(filterFormData.weight) || undefined,
      dailyCap: parseInt(filterFormData.dailyCap) || undefined,
      globalCap: parseInt(filterFormData.globalCap) || undefined,
      licenseNo: filterFormData.licenseNo || undefined,
      toggleStatus: filterFormData.toggleStatus,
      leadWeight: filterFormData.leadWeight
        ? parseInt(filterFormData.leadWeight, 10)
        : undefined,
      totalLeadCap: filterFormData.totalLeads
        ? parseInt(filterFormData.totalLeads, 10)
        : undefined,
      locations: filterFormData.locationIds.map((id) => parseInt(id, 10)), // Ensure integers
      policies: filterFormData.policyIds.map((id) => parseInt(id, 10)), // Ensure integers
    };
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    try {
      const { data: queryData } = await filterAgents({
        variables: {
          filter: cleanedFilter,
          page: filteredCurrentPage,
          perPage: itemsPerPage,
        },
      });

      if (queryData) {
        onSubmit(queryData); // Pass the query response to the parent component
      }

      setSelectedLocations([]);
      setSelectedPolicies([]);
      setSearchTerm("");
      setNextClicked(false);

      onClose(); // Close the modal
    } catch (err) {
      console.error("Error while fetching filter agents: ", err);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <label>Location</label>
          <DropdownButton
            id="dropdown-basic-button"
            title="Select Locations"
            variant="secondary"
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    value={location.id}
                    checked={selectedLocations.includes(location.id)}
                    onChange={handleCheckboxChangeLocation}
                    style={{ marginRight: "8px" }}
                  />
                  {location.name}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.ItemText>No locations found</Dropdown.ItemText>
            )}
          </DropdownButton>

          <label>Policy</label>
          <DropdownButton
            id="dropdown-basic-button"
            title="Select Product"
            variant="secondary"
          >
            {!loadingPolicies &&
              policiesData?.getAllPolicies?.map((policy) => (
                <Dropdown.Item
                  key={policy.id}
                  as="label"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    value={policy.id}
                    checked={selectedPolicies.includes(policy.id)}
                    onChange={handleCheckboxChangePolicy}
                    style={{ marginRight: "8px" }}
                  />
                  {policy.name}
                </Dropdown.Item>
              ))}
          </DropdownButton>
          {/* <label>First Name</label> */}
          {/* <input
            type="text"
            className="form-control mb-2"
            placeholder="First Name"
            name="firstName"
            value={filterFormData.firstName}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                firstName: e.target.value,
              })
            }
          /> */}
          <label>Last Name</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Last Name"
            name="lastName"
            value={filterFormData.lastName}
            onChange={(e) =>
              setFilterFormData({ ...filterFormData, lastName: e.target.value })
            }
          />
          <label>Npn</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="NPN"
            name="npnNumber"
            value={filterFormData.npnNumber}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                npnNumber: e.target.value,
              })
            }
          />
          <label>Global Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Global Cap"
            name="globalCap"
            value={filterFormData.globalCap}
            min="0"
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                globalCap: e.target.value,
              })
            }
          />
          <label>Monthly Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Monthly Cap"
            name="monthlyCap"
            value={filterFormData.monthlyCap}
            min="0"
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                monthlyCap: e.target.value,
              })
            }
          />
          <label>Daily Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Daily Cap"
            name="dailyCap"
            value={filterFormData.dailyCap}
            min="0"
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                dailyCap: e.target.value,
              })
            }
          />
          <label>Remaining Cap</label>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Remaining Cap"
            name="remainingCap"
            value={filterFormData.remainingCap}
            min="0"
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                remainingCap: e.target.value,
              })
            }
          />
          <label>Priority</label>
          <select
            className="form-control mb-2"
            value={filterFormData.priority || "0"}
            onChange={(e) =>
              setFilterFormData({ ...filterFormData, priority: e.target.value })
            }
          >
            {[...Array(11)].map((_, index) => (
              <option key={index + 0} value={index + 0}>
                {index + 0}
              </option>
            ))}
          </select>
          <label>Weight</label>
          <select
            className="form-control mb-2"
            value={filterFormData.weight || "0"}
            onChange={(e) =>
              setFilterFormData({ ...filterFormData, weight: e.target.value })
            }
          >
            {[...Array(6)].map((_, index) => (
              <option key={index + 0} value={index + 0}>
                {index + 0}
              </option>
            ))}
          </select>

          {/* <label>Total Leads</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Total Leads"
            name="totalLeads"
            value={filterFormData.totalLeads}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                totalLeads: e.target.value,
              })
            }
          /> */}

          <div className="form-check mb-2 p-0">
            <label>ON/OFF</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="toggleStatus"
                checked={filterFormData.toggleStatus}
                onChange={(e) =>
                  setFilterFormData({
                    ...filterFormData,
                    toggleStatus: e.target.checked,
                  })
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Search Filter"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AgentsFilter;
