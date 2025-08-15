import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate(from, { replace: true });
    }
    
    setLoading(false);
  };

  return (
          <div className="login-page-container">
      <div className="login-page-card">
        <div>
          <div className="login-page-logo-container">
            <div className="login-page-logo">
              <span className="login-page-logo-text">P</span>
            </div>
          </div>
          <h2 className="login-page-title">
            Welcome to ProtiGo
          </h2>
          <p className="login-page-subtitle">
            Sign in to your account to continue
          </p>
          <p className="login-page-subtitle">
            Or{' '}
            <Link
              to="/register"
                              className="login-page-register-link"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="login-page-form" onSubmit={handleSubmit}>
          <div className="login-page-form-fields">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="login-page-input-container">
                <div className="login-page-input-icon">
                  <Mail className="login-page-icon" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="login-page-input"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="login-page-input-container">
                <div className="login-page-input-icon">
                  <Lock className="login-page-icon" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="login-page-input login-page-password-input"
                  placeholder="Password"
                />
                <div className="login-page-password-toggle">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-page-toggle-button"
                  >
                    {showPassword ? (
                      <EyeOff className="login-page-icon" />
                    ) : (
                      <Eye className="login-page-icon" />
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
                              className="login-page-submit-button group"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        {/*
            Admin: admin@proteinhub.com / password123
        */}
      </div>
    </div>
  );
};

export default Login;