import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  GET_ALL_LOCATIONS,
  GET_ALL_POLICIES,
  FILTER_CAMPAIGNS_QUERY,
} from "../../../../../GraphQl/mutation";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useQuery, useLazyQuery } from "@apollo/client";
import "./agentsFilter.css";
import { debounce } from "lodash";

function CampiagnFilter({
  show,
  onClose,
  onSubmit,
  setNextClicked,
  nextClicked,
  filteredCurrentPage,
  filterFormData,
  setFilterFormData,
}) {
  const [filterAgents, { loading, data, error }] = useLazyQuery(
    FILTER_CAMPAIGNS_QUERY
  );

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
    name: filterFormData.name || undefined,
    leadsCount: filterFormData.leadsCount
      ? parseInt(filterFormData.leadsCount, 10)
      : undefined,
    targetedAudience: filterFormData.targetedAudience || undefined,
    // toggleStatus: filterFormData.toggleStatus,
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
    debouncedSearch(filterFormData?.name);
  }, [filterFormData?.name]);
  useEffect(() => {
    if (nextClicked === true || !filter || debounceValue) {
      getFilteredData();
    }
  }, [nextClicked !== false, !filter, debounceValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filter = {
      name: filterFormData.name || undefined,
      leadsCount: filterFormData.leadsCount
        ? parseInt(filterFormData.leadsCount, 10)
        : undefined,
      targetedAudience: filterFormData.targetedAudience || undefined,
      toggleStatus: filterFormData.toggleStatus,
    };

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

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Campaign Filter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* Campaign Name */}
          {/* <label>Campaign Name</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Campaign Name"
            name="name"
            value={filterFormData.name || ""}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                name: e.target.value,
              })
            }
          /> */}

          {/* Targeted Audience */}
          <label>Targeted Audience</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Targeted Audience"
            name="targetedAudience"
            value={filterFormData.targetedAudience || ""}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                targetedAudience: e.target.value,
              })
            }
          />

          {/* Leads Count */}
          <label>Leads Count</label>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Leads Count"
            name="leadsCount"
            value={filterFormData.leadsCount || ""}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                leadsCount: e.target.value,
              })
            }
          />

          {/* Toggle Status */}
          <div className="form-check mb-2">
            <label>Toggle Status</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="toggleStatus"
                checked={filterFormData.toggleStatus || false}
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

          {/* Created At */}
          {/* <label>Created At</label>
          <input
            type="date"
            className="form-control mb-2"
            name="createdAt"
            value={filterFormData.createdAt || ""}
            onChange={(e) =>
              setFilterFormData({
                ...filterFormData,
                createdAt: e.target.value,
              })
            }
          /> */}

          {/* Submit Button */}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Applying Filter..." : "Apply Filter"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CampiagnFilter;
