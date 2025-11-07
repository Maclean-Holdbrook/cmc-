import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { workerAPI } from '../../api/services';
import '../admin/Login.css';
import cocoaImage4 from '../../images/cocoa image 4.avif';

const WorkerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await workerAPI.login(email, password);
      // Backend returns { status: 'success', data: { worker, token, role } }
      const { worker, token, role } = response.data;
      login(worker, role, token);
      navigate('/worker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container worker-login" style={{ backgroundImage: `url(${cocoaImage4})` }}>
      <div className="login-card">
        <div className="login-header">
          <h1>Worker Login</h1>
          <p>Access your assigned tickets</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

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
    </div>
  );
};

export default WorkerLogin;
