import { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [lectures, setLectures] = useState([]);
  const token = localStorage.getItem('token');

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
  }, []);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 className="mb-4">Admin / Monitoring</h1>

      {stats && (
        <div className="grid grid-3 mb-4">
          <div className="card">
            <h3>Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.users}</p>
          </div>
          <div className="card">
            <h3>Lectures</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.lectures}</p>
          </div>
          <div className="card">
            <h3>Flashcards</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.flashcards}</p>
          </div>
          <div className="card">
            <h3>Quizzes</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.quizzes}</p>
          </div>
          <div className="card">
            <h3>Active Jobs</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.jobs.activeCount}</p>
            <p style={{ color: 'var(--text-secondary)' }}>Queue length: {stats.jobs.queueLength}</p>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <h2 className="mb-3">All Users</h2>
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No users</p>
          ) : (
            users.map(u => (
              <div key={u._id} className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <strong>{u.full_name}</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>{u.email}</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
        <div className="card">
          <h2 className="mb-3">All Lectures</h2>
          {lectures.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No lectures</p>
          ) : (
            lectures.map(l => (
              <div key={l._id} className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <strong>{l.title}</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>{l.media_type.toUpperCase()}</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(l.uploaded_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
