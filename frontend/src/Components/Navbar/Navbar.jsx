import React from "react";
import logo from "../../Assests/navbar/AI_logo.png";
import setting_icon from "../../Assests/navbar/setting_icon.png";
import notification from "../../Assests/navbar/NOTIFICATION.png";
import { GET_PROFILE_QUERY } from "../../GraphQl/mutation";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";
function Navbar() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_PROFILE_QUERY, {
    fetchPolicy: "network-only",
  });
  const role = localStorage.getItem("userRole");

  const profile = data?.getProfile;
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="" />
      </div>
      <div className="navbar-right">
        <div className="navbar-icon">
          <img
            src={notification}
            alt="Notifications"
            className="icon_setting"
          />
        </div>
        <div className="navbar-icon">
        {role === "ADMIN" && (
        <div className="">
          <h4 className="">
         
            <Link to="/profile-settings" className="setting_link">
            <img src={setting_icon} alt="Settings" className="icon_setting" />
            </Link>
          </h4>
        </div>
      )}
          
        </div>
        <div className="navbar-profile">
          <div className="profile-initials"> {getInitials(profile?.firstName, profile?.lastName)}</div>
          <div className="profile-email">{profile?.firstName} {profile?.lastName}
            <div>{profile?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
