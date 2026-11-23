
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRound, Mail, LockKeyhole } from 'lucide-react';
import Brand from '../components/Brand';
import { saveUser } from '../data';
import { apiRequest, saveToken } from '../services/api';

const art = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&auto=format&fit=crop&q=85';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const art = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&auto=format&fit=crop&q=85';

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      saveToken(data.token);
      saveUser(data.user);

      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-art">
        <Brand light />
        <div className="auth-art-copy">
          <h2>Join Our Community</h2>
          <p>
            Share your stories, connect with readers and become part of our
            creative family.
          </p>
        </div>
        <img src={art} alt="Open journal and writing desk" />
      </section>

      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h1>Create Account</h1>
          <p className="muted">Start your journey</p>

          <form onSubmit={submit}>
            <label>Full Name</label>
            <div className="field">
              <UserRound />
              <input
                name="name"
                required
                value={form.name}
                onChange={change}
                placeholder="Your full name"
              />
            </div>

            <label>Email Address</label>
            <div className="field">
              <Mail />
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={change}
                placeholder="you@example.com"
              />
            </div>

            <label>Password</label>
            <div className="field">
              <LockKeyhole />
              <input
                name="password"
                type="password"
                minLength="8"
                required
                value={form.password}
                onChange={change}
                placeholder="At least 8 characters"
              />
            </div>

            <label>Choose Role</label>
            <select
              className="role-select"
              name="role"
              value={form.role}
              onChange={change}
            >
              <option value="user">Reader</option>
              <option value="author">Author</option>
            </select>

            {error && <p className="form-error">{error}</p>}

            <button className="btn-primary full-width" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
