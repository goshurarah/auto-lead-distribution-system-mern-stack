import React from "react";
import { Modal, Button } from "react-bootstrap";

function EditLead({
  showModalLead,
  onCloseLead,
  formDataLead,
  setFormDataLead,
  onSubmitLead,
}) {
  return (
    <Modal show={showModalLead} onHide={onCloseLead}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmitLead}>
          <label>Lead Name</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataLead.name}
            onChange={(e) =>
              setFormDataLead({ ...formDataLead, name: e.target.value })
            }
            placeholder="Lead Name"
          />
          <label>Phone Number</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataLead.phone}
            onChange={(e) =>
              setFormDataLead({ ...formDataLead, phone: e.target.value })
            }
            placeholder="Phone Number"
          />
          <label>Email</label>
          <input
            type="email"
            className="form-control mb-2"
            value={formDataLead.email}
            onChange={(e) =>
              setFormDataLead({ ...formDataLead, email: e.target.value })
            }
            placeholder="Email"
          />
          <label>Location</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataLead.full_address}
            onChange={(e) =>
              setFormDataLead({ ...formDataLead, full_address: e.target.value })
            }
            placeholder="Location"
          />
          <label>City</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataLead.city}
            onChange={(e) =>
              setFormDataLead({
                ...formDataLead,
                city: e.target.value,
              })
            }
            placeholder="Insurance Type"
          />
          <label>State</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataLead.state}
            onChange={(e) =>
              setFormDataLead({
                ...formDataLead,
                state: e.target.value,
              })
            }
            placeholder="Insurance Type"
          />
          <label>Postal Code</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataLead.postal_code}
            onChange={(e) =>
              setFormDataLead({
                ...formDataLead,
                postal_code: e.target.value,
              })
            }
            placeholder="Insurance Type"
          />
          {/* <input
            type="number"
            className="form-control mb-2"
            value={formDataLead.agentId}
            onChange={(e) =>
              setFormDataLead({ ...formDataLead, agentId: e.target.value })
            }
            placeholder="Agent ID"
          /> */}
          {/* <input
            type="datetime-local"
            className="form-control mb-2"
            value={formDataLead.createdAt}
            onChange={(e) =>
              setFormDataLead({ ...formDataLead, createdAt: e.target.value })
            }
            placeholder="Created At"
          /> */}
          {/* Add any additional fields as needed */}
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default EditLead;
