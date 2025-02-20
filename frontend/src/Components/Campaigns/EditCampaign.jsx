import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function EditCampaign({
  showModalCampaign,
  onCloseCampaign,
  formDataCampaign,
  setFormDataCampaign,
  onSubmitCampaign,
}) {
  return (
    <Modal show={showModalCampaign} onHide={onCloseCampaign}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Campaign</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmitCampaign}>
          <label>Campaign Name</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataCampaign.name}
            onChange={(e) =>
              setFormDataCampaign({ ...formDataCampaign, name: e.target.value })
            }
            placeholder="Campaign Name"
          />
          <label>Location</label>
          <input
            type="text"
            className="form-control mb-2"
            value={formDataCampaign.targetedAudience}
            onChange={(e) =>
              setFormDataCampaign({
                ...formDataCampaign,
                targetedAudience: e.target.value,
              })
            }
            placeholder="Location"
          />
          <label>Leads Count</label>
          <input
            type="number"
            className="form-control mb-2"
            value={formDataCampaign.leadsCount}
            onChange={(e) =>
              setFormDataCampaign({
                ...formDataCampaign,
                leadsCount: e.target.value,
              })
            }
            placeholder="Leads Count"
          />
          {/* <label>Created At</label>
          <input
            type="datetime-local"
            className="form-control mb-2"
            value={new Date(parseInt(formDataCampaign.createdAt)).toISOString().slice(0, 16)} // Formatting for datetime-local
            onChange={(e) =>
              setFormDataCampaign({ ...formDataCampaign, createdAt: new Date(e.target.value).getTime() })
            }
          /> */}
          {/* <label>End Date</label>
          <input
            type="datetime-local"
            className="form-control mb-2"
            value={new Date(parseInt(formDataCampaign.endTime)).toISOString().slice(0, 16)} // Formatting for datetime-local
            onChange={(e) =>
              setFormDataCampaign({ ...formDataCampaign, endTime: new Date(e.target.value).getTime() })
            }
          /> */}
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formDataCampaign.toggleStatus}
              onChange={(e) =>
                setFormDataCampaign({
                  ...formDataCampaign,
                  toggleStatus: e.target.checked,
                })
              }
            />
            <span className="slider"></span>
          </label>
          <label>Status</label>
          {/* <select
            className="form-control mb-2"
            value={formDataCampaign.toggleStatus}
            onChange={(e) =>
              setFormDataCampaign({
                ...formDataCampaign,
                toggleStatus: e.target.value === "true",
              })
            }
          >
            <option value={true}>On</option>
            <option value={false}>Off</option>
          </select> */}
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default EditCampaign;
