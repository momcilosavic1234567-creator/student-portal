import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { authRegister } from '../api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await authRegister({ full_name: form.full_name, email: form.email, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="logo-text">StudentHub</div>
          <p>Create your academic portal account</p>
        </div>

        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-sub">Join StudentHub to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full name</label>
              <div className="form-input-icon-wrap">
                <User className="form-input-icon" size={18} />
                <input
                  id="reg-name"
                  className="form-input"
                  type="text"
                  name="full_name"
                  placeholder="Jane Doe"
                  value={form.full_name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <div className="form-input-icon-wrap">
                <Mail className="form-input-icon" size={18} />
                <input
                  id="reg-email"
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="form-input-icon-wrap">
                <Lock className="form-input-icon" size={18} />
                <input
                  id="reg-password"
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
              <div className="form-input-icon-wrap">
                <Lock className="form-input-icon" size={18} />
                <input
                  id="reg-confirm"
                  className="form-input"
                  type="password"
                  name="confirm"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                id="register-submit"
                className="btn btn-primary btn-full"
                type="submit"
                disabled={loading}
              >
                <UserPlus size={16} />
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
