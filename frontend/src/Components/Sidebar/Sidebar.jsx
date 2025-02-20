import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import profilepic from "../../Assests/sidebar/profilepic.png";
import setting from "../../Assests/sidebar/setting.png";
import { GET_PROFILE_QUERY } from "../../GraphQl/mutation";
import { useQuery } from "@apollo/client";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("userRole");

  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_PROFILE_QUERY, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data, refetch]);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("activeTab");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const profile = data?.getProfile;
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <Link to="/dashboard" className="setting_link">
        {" "}
        <div className="sidebar_logo">AGENTSLY.AI</div>
      </Link>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? "Close" : "Open"}
      </button>
      <div className="profile">
        <div className="profile-pic-container">
          <div className="profile-initials">
            {getInitials(profile?.firstName, profile?.lastName)}
          </div>
        </div>

        <div className="profile-info">
          <h4 className="profile_name" title={profile?.firstName}>
            {" "}
            {profile?.firstName} {profile?.lastName}
          </h4>
          <p className="profile_email" title={profile?.email}>
            {profile?.email}
          </p>
        </div>
      </div>
      {/* {role === "USER" && ( */}
      <div className="">
        <h4 className="">
          <span>
            <img src={setting} />
          </span>{" "}
          <Link to="/profile-settings" className="setting_link">
            Setting
          </Link>
        </h4>
      </div>
      {/* // )} */}

      <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;
