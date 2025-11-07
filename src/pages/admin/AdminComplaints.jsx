import { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import { adminAPI } from '../../api/services';
import AdminNavigation from '../../components/AdminNavigation';
import './AdminComplaints.css';

const AdminComplaints = () => {
  const { showSuccess, showError } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [ticketData, setTicketData] = useState({
    workerId: '',
    priority: 'MEDIUM',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [complaintsRes, workersRes] = await Promise.all([
        adminAPI.getComplaints({}),
        adminAPI.getWorkers({}),
      ]);
      setComplaints(complaintsRes.data.complaints);
      setWorkers(workersRes.data.workers);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createTicket({
        complaintId: selectedComplaint.id,
        ...ticketData,
      });
      showSuccess('Ticket created successfully!');
      setShowCreateTicket(false);
      setSelectedComplaint(null);
      setTicketData({ workerId: '', priority: 'MEDIUM', notes: '' });
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: 'badge-pending',
      ASSIGNED: 'badge-assigned',
      IN_PROGRESS: 'badge-progress',
      RESOLVED: 'badge-resolved',
      CLOSED: 'badge-closed',
    };
    return statusClasses[status] || '';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <AdminNavigation title="Manage Complaints" />

      <div className="complaints-container">
        {complaints.length === 0 ? (
          <div className="empty-state">
            <h3>No Complaints Yet</h3>
            <p>When staff members submit complaints, they will appear here.</p>
          </div>
        ) : (
          <div className="complaints-table">
            <table>
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Department</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.staffName}</td>
                  <td>{complaint.department.replace(/_/g, '-')}</td>
                  <td>{complaint.title}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowDetailsModal(true);
                        }}
                        className="action-btn view-btn"
                      >
                        View Details
                      </button>
                      {!complaint.ticket?.id && (
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowCreateTicket(true);
                          }}
                          className="action-btn create-ticket-btn"
                        >
                          Create Ticket
                        </button>
                      )}
                      {complaint.ticket?.id && (
                        <span className="ticket-number">
                          {complaint.ticket.ticketNumber}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateTicket && (
        <div className="modal-overlay" onClick={() => setShowCreateTicket(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Ticket</h2>
            <p className="modal-complaint-title">{selectedComplaint?.title}</p>

            <form onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label>Assign to Worker (Optional)</label>
                <select
                  value={ticketData.workerId}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, workerId: e.target.value })
                  }
                >
                  <option value="">Select Worker (Leave unassigned)</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.firstName} {worker.lastName} ({worker.email})
                    </option>
                  ))}
                </select>
                {workers.length === 0 && (
                  <small style={{ color: '#e74c3c', marginTop: '0.5rem', display: 'block' }}>
                    No workers available. Create a worker account first in the Workers page.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={ticketData.priority}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, priority: e.target.value })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={ticketData.notes}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, notes: e.target.value })
                  }
                  rows="3"
                  placeholder="Add any notes for the worker..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateTicket(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complaint Details</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="complaint-details">
              <div className="detail-section">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Staff Name</label>
                    <p>{selectedComplaint.staffName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <p>{selectedComplaint.department.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Title</label>
                    <p className="complaint-title-text">{selectedComplaint.title}</p>
                  </div>
                </div>

                {selectedComplaint.location && (
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Location</label>
                      <p>{selectedComplaint.location}</p>
                    </div>
                  </div>
                )}

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Status</label>
                    <p>
                      <span className={`badge ${getStatusBadge(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                  <div className="detail-item">
                    <label>Submitted On</label>
                    <p>{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {selectedComplaint.description && (
                  <div className="detail-row">
                    <div className="detail-item full-width">
                      <label>Detailed Description</label>
                      <div className="description-box">
                        {selectedComplaint.description}
                      </div>
                    </div>
                  </div>
                )}

                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div className="detail-row">
                    <div className="detail-item full-width">
                      <label>Uploaded Images ({selectedComplaint.images.length})</label>
                      <div className="images-grid">
                        {selectedComplaint.images.map((image, index) => (
                          <div key={index} className="image-item">
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${image}`}
                              alt={`Complaint ${index + 1}`}
                              onClick={() => window.open(`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${image}`, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedComplaint.ticket?.id && (
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Ticket Number</label>
                      <p className="ticket-number-large">{selectedComplaint.ticket.ticketNumber}</p>
                    </div>
                    {selectedComplaint.ticket.worker?.id && (
                      <div className="detail-item">
                        <label>Assigned To</label>
                        <p>{selectedComplaint.ticket.worker.firstName} {selectedComplaint.ticket.worker.lastName}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowDetailsModal(false)} className="cancel-btn">
                  Close
                </button>
                {!selectedComplaint.ticket?.id && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowCreateTicket(true);
                    }}
                    className="submit-btn"
                  >
                    Create Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
