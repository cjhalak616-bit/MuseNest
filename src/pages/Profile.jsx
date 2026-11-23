
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getUser, saveUser } from '../data';
import { apiRequest } from '../services/api';

export default function Profile() {
  const current = getUser() || {};

  const [name, setName] = useState(current.name || '');
  const [email, setEmail] = useState(current.email || '');
  const [bio, setBio] = useState(current.bio || '');
  const [avatar, setAvatar] = useState(current.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest('/users/profile');

        const user = data.user;

        setName(user.name || '');
        setEmail(user.email || '');
        setBio(user.bio || '');
        setAvatar(user.avatar || '');

        saveUser(user);
      } catch (err) {
        setError(err.message || 'Unable to load profile.');
      }
    };

    loadProfile();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage('');
      setError('');

      const data = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          bio,
          avatar
        })
      });

      saveUser(data.user);

      setName(data.user.name || '');
      setEmail(data.user.email || '');
      setBio(data.user.bio || '');
      setAvatar(data.user.avatar || '');

      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dash-heading">
        <div>
          <p className="eyebrow">YOUR SPACE</p>
          <h1>My Profile</h1>
          <p>Keep your account details up to date.</p>
        </div>
      </div>

      <form
        className="editor-panel profile-form"
        onSubmit={submit}
      >
        <div className="profile-avatar">
          {name[0]?.toUpperCase() || 'M'}
        </div>

        <label>Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          value={email}
          disabled
        />

        <label>Account Role</label>
        <input
          value={current.role || 'user'}
          disabled
        />

        <label>About Me</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself..."
          rows="4"
        />

        <label>Profile Image URL</label>
        <input
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Paste your profile image URL"
        />

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="form-error">{error}</p>
        )}

        <button
          className="btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </DashboardLayout>
  );
}
