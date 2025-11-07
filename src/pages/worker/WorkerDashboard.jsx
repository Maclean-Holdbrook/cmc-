import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { workerAPI } from '../../api/services';
import './WorkerDashboard.css';

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    message: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        workerAPI.getTickets({}),
        workerAPI.getStats(),
      ]);
      setTickets(ticketsRes.data.tickets);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      await workerAPI.updateTicketStatus(selectedTicket.id, updateData);
      showSuccess('Ticket updated successfully!');
      setShowUpdateModal(false);
      setSelectedTicket(null);
      setUpdateData({ status: '', message: '' });
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update ticket');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/worker/login');
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
    <div className="worker-dashboard">
      <div className="dashboard-header worker-header">
        <div className="header-content">
          <h1>Worker Dashboard</h1>
          <p>Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Slide Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)}></div>
        <div className="drawer-content">
          <div className="drawer-header">
            <h3>Menu</h3>
            <button
              className="close-drawer"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="drawer-nav">
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="drawer-nav-btn active"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="drawer-nav-btn logout"
            >
              🚪 Logout
            </button>
          </nav>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-info">
            <h3>{stats?.total || 0}</h3>
            <p>Total Tickets</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>{stats?.pending || 0}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">🔧</div>
          <div className="stat-info">
            <h3>{stats?.inProgress || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon resolved">✅</div>
          <div className="stat-info">
            <h3>{stats?.resolved || 0}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>

      <div className="tickets-container">
        <h2>My Tickets</h2>
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <span className="ticket-number">{ticket.ticketNumber}</span>
                <span className={`badge ${getStatusBadge(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <h3>{ticket.complaint.title}</h3>
              <p className="ticket-description">{ticket.complaint.description}</p>

              <div className="ticket-details">
                <div className="detail-item">
                  <strong>Department:</strong> {ticket.complaint.department.replace(/_/g, '-')}
                </div>
                <div className="detail-item">
                  <strong>Priority:</strong>
                  <span className={`priority-${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Location:</strong> {ticket.complaint.location || 'N/A'}
                </div>
                <div className="detail-item">
                  <strong>Staff:</strong> {ticket.complaint.staffName}
                </div>
              </div>

              {ticket.complaint.images && ticket.complaint.images.length > 0 && (
                <div className="ticket-images">
                  {ticket.complaint.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5000${img}`}
                      alt={`Issue ${idx + 1}`}
                      className="ticket-image"
                    />
                  ))}
                </div>
              )}

              {ticket.notes && (
                <div className="ticket-notes">
                  <strong>Admin Notes:</strong> {ticket.notes}
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedTicket(ticket);
                  setUpdateData({ status: ticket.status, message: '' });
                  setShowUpdateModal(true);
                }}
                className="update-btn"
              >
                Update Ticket
              </button>
            </div>
          ))}
        </div>
      </div>

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Ticket</h2>
            <p className="modal-ticket-number">{selectedTicket?.ticketNumber}</p>

            <form onSubmit={handleUpdateTicket}>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={updateData.status}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, status: e.target.value })
                  }
                  required
                >
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div className="form-group">
                <label>Update Message *</label>
                <textarea
                  value={updateData.message}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, message: e.target.value })
                  }
                  rows="4"
                  placeholder="Describe what you've done or the current status..."
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
