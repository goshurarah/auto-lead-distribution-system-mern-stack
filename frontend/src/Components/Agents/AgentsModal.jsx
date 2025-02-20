import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgentsModal = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setEmail("");
    setIsEmailValid(false);
  };

  const handleShow = () => setShow(true);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/invite", { email });
      toast.success("Invitation sent successfully!");
      setEmail("");
      handleClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send invitation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="add-button" onClick={handleShow}>
        Invite People
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
            className="form-control"
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!isEmailValid || loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default AgentsModal;
