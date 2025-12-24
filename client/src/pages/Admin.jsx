import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [lectures, setLectures] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const client = axios.create({ baseURL: '/api', headers: { Authorization: `Bearer ${token}` } });
    const load = async () => {
      try {
        const [statsRes, usersRes, lecturesRes] = await Promise.all([
          client.get('/admin/stats'),
          client.get('/admin/users'),
          client.get('/admin/lectures'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.users || []);
        setLectures(lecturesRes.data.lectures || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [token]);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 className="mb-4">Admin / Monitoring</h1>

      {stats && (
        <div className="grid grid-3 mb-4">
          <div className="card stat-card">
            <div className="stat-label">Users</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Lectures</div>
            <div className="stat-value">{stats.lectures}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Flashcards</div>
            <div className="stat-value">{stats.flashcards}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Quizzes</div>
            <div className="stat-value">{stats.quizzes}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Active Jobs</div>
            <div className="stat-value success">{stats.jobs.activeCount}</div>
            <div className="stat-sub">Queue length: {stats.jobs.queueLength}</div>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <div className="section-header">
            <h2>All Users</h2>
            <span className="pill">{users.length}</span>
          </div>
          {users.length === 0 ? (
            <p className="empty-state">No users</p>
          ) : (
            <div className="data-list">
              {users.map(u => (
                <div key={u._id} className="data-row">
                  <div>
                    <div className="data-title">{u.full_name}</div>
                    <div className="data-sub">{u.email}</div>
                  </div>
                  <div className="data-meta">{new Date(u.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-header">
            <h2>All Lectures</h2>
            <span className="pill">{lectures.length}</span>
          </div>
          {lectures.length === 0 ? (
            <p className="empty-state">No lectures</p>
          ) : (
            <div className="data-list">
              {lectures.map(l => (
                <div
                  key={l._id}
                  className="data-row clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/lecture/${l._id}`)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/lecture/${l._id}`);
                  }}
                >
                  <div>
                    <div className="data-title">{l.title}</div>
                    <div className="data-sub">
                      <span className="badge">{l.media_type.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="data-meta">{new Date(l.uploaded_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
