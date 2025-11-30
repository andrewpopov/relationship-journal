import { Check, User, Users } from 'lucide-react';

function QuestionProgress({ answeredCount, isDiscussed, partnerName }) {
  const getProgressColor = () => {
    if (isDiscussed) return '#4caf50'; // Green - discussed
    if (answeredCount === 2) return '#2196f3'; // Blue - ready to discuss
    if (answeredCount === 1) return '#ff9800'; // Orange - partially answered
    return '#9e9e9e'; // Gray - not started
  };

  const getStatusText = () => {
    if (isDiscussed) return 'Discussed ✓';
    if (answeredCount === 2) return 'Ready to discuss!';
    if (answeredCount === 1) return partnerName ? `Waiting for ${partnerName}` : 'Waiting for partner';
    return 'Not started';
  };

  const color = getProgressColor();

  return (
    <div style={{ marginTop: '0.75rem' }}>
      {/* Progress Ring */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem'
      }}>
        <div style={{
          position: 'relative',
          width: '40px',
          height: '40px'
        }}>
          {/* Background circle */}
          <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="3"
            />
            {/* Progress arc */}
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeDasharray={`${(answeredCount / 2) * 100} 100`}
              strokeLinecap="round"
            />
          </svg>
          {/* Center icon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            {isDiscussed ? (
              <Check size={18} color={color} strokeWidth={3} />
            ) : answeredCount === 2 ? (
              <Users size={16} color={color} />
            ) : answeredCount === 1 ? (
              <User size={16} color={color} />
            ) : (
              <span style={{ fontSize: '12px', color: '#9e9e9e', fontWeight: '600' }}>
                {answeredCount}/2
              </span>
            )}
          </div>
        </div>

        {/* Status text */}
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: '#999',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            {answeredCount}/2 Answered
          </div>
          <div style={{
            fontSize: '0.85rem',
            color: color,
            fontWeight: '500',
            marginTop: '2px'
          }}>
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionProgress;
