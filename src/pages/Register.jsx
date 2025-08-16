import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const newErrors = [];

    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone
    });
    
    if (success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
          <div className="register-page-container">
      <div className="register-page-card">
        <div>
          <h2 className="register-page-title">
            Create your account
          </h2>
          <p className="register-page-subtitle">
            Or{' '}
            <Link
              to="/login"
                              className="register-page-login-link"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="register-page-form" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="register-page-error-container">
              <ul className="register-page-error-list">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="register-page-form-fields">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="register-page-input-container">
                <div className="register-page-input-icon">
                  <User className="register-page-icon" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="register-page-input"
                  placeholder="Full Name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="register-page-input-container">
                <div className="register-page-input-icon">
                  <Mail className="register-page-icon" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="register-page-input"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <div className="register-page-input-container">
                <div className="register-page-input-icon">
                  <Phone className="register-page-icon" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="register-page-input"
                  placeholder="Phone Number (optional)"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="register-page-role-label">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="register-page-role-select"
              >
                <option value="customer">Customer</option>
{/*<option value="admin">Restaurant Admin</option> */}
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="register-page-input-container">
                <div className="register-page-input-icon">
                  <Lock className="register-page-icon" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="register-page-input register-page-password-input"
                  placeholder="Password"
                />
                <div className="register-page-password-toggle">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-page-toggle-button"
                  >
                    {showPassword ? (
                      <EyeOff className="register-page-icon" />
                    ) : (
                      <Eye className="register-page-icon" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="register-page-input-container">
                <div className="register-page-input-icon">
                  <Lock className="register-page-icon" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="register-page-input register-page-password-input"
                  placeholder="Confirm Password"
                />
                <div className="register-page-password-toggle">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-page-toggle-button"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="register-page-icon" />
                    ) : (
                      <Eye className="register-page-icon" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="register-page-submit-button group"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
