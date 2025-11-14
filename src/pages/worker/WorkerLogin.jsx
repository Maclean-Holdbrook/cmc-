import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { workerAPI } from '../../api/services';
import '../admin/Login.css';
import cocoaImage4 from '../../images/cocoa image 4.avif';

const WorkerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to homepage after 3 seconds when error modal is shown
  useEffect(() => {
    let timer;
    if (showErrorModal) {
      timer = setTimeout(() => {
        navigate('/');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showErrorModal, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowErrorModal(false);

    try {
      const response = await workerAPI.login(email, password);
      // Backend returns { status: 'success', data: { worker, token, role } }
      const { worker, token, role } = response.data;
      login(worker, role, token);

      // Redirect to intended page or default to dashboard
      const intendedPage = location.state?.from || '/worker/dashboard';
      navigate(intendedPage, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    navigate('/');
  };

  return (
    <div className="login-container worker-login" style={{ backgroundImage: `url(${cocoaImage4})` }}>
      <div className="login-card">
        <div className="login-header">
          <h1>Worker Login</h1>
          <p>Access your assigned tickets</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="worker@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p><a href="/">← Back to Home</a></p>
        </div>
      </div>

      {showErrorModal && (
        <div className="error-modal-overlay" onClick={handleErrorModalClose}>
          <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="error-modal-header">
              <h3>Login Failed</h3>
            </div>
            <div className="error-modal-body">
              <p>{error}</p>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
                Redirecting to homepage in 3 seconds...
              </p>
            </div>
            <div className="error-modal-footer">
              <button
                onClick={handleErrorModalClose}
                className="error-modal-btn"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerLogin;
