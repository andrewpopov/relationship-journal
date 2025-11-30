import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, AlertCircle, CheckCircle, ArrowRight, Flame, BookOpen } from 'lucide-react';
import { getMyJourneys, getCurrentTasks } from '../api';

function JourneyDashboard({ user }) {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [currentTasks, setCurrentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [journeysRes, tasksRes] = await Promise.all([
        getMyJourneys(),
        getCurrentTasks()
      ]);

      setJourneys(journeysRes.data);
      setCurrentTasks(tasksRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const getDueDateColor = (dueDate, isOverdue) => {
    if (isOverdue) return '#f44336';

    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 1) return '#ff9800';
    if (daysUntilDue <= 3) return '#ffc107';
    return '#388e3c';
  };

  const getDueDateLabel = (dueDate, isOverdue) => {
    if (isOverdue) return 'Overdue';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;

    return `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const overdueTasks = currentTasks.filter(t => t.is_overdue);
  const upcomingTasks = currentTasks.filter(t => !t.is_overdue);

  const totalCompleted = journeys.reduce((sum, j) => sum + (j.completed_tasks || 0), 0);

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', color: '#757575' }}>Loading your journeys...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user.displayName}!</h1>
        <p style={{ color: '#757575', fontSize: '1.05rem' }}>
          Your journey continues. Here's what's next in your path to deeper connection.
        </p>
      </div>

      {/* Stats Cards */}
      {journeys.length > 0 && (
        <div className="grid" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#f3e5f5' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
              {journeys.length}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              Active {journeys.length === 1 ? 'Journey' : 'Journeys'}
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#388e3c', marginBottom: '0.5rem' }}>
              {totalCompleted}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              Conversations Completed
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', backgroundColor: overdueTasks.length > 0 ? '#ffebee' : '#e3f2fd' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: overdueTasks.length > 0 ? '#f44336' : '#1976d2',
              marginBottom: '0.5rem'
            }}>
              {currentTasks.length}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              Tasks This Week
              {overdueTasks.length > 0 && ` (${overdueTasks.length} overdue)`}
            </div>
          </div>
        </div>
      )}

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f44336'
          }}>
            <AlertCircle size={24} />
            Overdue Tasks
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  borderLeft: '4px solid #f44336',
                  transition: 'transform 0.2s'
                }}
                onClick={() => navigate(`/journey/${task.journey_id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#f44336',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {task.journey_title}
                    </div>

                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p style={{ color: '#666', margin: '0 0 0.75rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {task.description.substring(0, 150)}
                        {task.description.length > 150 && '...'}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#f44336',
                        fontWeight: '500'
                      }}>
                        <Clock size={14} />
                        {getDueDateLabel(task.due_date, task.is_overdue)}
                      </div>

                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        backgroundColor: '#fff3e0',
                        color: '#e65100',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Page {task.page_number}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/journey/${task.journey_id}`);
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      backgroundColor: '#f44336',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    Resume
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={24} color="#667eea" />
            This Week's Tasks
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingTasks.map((task) => {
              const dueColor = getDueDateColor(task.due_date, task.is_overdue);

              return (
                <div
                  key={task.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    borderLeft: `4px solid ${dueColor}`,
                    transition: 'transform 0.2s'
                  }}
                  onClick={() => navigate(`/journey/${task.journey_id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#667eea',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {task.journey_title}
                      </div>

                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                        {task.title}
                      </h3>

                      {task.description && (
                        <p style={{ color: '#666', margin: '0 0 0.75rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {task.description.substring(0, 150)}
                          {task.description.length > 150 && '...'}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          color: dueColor,
                          fontWeight: '500'
                        }}>
                          <Clock size={14} />
                          {getDueDateLabel(task.due_date, task.is_overdue)}
                        </div>

                        <div style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          backgroundColor: '#f0f4ff',
                          color: '#667eea',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          Page {task.page_number}
                        </div>

                        {task.estimated_time_minutes && (
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#999'
                          }}>
                            ~{task.estimated_time_minutes} min
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/journey/${task.journey_id}`);
                      }}
                      style={{
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      Start
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Journeys */}
      {journeys.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Book size={24} color="#667eea" />
            Your Active Journeys
          </h2>

          <div className="grid">
            {journeys.map((journey) => (
              <div
                key={journey.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => navigate(`/journey/${journey.journey_id}`)}
              >
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', color: '#667eea' }}>
                  {journey.title}
                </h3>

                <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
                  {journey.description}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1rem' }}>
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
                    <span>{journey.completed_tasks} of {journey.total_tasks} completed</span>
                    <span>{journey.completion_percentage}%</span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/journey/${journey.journey_id}`);
                  }}
                  style={{ width: '100%' }}
                >
                  <BookOpen size={18} style={{ marginRight: '0.5rem' }} />
                  Open Journey
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {journeys.length === 0 && (
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <Book size={64} color="#667eea" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>No Active Journeys</h2>
          <p style={{ color: '#757575', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Start your first journey to begin meaningful conversations and deepen your connection.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/journeys')}
            style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}
          >
            <Book size={20} style={{ marginRight: '0.5rem' }} />
            Browse Journeys
          </button>
        </div>
      )}
    </div>
  );
}

export default JourneyDashboard;
