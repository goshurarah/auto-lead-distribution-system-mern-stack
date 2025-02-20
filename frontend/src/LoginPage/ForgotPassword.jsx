import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { FORGOT_PASSWORD_MUTATION } from "../GraphQl/mutation";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { data, loading, error }] = useMutation(
    FORGOT_PASSWORD_MUTATION
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ variables: { email } });
      navigate("/");
    } catch (err) {
      console.error("GraphQL error:", err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Forgot Password</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {data && (
          <p style={styles.successMessage}>{data.forgotPassword.message}</p>
        )}
        {error && <p style={styles.errorMessage}>Error: {error.message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#333333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    color: "#ffffff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    backgroundColor: "#a6c1ee",
  },
  successMessage: {
    color: "green",
    marginTop: "10px",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
};

export default ForgotPassword;
