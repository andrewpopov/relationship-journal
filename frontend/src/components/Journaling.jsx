import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Target, Image } from 'lucide-react';

function Journaling() {
  return (
    <div className="container">
      <div className="page-header">
        <h2>Journaling</h2>
        <p>Personal writing, reflection, and goal tracking</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/journal" className="journaling-card" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
            <div className="card-header">
              <BookOpen size={24} style={{ color: '#6366f1' }} />
              <h3 style={{ margin: 0 }}>Journal</h3>
            </div>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Write daily entries and reflect on your thoughts, experiences, and personal growth.
            </p>
          </div>
        </Link>

        <Link to="/gratitude" className="journaling-card" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
            <div className="card-header">
              <Sparkles size={24} style={{ color: '#f59e0b' }} />
              <h3 style={{ margin: 0 }}>Gratitude</h3>
            </div>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Practice gratitude by recording what you're thankful for each day.
            </p>
          </div>
        </Link>

        <Link to="/goals" className="journaling-card" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
            <div className="card-header">
              <Target size={24} style={{ color: '#10b981' }} />
              <h3 style={{ margin: 0 }}>Goals</h3>
            </div>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Set and track your personal goals and milestones.
            </p>
          </div>
        </Link>

        <Link to="/memories" className="journaling-card" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
            <div className="card-header">
              <Image size={24} style={{ color: '#ec4899' }} />
              <h3 style={{ margin: 0 }}>Memories</h3>
            </div>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Capture and preserve special moments and memories.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Journaling;
