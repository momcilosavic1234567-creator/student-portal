import { useEffect, useState } from 'react';
import { Search, Users, BookOpen, TrendingUp, Hash } from 'lucide-react';
import Layout from '../components/Layout';
import { listStudents } from '../api';
import toast from 'react-hot-toast';

function getGpaBadgeClass(gpa) {
  if (!gpa) return '';
  if (gpa >= 3.7) return 'excellent';
  if (gpa >= 3.0) return 'good';
  if (gpa >= 2.0) return 'average';
  return 'low';
}

function avatarColor(email = '') {
  const colors = [
    'linear-gradient(135deg, #89b4fa, #cba6f7)',
    'linear-gradient(135deg, #a6e3a1, #94e2d5)',
    'linear-gradient(135deg, #f38ba8, #cba6f7)',
    'linear-gradient(135deg, #fab387, #f9e2af)',
    'linear-gradient(135deg, #89dceb, #89b4fa)',
  ];
  const idx = email.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listStudents()
      .then(({ data }) => setStudents(data))
      .catch(() => toast.error('Could not load students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.owner?.email?.toLowerCase().includes(q) ||
      s.owner?.full_name?.toLowerCase().includes(q) ||
      s.major?.toLowerCase().includes(q)
    );
  });

  return (
    <Layout title="Students">
      <div className="page-header">
        <div className="page-header-left">
          <h1>All Students</h1>
          <p>{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="search-bar">
          <Search size={16} color="var(--overlay1)" />
          <input
            id="students-search"
            type="text"
            placeholder="Search by name, email, major…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={28} />
          </div>
          <h3>{search ? 'No results found' : 'No students yet'}</h3>
          <p>{search ? `No students match "${search}"` : 'Student profiles will appear here once created.'}</p>
        </div>
      ) : (
        <div className="students-grid">
          {filtered.map((student) => {
            const name = student.owner?.full_name || student.owner?.email || 'Unknown';
            const email = student.owner?.email || '';
            const initials = name.slice(0, 2).toUpperCase();

            return (
              <div key={student.id} className="student-card animate-in">
                <div
                  className="student-avatar"
                  style={{ background: avatarColor(email) }}
                >
                  {initials}
                </div>
                <div className="student-name">{name}</div>
                <div className="student-email">{email}</div>

                {student.bio && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--subtext0)',
                    lineHeight: 1.5,
                    marginBottom: 10,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {student.bio}
                  </div>
                )}

                <div className="student-meta">
                  {student.major && (
                    <span className="tag"><BookOpen size={10} />{student.major}</span>
                  )}
                  {student.year && (
                    <span className="tag"><Hash size={10} />Year {student.year}</span>
                  )}
                  {student.gpa && (
                    <span className={`gpa-badge ${getGpaBadgeClass(student.gpa)}`}>
                      <TrendingUp size={10} />
                      {student.gpa.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
