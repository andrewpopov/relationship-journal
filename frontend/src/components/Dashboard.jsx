import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Image, Sparkles, Target, TrendingUp } from 'lucide-react';
import { getJournalEntries, getMemories, getGratitudeEntries, getGoals } from '../api';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    journalEntries: 0,
    memories: 0,
    gratitudeEntries: 0,
    activeGoals: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [journal, memories, gratitude, goals] = await Promise.all([
        getJournalEntries(),
        getMemories(),
        getGratitudeEntries(),
        getGoals()
      ]);

      setStats({
        journalEntries: journal.data.length,
        memories: memories.data.length,
        gratitudeEntries: gratitude.data.length,
        activeGoals: goals.data.filter(g => g.status === 'active').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Welcome back, {user.displayName}!
      </h1>

      <div className="grid">
        <Link to="/journal" style={{ textDecoration: 'none' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={24} color="#1976d2" />
              </div>
              <div>
                <h3 className="card-title">Journal Entries</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
                  {stats.journalEntries}
                </p>
              </div>
            </div>
            <p style={{ color: '#757575', fontSize: '0.9rem' }}>
              Capture your daily thoughts and reflections
            </p>
          </div>
        </Link>

        <Link to="/memories" style={{ textDecoration: 'none' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fce4ec',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image size={24} color="#e91e63" />
              </div>
              <div>
                <h3 className="card-title">Shared Memories</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e91e63', margin: 0 }}>
                  {stats.memories}
                </p>
              </div>
            </div>
            <p style={{ color: '#757575', fontSize: '0.9rem' }}>
              Preserve your special moments together
            </p>
          </div>
        </Link>

        <Link to="/gratitude" style={{ textDecoration: 'none' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={24} color="#f57c00" />
              </div>
              <div>
                <h3 className="card-title">Gratitude Notes</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00', margin: 0 }}>
                  {stats.gratitudeEntries}
                </p>
              </div>
            </div>
            <p style={{ color: '#757575', fontSize: '0.9rem' }}>
              Express appreciation for each other
            </p>
          </div>
        </Link>

        <Link to="/goals" style={{ textDecoration: 'none' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={24} color="#388e3c" />
              </div>
              <div>
                <h3 className="card-title">Active Goals</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#388e3c', margin: 0 }}>
                  {stats.activeGoals}
                </p>
              </div>
            </div>
            <p style={{ color: '#757575', fontSize: '0.9rem' }}>
              Work towards shared aspirations
            </p>
          </div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <TrendingUp size={24} color="#e91e63" />
          <h2 style={{ margin: 0 }}>Your Journey Together</h2>
        </div>
        <p style={{ color: '#757575', lineHeight: '1.6' }}>
          Keep building your relationship story. Use this journal to celebrate your moments,
          express gratitude, set goals together, and grow closer every day.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
