import { useState, useEffect } from 'react';
import { staffAPI } from '../../api/services';
import AlertModal from '../../components/common/AlertModal';
import './StaffComplaintForm.css';
import cocoaImage2 from '../../images/cocoa image 2.jpg';

const StaffComplaintForm = () => {
  const [formData, setFormData] = useState({
    staffName: '',
    department: '',
    title: '',
    description: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await staffAPI.getDepartments();
      setDepartments(response.data.departments);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      images.forEach((image) => {
        data.append('images', image);
      });

      await staffAPI.submitComplaint(data);
      setShowSuccessModal(true);
      setFormData({
        staffName: '',
        department: '',
        title: '',
        description: '',
        location: '',
      });
      setImages([]);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit complaint');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-complaint-container" style={{ backgroundImage: `url(${cocoaImage2})` }}>
      <div className="staff-complaint-card">
        <h1>Submit a Complaint</h1>
        <p className="subtitle">Fill out the form below to submit your complaint</p>

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="staffName">Your Name *</label>
            <input
              type="text"
              id="staffName"
              name="staffName"
              value={formData.staffName}
              onChange={handleChange}
              required
              placeholder=""
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace(/_/g, '-')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Complaint Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images (Max 5)</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <small className="file-info">{images.length} file(s) selected</small>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Message Delivered"
        message="Your complaint has been submitted successfully! You will receive updates via email."
        type="success"
        autoClose={true}
        autoCloseDelay={4000}
      />

      <AlertModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Submission Failed"
        message={errorMessage}
        type="error"
        autoClose={false}
      />
    </div>
  );
};

export default StaffComplaintForm;
