import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ghlSignIn.css";
import { Link, useNavigate } from "react-router-dom";
const GhlSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  // const accounts = [
  //   { name: "Rovic Baliko", email: "villarovrovic@gmail.com" },
  //   { name: "Rovic Baliko", email: "villarovrovic@gmail.com" },
  //   { name: "Rovic Baliko", email: "villarovrovic@gmail.com" },
  //   { name: "Rovic Baliko", email: "villarovrovic@gmail.com" },
  // ];
  const handleConnectClick = () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    axios
      .get("/api/connect-ghl", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.redirectURL) {
          // Redirect to the URL from the response
          window.location.href = response.data.redirectURL;
        } else {
          console.error("Redirect URL not found in the response");
        }
      })
      .catch((error) => {
        setError("There was an error connecting to GHL.");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    GetLocationDetail();
  }, []);

  const GetLocationDetail = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    await axios
      .get("api/locations-detail", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("API Response 21:", response.data);
        if (response.data.company) {
          // Wrap the company object in an array and update state
          setAccounts([response.data.company]);
        } else {
          console.error("Company data is missing from the response.");
        }
      })
      .catch((error) => {
        setError("There was an error retrieving location details.");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("activeTab");
    navigate("/");
  };
  return (
    <>
      <header className="header">
        <div className="header_wrap">
        <h2 className="top_heading">AGENTSLY.AI</h2>
        <p className=""><button onClick={handleLogout}>Sign Out</button></p>
        </div>
      </header>
      <div className="container">
        {/* Header */}

        {/* Instructions Section */}
        <div className="instructions">
          <h3>Important Note</h3>
          <p>
            Follow these steps, if you have any error while connecting to the
            GHL account:
          </p>
          <ol>
            <li>
              Please remove the cookie of the GHL connecting page by using a{" "}
              <a href="#">cookie remover Chrome extension</a>.
            </li>
            <li>Try to reconnect to the GHL account.</li>
          </ol>
        </div>
        {/* Connect to GHL Account */}
        <div className="connect-section">
          <button className="connect-button_ghl" onClick={handleConnectClick}>
            Connect to GHL Account
          </button>
          <p className="p-0 m-0">OR</p>
          <button className="create-group-button" disabled>
            Create a new group (Coming Soon)
          </button>
        </div>
        {/* Account List */}
        <div className="account-list">
          {/* Display loading state */}
          {loading && <p>Loading...</p>}

          {/* Render account list */}
          {accounts?.length > 0 ? (
            accounts?.map((account, index) => (
              <div key={index} className="account-item">
                <div className="account-info">
                  <img
                    src="https://via.placeholder.com/40"
                    alt={`${account.name}`}
                    className="account-avatar"
                  />
                  <div>
                    <p className="account-name">{account.name || "N/A"}</p>
                    <p className="account-email">{account.email || "N/A"}</p>
                  </div>
                </div>
                <div className="account-actions">
                  <Link to="/dashboard">
                    <button className="connect-button">Connect</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No accounts available.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default GhlSignIn;
