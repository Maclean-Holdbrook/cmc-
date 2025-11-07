import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/services';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-nav">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="nav-btn active"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/admin/complaints')}
          className="nav-btn"
        >
          Complaints
        </button>
        <button
          onClick={() => navigate('/admin/workers')}
          className="nav-btn"
        >
          Workers
        </button>
        <button
          onClick={() => navigate('/admin/settings')}
          className="nav-btn"
        >
          Settings
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon complaints">📋</div>
          <div className="stat-info">
            <h3>{stats?.stats.complaints.total || 0}</h3>
            <p>Total Complaints</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>{stats?.stats.complaints.pending || 0}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">🔧</div>
          <div className="stat-info">
            <h3>{stats?.stats.complaints.inProgress || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon resolved">✅</div>
          <div className="stat-info">
            <h3>{stats?.stats.complaints.resolved || 0}</h3>
            <p>Resolved</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon workers">👷</div>
          <div className="stat-info">
            <h3>{stats?.stats.workers.total || 0}</h3>
            <p>Total Workers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-workers">✨</div>
          <div className="stat-info">
            <h3>{stats?.stats.workers.active || 0}</h3>
            <p>Active Workers</p>
          </div>
        </div>
      </div>

      {stats?.complaintsByDepartment && (
        <div className="department-stats">
          <h2>Complaints by Department</h2>
          <div className="department-list">
            {stats.complaintsByDepartment.map((dept) => (
              <div key={dept.department} className="department-item">
                {dept.department.replace(/_/g, '-')}-{dept._count}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
