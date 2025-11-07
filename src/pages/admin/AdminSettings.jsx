import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { adminAPI } from '../../api/services';
import AdminNavigation from '../../components/AdminNavigation';
import './AdminDashboard.css';
import './AdminSettings.css';

const AdminSettings = () => {
  const { user, login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const [newAdminData, setNewAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const response = await adminAPI.updateProfile(profileData);
      // Backend returns { status: 'success', data: { admin } }
      login(response.data.admin, 'ADMIN', localStorage.getItem('token'));
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoadingPassword(true);

    try {
      await adminAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (newAdminData.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoadingAdmin(true);

    try {
      await adminAPI.register(newAdminData);
      showSuccess('New admin account created successfully!');
      setNewAdminData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: ''
      });
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create admin account');
    } finally {
      setLoadingAdmin(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavigation
        title="Admin Settings"
        subtitle="Manage your account settings"
      />

      <div className="settings-container">
        {/* Profile Settings */}
        <div className="settings-card">
          <h2>Profile Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loadingProfile}>
              {loadingProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="settings-card">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loadingPassword}>
              {loadingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Create New Admin */}
        <div className="settings-card">
          <h2>Create New Admin Account</h2>
          <p className="section-description">Create a new administrator account for another person</p>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adminFirstName">First Name</label>
                <input
                  type="text"
                  id="adminFirstName"
                  value={newAdminData.firstName}
                  onChange={(e) => setNewAdminData({ ...newAdminData, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminLastName">Last Name</label>
                <input
                  type="text"
                  id="adminLastName"
                  value={newAdminData.lastName}
                  onChange={(e) => setNewAdminData({ ...newAdminData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="adminEmail">Email Address</label>
              <input
                type="email"
                id="adminEmail"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminPassword">Password</label>
              <input
                type="password"
                id="adminPassword"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminPhone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="adminPhone"
                value={newAdminData.phoneNumber}
                onChange={(e) => setNewAdminData({ ...newAdminData, phoneNumber: e.target.value })}
                placeholder="+1234567890"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loadingAdmin}>
              {loadingAdmin ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
