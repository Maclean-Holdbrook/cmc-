import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';
import cmcLogo from '../images/cmclogo.png';
import cocoaImage1 from '../images/cocoa image 1.jpg';
import cocoaImage2 from '../images/cocoa image 2.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [cocoaImage1, cocoaImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Carousel Background */}
      <div className="background-carousel">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`background-slide ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Logo */}
      <img src={cmcLogo} alt="CMC Logo" className="cmc-logo" />

      <div className="home-content">
        <h1>CMC IT SYSTEM SUPPORT</h1>
        {/* <p className="subtitle">Efficient complaint tracking and resolution</p> */}

        <div className="portal-cards">
          <div className="portal-card staff-card" onClick={() => navigate('/submit-complaint')}>
            <div className="card-icon">📝</div>
            <h2>Staff Portal</h2>
            <p>Submit a complaint</p>
            <p className="card-note">No login required</p>
          </div>

          <div className="portal-card admin-card" onClick={() => navigate('/admin/login')}>
            <div className="card-icon">👨‍💼</div>
            <h2>Admin Portal</h2>
            <p>Manage complaints and workers</p>
            <p className="card-note">Login required</p>
          </div>

          <div className="portal-card worker-card" onClick={() => navigate('/worker/login')}>
            <div className="card-icon">👷</div>
            <h2>Worker Portal</h2>
            <p>View and update tickets</p>
            <p className="card-note">Login required</p>
          </div>
        </div>

        <footer className="home-footer">
          <p>© 2025 CMC IT SYSTEM SUPPORT. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
