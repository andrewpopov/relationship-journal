import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Sparkles } from 'lucide-react';
import {
  getGratitudeEntries,
  createGratitudeEntry,
  deleteGratitudeEntry
} from '../api';

function Gratitude() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    entryDate: new Date().toISOString().split('T')[0]
  });

  const gratitudePrompts = [
    "What made you smile today?",
    "What's something your partner did that you appreciate?",
    "What quality do you love most about your partner?",
    "What's a small gesture that meant a lot to you?",
    "What are you grateful for in your relationship today?"
  ];

  const [currentPrompt] = useState(
    gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]
  );

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await getGratitudeEntries();
      setEntries(response.data);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createGratitudeEntry(formData);
      loadEntries();
      handleCloseModal();
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gratitude entry?')) {
      try {
        await deleteGratitudeEntry(id);
        loadEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ content: '', entryDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Gratitude Journal</h1>

      <div className="card" style={{ backgroundColor: '#fff3e0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="#f57c00" />
          <h3 style={{ margin: 0, color: '#f57c00' }}>Today's Prompt</h3>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{currentPrompt}</p>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ width: '100%' }}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Write Gratitude
        </button>
      </div>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Your Gratitude Entries</h2>

      {entries.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={64} color="#f57c00" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>No Entries Yet</h3>
          <p style={{ color: '#757575' }}>
            Start your gratitude practice today using the prompt above!
          </p>
        </div>
      ) : (
        <div>
          {entries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="card-header">
                <p className="card-date">
                  {new Date(entry.entry_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <p className="card-content">{entry.content}</p>
              <div className="card-actions">
                <button className="icon-button" onClick={() => handleDelete(entry.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>New Gratitude Entry</h2>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <div style={{
              backgroundColor: '#fff3e0',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#f57c00' }}>
                <strong>Prompt:</strong> {currentPrompt}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="entryDate">Date</label>
                <input
                  type="date"
                  id="entryDate"
                  value={formData.entryDate}
                  onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">What are you grateful for?</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows="6"
                  placeholder="Express your gratitude..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gratitude;
