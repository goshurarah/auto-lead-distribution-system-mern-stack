import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

// Define the mutation
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
    }
  }
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, { data, loading, error }] = useMutation(
    RESET_PASSWORD_MUTATION
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ variables: { token, newPassword } });
      navigate("/");
    } catch (err) {
      console.error("GraphQL error:", err.message);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h2 className="heading">Reset Password</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            className="input"
          />
          <button type="submit" disabled={loading} className="button">
            {loading ? "Submitting..." : "Reset Password"}
          </button>
        </form>
        {data && (
          <p className="success-message">{data.resetPassword.message}</p>
        )}
        {error && <p className="error-message">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
