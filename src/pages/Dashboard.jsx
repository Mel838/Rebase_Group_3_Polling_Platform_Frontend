import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { sessionService } from '../services/sessionService.js';
import { formatDate } from '../utils/formatters.js';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', description: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const session = await sessionService.createSession(newSession);
      setSessions([session, ...sessions]);
      setShowModal(false);
      setNewSession({ title: '', description: '' });
      navigate(`/session/${session.id}`);
    } catch (error) {
      alert('Failed to create session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await sessionService.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      alert('Failed to delete session');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>My Sessions</h1>
          <p style={styles.subtitle}>Welcome back, {user?.name}!</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => setShowModal(true)} style={styles.createButton}>
            + New Session
          </button>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.sessionGrid}>
        {sessions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No sessions yet. Create your first session to get started!</p>
            <button onClick={() => setShowModal(true)} style={styles.createButton}>
              Create Session
            </button>
          </div>
        ) : (
          sessions.map(session => (
            <div key={session.id} style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <h3 style={styles.sessionTitle}>{session.title}</h3>
                <span style={styles.sessionCode}>Code: {session.session_code}</span>
              </div>
              {session.description && (
                <p style={styles.sessionDescription}>{session.description}</p>
              )}
              <div style={styles.sessionFooter}>
                <span style={styles.sessionDate}>{formatDate(session.created_at)}</span>
                <div style={styles.sessionActions}>
                  <button
                    onClick={() => navigate(`/session/${session.id}`)}
                    style={styles.openButton}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Create New Session</h2>
            <form onSubmit={handleCreateSession}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., Product Feedback Q1 2025"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  style={styles.textarea}
                  placeholder="Brief description of this session"
                  rows="3"
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;