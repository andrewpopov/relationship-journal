import { useState } from 'react';
import { MessageCircle, Check } from 'lucide-react';

function JointDiscussion({ questionId, initialNotes, isDiscussed, onSave }) {
  const [jointNotes, setJointNotes] = useState(initialNotes || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (markAsDiscussed = false) => {
    setSaving(true);
    setMessage('');

    try {
      await onSave(jointNotes, markAsDiscussed);
      setMessage(markAsDiscussed ? 'Marked as discussed!' : 'Notes saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <MessageCircle size={24} color="#667eea" />
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          color: '#333',
          fontWeight: '600'
        }}>
          Discuss Together
        </h3>
      </div>

      <div style={{
        backgroundColor: '#f8f9ff',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <p style={{
          margin: '0 0 0.5rem 0',
          color: '#666',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          After talking about this question together, capture your joint insights, decisions, or action items here.
        </p>
        <p style={{
          margin: 0,
          color: '#999',
          fontSize: '0.85rem',
          fontStyle: 'italic'
        }}>
          These notes are visible to both of you.
        </p>
      </div>

      <textarea
        value={jointNotes}
        onChange={(e) => setJointNotes(e.target.value)}
        placeholder="What did you learn together? Any decisions or action items?"
        style={{
          width: '100%',
          minHeight: '120px',
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

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Save Notes
        </button>

        {!isDiscussed && (
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#4caf50'
            }}
          >
            <Check size={18} />
            Mark as Discussed
          </button>
        )}

        {isDiscussed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            <Check size={18} />
            Discussed
          </div>
        )}
      </div>
    </div>
  );
}

export default JointDiscussion;
