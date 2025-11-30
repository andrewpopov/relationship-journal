import { useEffect, useState } from 'react';
import { Book, MessageCircle, Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { getQuestions } from '../api';

function JourneyBook({ user }) {
  const [questions, setQuestions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('discussed'); // 'all', 'discussed', 'pending'

  useEffect(() => {
    loadJourneyBook();
  }, []);

  const loadJourneyBook = async () => {
    try {
      const response = await getQuestions();
      const allQuestions = response.data;

      // Process questions to include response status
      const processedQuestions = allQuestions.map(q => {
        const hasMyResponse = q.responses?.some(r => r.user_id === user.id);
        const hasPartnerResponse = q.responses?.some(r => r.user_id !== user.id);
        const isDiscussed = !!q.discussion?.discussed_at;
        const responseCount = q.responses?.length || 0;

        return {
          ...q,
          hasMyResponse,
          hasPartnerResponse,
          isDiscussed,
          responseCount
        };
      });

      setQuestions(processedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading journey book:', error);
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'discussed') return q.isDiscussed;
    if (filter === 'pending') return q.responseCount > 0 && !q.isDiscussed;
    return true; // 'all'
  });

  const discussedCount = questions.filter(q => q.isDiscussed).length;
  const pendingCount = questions.filter(q => q.responseCount > 0 && !q.isDiscussed).length;

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', color: '#757575' }}>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Book size={48} color="#667eea" style={{ marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '0.5rem' }}>Your Journey Book</h1>
        <p style={{ color: '#757575', fontSize: '1.05rem' }}>
          A collection of your conversations, reflections, and growth as a couple
        </p>
      </div>

      {/* Stats */}
      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
            {discussedCount}
          </div>
          <div style={{ color: '#757575', fontSize: '0.9rem' }}>
            Conversations Completed
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f57c00', marginBottom: '0.5rem' }}>
            {pendingCount}
          </div>
          <div style={{ color: '#757575', fontSize: '0.9rem' }}>
            In Progress
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e91e63', marginBottom: '0.5rem' }}>
            {questions.length}
          </div>
          <div style={{ color: '#757575', fontSize: '0.9rem' }}>
            Total Questions
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setFilter('discussed')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: filter === 'discussed' ? '#667eea' : '#e0e0e0',
            backgroundColor: filter === 'discussed' ? '#667eea' : 'white',
            color: filter === 'discussed' ? 'white' : '#757575',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}
        >
          Completed ({discussedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: filter === 'pending' ? '#f57c00' : '#e0e0e0',
            backgroundColor: filter === 'pending' ? '#f57c00' : 'white',
            color: filter === 'pending' ? 'white' : '#757575',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}
        >
          In Progress ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: filter === 'all' ? '#757575' : '#e0e0e0',
            backgroundColor: filter === 'all' ? '#757575' : 'white',
            color: filter === 'all' ? 'white' : '#757575',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}
        >
          All ({questions.length})
        </button>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="empty-state">
          <MessageCircle size={64} color="#667eea" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>
            {filter === 'discussed' ? 'No Completed Conversations Yet' : 'No Questions Found'}
          </h2>
          <p style={{ color: '#757575' }}>
            {filter === 'discussed'
              ? 'Start answering daily questions with your partner to build your journey book!'
              : 'Change your filter or start a new question.'}
          </p>
        </div>
      ) : (
        <div>
          {filteredQuestions
            .sort((a, b) => {
              // Sort discussed by date (newest first)
              if (a.discussion?.discussed_at && b.discussion?.discussed_at) {
                return new Date(b.discussion.discussed_at) - new Date(a.discussion.discussed_at);
              }
              // Sort by week number
              return b.week_number - a.week_number;
            })
            .map((q) => {
              const isExpanded = expandedId === q.id;
              const myResponse = q.responses?.find(r => r.user_id === user.id);
              const partnerResponse = q.responses?.find(r => r.user_id !== user.id);

              return (
                <div
                  key={q.id}
                  className="card"
                  style={{
                    marginBottom: '1rem',
                    borderLeft: q.isDiscussed ? '4px solid #667eea' : '4px solid #e0e0e0'
                  }}
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Week {q.week_number} • {q.category_name}
                          </span>
                          {q.isDiscussed && (
                            <span style={{
                              padding: '0.125rem 0.5rem',
                              borderRadius: '10px',
                              backgroundColor: '#e8f5e9',
                              color: '#388e3c',
                              fontSize: '0.7rem',
                              fontWeight: '500'
                            }}>
                              ✓ Discussed
                            </span>
                          )}
                          {!q.isDiscussed && q.responseCount > 0 && (
                            <span style={{
                              padding: '0.125rem 0.5rem',
                              borderRadius: '10px',
                              backgroundColor: '#fff3e0',
                              color: '#f57c00',
                              fontSize: '0.7rem',
                              fontWeight: '500'
                            }}>
                              {q.responseCount}/2 Responses
                            </span>
                          )}
                        </div>
                        <h3 style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '1.15rem',
                          color: '#212121'
                        }}>
                          {q.title}
                        </h3>
                        <p style={{
                          margin: 0,
                          color: '#757575',
                          fontSize: '0.95rem',
                          lineHeight: '1.5'
                        }}>
                          {q.main_prompt.length > 120 && !isExpanded
                            ? q.main_prompt.substring(0, 120) + '...'
                            : q.main_prompt}
                        </p>
                      </div>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#757575',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          marginLeft: '1rem'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {q.isDiscussed && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#999'
                      }}>
                        <Calendar size={14} />
                        Discussed on {new Date(q.discussion.discussed_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      {/* Guide Questions */}
                      {q.details && q.details.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{
                            margin: '0 0 0.75rem 0',
                            fontSize: '0.9rem',
                            color: '#757575',
                            fontWeight: '600'
                          }}>
                            Guide Questions:
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.8', color: '#666' }}>
                            {q.details.map((detail) => (
                              <li key={detail.id}>{detail.detail_text}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Responses */}
                      {(myResponse || partnerResponse) && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{
                            margin: '0 0 1rem 0',
                            fontSize: '0.9rem',
                            color: '#757575',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <Users size={16} />
                            Your Responses:
                          </h4>
                          {myResponse && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#1976d2',
                                marginBottom: '0.5rem'
                              }}>
                                {user.displayName}:
                              </div>
                              <div style={{
                                padding: '1rem',
                                backgroundColor: '#e3f2fd',
                                borderRadius: '8px',
                                lineHeight: '1.6',
                                fontSize: '0.95rem'
                              }}>
                                {myResponse.response_text}
                              </div>
                            </div>
                          )}
                          {partnerResponse && (
                            <div>
                              <div style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#e91e63',
                                marginBottom: '0.5rem'
                              }}>
                                Partner:
                              </div>
                              <div style={{
                                padding: '1rem',
                                backgroundColor: '#fce4ec',
                                borderRadius: '8px',
                                lineHeight: '1.6',
                                fontSize: '0.95rem'
                              }}>
                                {partnerResponse.response_text}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Joint Discussion */}
                      {q.discussion?.joint_notes && (
                        <div>
                          <h4 style={{
                            margin: '0 0 0.75rem 0',
                            fontSize: '0.9rem',
                            color: '#757575',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <MessageCircle size={16} />
                            Discussion Notes & Takeaways:
                          </h4>
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#f3e5f5',
                            borderRadius: '8px',
                            lineHeight: '1.6',
                            fontSize: '0.95rem',
                            borderLeft: '3px solid #667eea'
                          }}>
                            {q.discussion.joint_notes}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default JourneyBook;
