import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/services';
import './Login.css';
import cocoaImage3 from '../../images/cocoa image 3.jpg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // No auto-redirect on error - user stays on login page

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't submit if already loading
    if (loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login(email, password);
      // Backend returns { status: 'success', data: { admin, token, role } }
      const { admin, token, role } = response.data;
      login(admin, role, token);

      // Redirect to intended page or default to dashboard
      const intendedPage = location.state?.from || '/admin/dashboard';
      navigate(intendedPage, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      // Show error inline - NO MODAL, NO REDIRECT
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container admin-login" style={{ backgroundImage: `url(${cocoaImage3})` }}>
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Access the admin dashboard</p>
        </div>

        {error && (
          <div className="inline-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p><a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>← Back to Home</a></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
