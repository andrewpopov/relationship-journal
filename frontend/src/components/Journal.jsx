import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} from '../api';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    entryDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await getJournalEntries();
      setEntries(response.data);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEntry) {
        await updateJournalEntry(editingEntry.id, formData);
      } else {
        await createJournalEntry(formData);
      }

      loadEntries();
      setShowModal(false);
      setEditingEntry(null);
      setFormData({ title: '', content: '', entryDate: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title || '',
      content: entry.content,
      entryDate: entry.entry_date
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteJournalEntry(id);
        loadEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEntry(null);
    setFormData({ title: '', content: '', entryDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Journal Entries</h1>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No journal entries yet. Start writing to capture your thoughts!</p>
        </div>
      ) : (
        <div>
          {entries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="card-header">
                <div>
                  {entry.title && <h3 className="card-title">{entry.title}</h3>}
                  <p className="card-date">
                    {new Date(entry.entry_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <p className="card-content">{entry.content}</p>
              <div className="card-actions">
                <button className="icon-button" onClick={() => handleEdit(entry)}>
                  <Edit2 size={18} />
                </button>
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
              <h2 style={{ margin: 0 }}>
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h2>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={24} />
              </button>
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
                <label htmlFor="title">Title (optional)</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows="8"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingEntry ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;
