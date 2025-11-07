import { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { adminAPI } from '../../api/services';
import AdminNavigation from '../../components/AdminNavigation';
import './AdminWorkers.css';

const AdminWorkers = () => {
  const { showSuccess, showError } = useToast();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [workerData, setWorkerData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const response = await adminAPI.getWorkers({});
      setWorkers(response.data.workers);
    } catch (error) {
      console.error('Failed to load workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createWorker(workerData);
      showSuccess('Worker created successfully!');
      setShowCreateModal(false);
      setWorkerData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
      });
      loadWorkers();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create worker');
    }
  };

  const handleDeleteClick = (worker) => {
    setWorkerToDelete(worker);
    setShowDeleteConfirm(true);
  };

  const handleDeleteWorker = async () => {
    try {
      await adminAPI.deleteWorker(workerToDelete.id);
      showSuccess('Worker deleted successfully!');
      loadWorkers();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to delete worker');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <AdminNavigation title="Manage Workers" />

      <div className="workers-container">
        <div className="workers-header">
          <h2>All Workers</h2>
          <button onClick={() => setShowCreateModal(true)} className="add-worker-btn">
            + Add Worker
          </button>
        </div>

        <div className="workers-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.firstName} {worker.lastName}</td>
                  <td>{worker.email}</td>
                  <td>{worker.phoneNumber || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${worker.isActive ? 'active' : 'inactive'}`}>
                      {worker.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{worker.ticket_count || 0}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteClick(worker)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Worker</h2>

            <form onSubmit={handleCreateWorker}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={workerData.firstName}
                    onChange={(e) => setWorkerData({ ...workerData, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={workerData.lastName}
                    onChange={(e) => setWorkerData({ ...workerData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={workerData.email}
                  onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={workerData.password}
                  onChange={(e) => setWorkerData({ ...workerData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={workerData.phoneNumber}
                  onChange={(e) => setWorkerData({ ...workerData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteWorker}
        title="Delete Worker"
        message={`Are you sure you want to delete ${workerToDelete?.firstName} ${workerToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminWorkers;
