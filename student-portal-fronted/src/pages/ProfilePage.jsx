import { useEffect, useState } from 'react';
import { BookOpen, Hash, TrendingUp, FileText, Save, PlusCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { getMyProfile, createProfile, updateProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const YEARS = [1, 2, 3, 4, 5, 6];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [form, setForm] = useState({
    major: '',
    gpa: '',
    year: '',
    bio: '',
  });

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => {
        setProfile(data);
        setHasProfile(true);
        setForm({
          major: data.major ?? '',
          gpa:   data.gpa   ?? '',
          year:  data.year  ?? '',
          bio:   data.bio   ?? '',
        });
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          toast.error('Could not load profile');
        }
        setHasProfile(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      major: form.major || null,
      gpa:   form.gpa   ? parseFloat(form.gpa)   : null,
      year:  form.year  ? parseInt(form.year, 10) : null,
      bio:   form.bio   || null,
    };

    try {
      let data;
      if (hasProfile) {
        ({ data } = await updateProfile(payload));
        toast.success('Profile updated!');
      } else {
        ({ data } = await createProfile(payload));
        setHasProfile(true);
        toast.success('Profile created!');
      }
      setProfile(data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save profile.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'SU';
  const displayEmail = user?.email || 'student';

  return (
    <Layout title="My Profile">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <div className="profile-name">
            {profile ? (displayEmail.split('@')[0]) : 'Student'}
          </div>
          <div className="profile-email">{displayEmail}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profile?.major && <span className="tag"><BookOpen size={11} />{profile.major}</span>}
            {profile?.year  && <span className="tag"><Hash size={11} />Year {profile.year}</span>}
            {profile?.gpa   && <span className="tag"><TrendingUp size={11} />GPA {profile.gpa.toFixed(2)}</span>}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{hasProfile ? 'Edit Profile' : 'Set Up Your Profile'}</div>
            <div className="card-subtitle">
              {hasProfile ? 'Update your academic information' : 'Fill in your details to get started'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="spinner-overlay">
            <div className="spinner" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-major">
                  <BookOpen size={13} style={{ display: 'inline', marginRight: 5 }} />
                  Major / Field of Study
                </label>
                <input
                  id="prof-major"
                  className="form-input"
                  type="text"
                  name="major"
                  placeholder="e.g. Computer Science"
                  value={form.major}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-year">
                  <Hash size={13} style={{ display: 'inline', marginRight: 5 }} />
                  Academic Year
                </label>
                <select
                  id="prof-year"
                  className="form-input"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Select year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-gpa">
                  <TrendingUp size={13} style={{ display: 'inline', marginRight: 5 }} />
                  GPA (0.0 – 4.0)
                </label>
                <input
                  id="prof-gpa"
                  className="form-input"
                  type="number"
                  name="gpa"
                  placeholder="e.g. 3.75"
                  min="0"
                  max="4"
                  step="0.01"
                  value={form.gpa}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-bio">
                <FileText size={13} style={{ display: 'inline', marginRight: 5 }} />
                Bio
              </label>
              <textarea
                id="prof-bio"
                className="form-input"
                name="bio"
                placeholder="Tell us a bit about yourself, your interests, or goals…"
                value={form.bio}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                id="profile-save"
                className="btn btn-primary"
                type="submit"
                disabled={saving}
              >
                {hasProfile
                  ? <><Save size={15} />{saving ? 'Saving…' : 'Save changes'}</>
                  : <><PlusCircle size={15} />{saving ? 'Creating…' : 'Create profile'}</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
