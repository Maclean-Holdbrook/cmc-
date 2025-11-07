import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/services';
import AdminNavigation from '../../components/AdminNavigation';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminNavigation
        title="Admin Dashboard"
        subtitle={`Welcome back, ${user?.firstName} ${user?.lastName}`}
      />

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
