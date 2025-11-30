import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, Calendar, CheckCircle } from 'lucide-react';
import { getJourneys, enrollInJourney, getMyJourneys } from '../api';

function JourneyLibrary() {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [myJourneys, setMyJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const [journeysRes, myJourneysRes] = await Promise.all([
        getJourneys(),
        getMyJourneys()
      ]);

      setJourneys(journeysRes.data);
      setMyJourneys(myJourneysRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading journeys:', error);
      setLoading(false);
    }
  };

  const handleEnroll = async (journeyId) => {
    setEnrolling(journeyId);
    try {
      await enrollInJourney(journeyId);
      await loadJourneys(); // Reload to update enrollment status
      // Navigate to the journey
      navigate(`/journey/${journeyId}`);
    } catch (error) {
      console.error('Error enrolling:', error);
      alert(error.response?.data?.error || 'Error enrolling in journey');
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (journeyId) => {
    return myJourneys.some(j => j.journey_id === journeyId);
  };

  const getCadenceLabel = (cadence) => {
    const labels = {
      'daily': 'Daily',
      'weekly': 'Weekly',
      'biweekly': 'Bi-weekly',
      'monthly': 'Monthly'
    };
    return labels[cadence] || cadence;
  };

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', color: '#757575' }}>Loading journeys...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Book size={64} color="#667eea" style={{ marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '0.5rem' }}>Journey Library</h1>
        <p style={{ color: '#757575', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose your path to deeper connection. Each journey is a curated collection of
          conversations designed to help you grow together.
        </p>
      </div>

      {/* My Active Journeys */}
      {myJourneys.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Your Active Journeys</h2>
          <div className="grid">
            {myJourneys.map((journey) => (
              <div
                key={journey.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  borderLeft: '4px solid #667eea'
                }}
                onClick={() => navigate(`/journey/${journey.journey_id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{journey.title}</h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    backgroundColor: '#e8f5e9',
                    color: '#388e3c',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Active
                  </span>
                </div>

                <p style={{ color: '#757575', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {journey.description}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${journey.completion_percentage}%`,
                      height: '100%',
                      backgroundColor: '#667eea',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    color: '#757575'
                  }}>
                    <span>{journey.completed_tasks} of {journey.total_tasks} tasks completed</span>
                    <span>{journey.completion_percentage}%</span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/journey/${journey.journey_id}`);
                  }}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Continue Journey
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Journeys */}
      <div>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          {myJourneys.length > 0 ? 'Explore More Journeys' : 'Available Journeys'}
        </h2>

        {journeys.length === 0 ? (
          <div className="empty-state">
            <Book size={64} color="#667eea" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
            <h3>No Journeys Available Yet</h3>
            <p style={{ color: '#757575' }}>
              Check back soon for new journeys to explore!
            </p>
          </div>
        ) : (
          <div className="grid">
            {journeys.map((journey) => {
              const enrolled = isEnrolled(journey.id);

              return (
                <div
                  key={journey.id}
                  className="card"
                  style={{
                    opacity: enrolled ? 0.7 : 1,
                    borderLeft: journey.is_default ? '4px solid #667eea' : 'none'
                  }}
                >
                  {journey.is_default && (
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}>
                      ⭐ Recommended
                    </div>
                  )}

                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>
                    {journey.title}
                  </h3>

                  <p style={{
                    color: '#757575',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6',
                    minHeight: '60px'
                  }}>
                    {journey.description}
                  </p>

                  {/* Journey Info */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Book size={16} color="#667eea" />
                      <span style={{ color: '#666' }}>
                        <strong>{journey.task_count}</strong> conversations
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Calendar size={16} color="#667eea" />
                      <span style={{ color: '#666' }}>
                        <strong>{journey.duration_weeks}</strong> weeks
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Clock size={16} color="#667eea" />
                      <span style={{ color: '#666' }}>
                        <strong>{getCadenceLabel(journey.cadence)}</strong> tasks
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {enrolled ? (
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/journey/${journey.id}`)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <CheckCircle size={18} />
                      Enrolled • View Journey
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => handleEnroll(journey.id)}
                      disabled={enrolling === journey.id}
                      style={{ width: '100%' }}
                    >
                      {enrolling === journey.id ? 'Enrolling...' : 'Start This Journey'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default JourneyLibrary;
