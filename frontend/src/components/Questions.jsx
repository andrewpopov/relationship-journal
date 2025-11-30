import { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Unlock, AlertCircle } from 'lucide-react';
import {
  getQuestions,
  getQuestionCategories,
  getQuestion,
  getQuestionStatus,
  saveQuestionResponse,
  markQuestionDiscussed,
  deleteQuestionResponse
} from '../api';
import QuestionProgress from './QuestionProgress';
import SplitResponseView from './SplitResponseView';
import JointDiscussion from './JointDiscussion';

function Questions() {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionStatus, setQuestionStatus] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadQuestionsData();
  }, []);

  const loadQuestionsData = async () => {
    try {
      const [categoriesRes, questionsRes] = await Promise.all([
        getQuestionCategories(),
        getQuestions()
      ]);

      setCategories(categoriesRes.data);
      setQuestions(questionsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const handleQuestionClick = async (questionId) => {
    try {
      const [questionRes, statusRes] = await Promise.all([
        getQuestion(questionId),
        getQuestionStatus(questionId)
      ]);

      setSelectedQuestion(questionRes.data);
      setQuestionStatus(statusRes.data);

      // Load user's existing response if any
      const userResponse = questionRes.data.responses?.find(
        r => r.user_id === getCurrentUserId()
      );
      setResponseText(userResponse?.response_text || '');
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id;
  };

  const handleSaveResponse = async () => {
    if (!responseText.trim()) {
      setMessage('Please write something before saving');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await saveQuestionResponse(selectedQuestion.id, responseText);

      // Reload question status to check if both answered
      const statusRes = await getQuestionStatus(selectedQuestion.id);
      setQuestionStatus(statusRes.data);

      // Reload question to get updated responses
      const questionRes = await getQuestion(selectedQuestion.id);
      setSelectedQuestion(questionRes.data);

      setMessage('Response saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving response. Please try again.');
      console.error('Error saving response:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResponse = async () => {
    if (!window.confirm('Are you sure you want to delete your response?')) {
      return;
    }

    try {
      await deleteQuestionResponse(selectedQuestion.id);

      // Reload question status
      const statusRes = await getQuestionStatus(selectedQuestion.id);
      setQuestionStatus(statusRes.data);

      // Reload question
      const questionRes = await getQuestion(selectedQuestion.id);
      setSelectedQuestion(questionRes.data);

      setResponseText('');
      setMessage('Response deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting response');
      console.error('Error deleting response:', error);
    }
  };

  const handleDiscussionSave = async (jointNotes, markAsDiscussed) => {
    await markQuestionDiscussed(selectedQuestion.id, jointNotes, markAsDiscussed);

    // Reload status
    const statusRes = await getQuestionStatus(selectedQuestion.id);
    setQuestionStatus(statusRes.data);
  };

  const handleBackToList = () => {
    setSelectedQuestion(null);
    setQuestionStatus(null);
    setResponseText('');
    setMessage('');
  };

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category_id === parseInt(selectedCategory));

  const groupedQuestions = filteredQuestions.reduce((acc, question) => {
    const category = question.category_name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', color: '#757575' }}>Loading questions...</p>
      </div>
    );
  }

  // Detailed Question View
  if (selectedQuestion) {
    const currentUserId = getCurrentUserId();
    const userResponse = selectedQuestion.responses?.find(r => r.user_id === currentUserId);
    const partnerResponse = selectedQuestion.responses?.find(r => r.user_id !== currentUserId);
    const bothAnswered = questionStatus?.bothAnswered;
    const showDiscussionMode = bothAnswered;

    return (
      <div className="container">
        {/* Header */}
        <button
          onClick={handleBackToList}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#e91e63',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            padding: '0.5rem 0',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={20} />
          Back to Questions
        </button>

        {/* Question Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <span style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              WEEK {selectedQuestion.week_number}
            </span>
            <span style={{
              color: '#999',
              fontSize: '0.85rem'
            }}>
              • {selectedQuestion.category_name}
            </span>
          </div>
          <h1 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem', color: '#333' }}>
            {selectedQuestion.title}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {selectedQuestion.main_prompt}
          </p>

          {/* Guiding Questions */}
          {selectedQuestion.details && selectedQuestion.details.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                color: '#333',
                fontWeight: '600'
              }}>
                Guiding Questions:
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {selectedQuestion.details.map((detail, index) => (
                  <li key={index} style={{ color: '#666', marginBottom: '0.5rem' }}>
                    {detail.detail_text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Mode Indicator */}
        {showDiscussionMode ? (
          // DISCUSSION MODE - Both answered
          <div>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '2px solid #4caf50'
            }}>
              <Unlock size={24} color="#2e7d32" />
              <div>
                <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '0.25rem' }}>
                  Unlocked for Discussion
                </div>
                <div style={{ fontSize: '0.9rem', color: '#558b2f' }}>
                  Both of you have answered. Review each other's thoughts and discuss together!
                </div>
              </div>
            </div>

            {/* Split Response View */}
            <SplitResponseView
              userResponse={userResponse}
              partnerResponse={partnerResponse}
              currentUserId={currentUserId}
            />

            {/* Joint Discussion */}
            <JointDiscussion
              questionId={selectedQuestion.id}
              initialNotes={questionStatus?.jointNotes}
              isDiscussed={questionStatus?.isDiscussed}
              onSave={handleDiscussionSave}
            />
          </div>
        ) : (
          // SOLO ANSWER MODE - Not both answered yet
          <div>
            {/* Status Banner */}
            {questionStatus?.partnerAnswered && !questionStatus?.userAnswered && (
              <div style={{
                backgroundColor: '#fff3e0',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'start',
                gap: '0.75rem',
                border: '2px solid #ff9800'
              }}>
                <AlertCircle size={24} color="#e65100" />
                <div>
                  <div style={{ fontWeight: '600', color: '#e65100', marginBottom: '0.25rem' }}>
                    {questionStatus.partnerName} has answered
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#ef6c00' }}>
                    Write your own thoughts first, then you'll both see each other's responses!
                  </div>
                </div>
              </div>
            )}

            {/* Your Private Response */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <Lock size={20} color="#666" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>
                  Your Private Thoughts
                </h3>
              </div>

              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>
                Your partner won't see this until you both answer. Take your time to reflect.
              </p>

              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Share your thoughts, feelings, and reflections..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />

              {message && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
                  color: message.includes('Error') ? '#c62828' : '#2e7d32',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}>
                  {message}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={handleSaveResponse}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save My Response'}
                </button>

                {responseText && (
                  <button
                    onClick={handleDeleteResponse}
                    className="btn-secondary"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Partner Status */}
            {questionStatus && (
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {questionStatus.partnerAnswered ? (
                    <>
                      ✅ <strong>{questionStatus.partnerName}</strong> has answered • Waiting for you to respond
                    </>
                  ) : questionStatus.userAnswered ? (
                    <>
                      ⏳ You've answered • Waiting for <strong>{questionStatus.partnerName || 'your partner'}</strong>
                    </>
                  ) : (
                    <>
                      ⏳ Waiting for both partners to answer
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Questions List View
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
          Guided Couples Questions
        </h1>
        <p style={{ color: '#757575', fontSize: '1rem' }}>
          32 weeks of meaningful conversations to grow closer together
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: selectedCategory === 'all' ? '2px solid #e91e63' : '2px solid #e0e0e0',
            backgroundColor: selectedCategory === 'all' ? '#fce4ec' : 'white',
            color: selectedCategory === 'all' ? '#e91e63' : '#666',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}
        >
          All Questions
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id.toString())}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              border: selectedCategory === category.id.toString() ? '2px solid #e91e63' : '2px solid #e0e0e0',
              backgroundColor: selectedCategory === category.id.toString() ? '#fce4ec' : 'white',
              color: selectedCategory === category.id.toString() ? '#e91e63' : '#666',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      {selectedCategory === 'all' ? (
        Object.entries(groupedQuestions).map(([categoryName, categoryQuestions]) => (
          <div key={categoryName} style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.3rem',
              color: '#333',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #e91e63'
            }}>
              {categoryName}
            </h2>
            <div className="grid">
              {categoryQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={() => handleQuestionClick(question.id)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onClick={() => handleQuestionClick(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, onClick }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadStatus();
  }, [question.id]);

  const loadStatus = async () => {
    try {
      const res = await getQuestionStatus(question.id);
      setStatus(res.data);
    } catch (error) {
      console.error('Error loading question status:', error);
    }
  };

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <span style={{
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          WEEK {question.week_number}
        </span>
      </div>

      <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>
        {question.title}
      </h3>

      <p style={{
        color: '#757575',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        margin: '0 0 1rem 0'
      }}>
        {question.main_prompt.substring(0, 100)}...
      </p>

      {status && (
        <QuestionProgress
          answeredCount={status.answeredCount}
          isDiscussed={status.isDiscussed}
          partnerName={status.partnerName}
        />
      )}
    </div>
  );
}

export default Questions;
