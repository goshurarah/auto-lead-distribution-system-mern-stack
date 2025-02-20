import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_MUTATION } from "../GraphQl/mutation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ variables: { email, password } });
      // console.log("Login response:", response);
      toast.success("Logged out successfully!");
      // const role = response.data?.login?.user?.role;
      const role = response.data?.login?.agent?.role;

      // console.log(role); 
      
      const token = response.data?.login?.token;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (role) {
        localStorage.setItem("userRole", role);
      }
      if (token && role ==="ADMIN") {
        navigate("/dashboard");
      } 
      else if (token && role ==="USER") {
        navigate("/ghl-app");
      } 
      // else if(token && role === "ADMIN"){
      //   navigate("/admin-dashboard");
      // }
      // else{
      //   navigate("/login");
      // }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <header className="header">
        <h2 className="top_heading">AGENTSLY.AI</h2>
      </header>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login_heading">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label_form">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="label_form">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="login-footer">
          <Link to="/forgot-password">
            <a href="/forgot-password" className="a_forgot">
              Forgot password?
            </a>
            </Link>

            <p>
              Don’t have an account?{" "}
              <Link to="/signup">
                <a href="/sign-up">Sign up</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
