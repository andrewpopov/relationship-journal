function SplitResponseView({ userResponse, partnerResponse, currentUserId }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.1rem',
        color: '#333',
        fontWeight: '600'
      }}>
        Your Reflections
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }} className="split-response-grid">
        {/* User's Response */}
        <div style={{
          backgroundColor: '#e3f2fd',
          borderLeft: '4px solid #2196f3',
          padding: '1.25rem',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#1976d2'
            }}>
              Your Thoughts
            </h4>
            <span style={{
              fontSize: '0.75rem',
              color: '#666'
            }}>
              {userResponse?.updated_at && new Date(userResponse.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <p style={{
            margin: 0,
            color: '#333',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontSize: '0.95rem'
          }}>
            {userResponse?.response_text || 'No response yet'}
          </p>
        </div>

        {/* Partner's Response */}
        <div style={{
          backgroundColor: '#fce4ec',
          borderLeft: '4px solid #e91e63',
          padding: '1.25rem',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#c2185b'
            }}>
              {partnerResponse?.display_name || 'Partner'}'s Thoughts
            </h4>
            <span style={{
              fontSize: '0.75rem',
              color: '#666'
            }}>
              {partnerResponse?.updated_at && new Date(partnerResponse.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <p style={{
            margin: 0,
            color: '#333',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontSize: '0.95rem'
          }}>
            {partnerResponse?.response_text || 'Waiting for partner...'}
          </p>
        </div>
      </div>

      {/* Discussion Prompt */}
      {userResponse && partnerResponse && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          borderLeft: '4px solid #ff9800'
        }}>
          <p style={{
            margin: 0,
            color: '#e65100',
            fontSize: '0.9rem',
            fontWeight: '500',
            fontStyle: 'italic'
          }}>
            💬 Discussion starter: What similarities or differences do you notice in your responses?
          </p>
        </div>
      )}
    </div>
  );
}

export default SplitResponseView;
