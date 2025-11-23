import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getMemories, createMemory, deleteMemory } from '../api';

function Memories() {
  const [memories, setMemories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    memoryDate: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const response = await getMemories();
      setMemories(response.data);
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('memoryDate', formData.memoryDate);
      if (selectedFile) {
        data.append('photo', selectedFile);
      }

      await createMemory(data);

      loadMemories();
      handleCloseModal();
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await deleteMemory(id);
        loadMemories();
      } catch (error) {
        console.error('Error deleting memory:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ title: '', description: '', memoryDate: new Date().toISOString().split('T')[0] });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Shared Memories</h1>

      {memories.length === 0 ? (
        <div className="empty-state">
          <p>No memories yet. Start creating your collection of special moments!</p>
        </div>
      ) : (
        <div className="grid">
          {memories.map((memory) => (
            <div key={memory.id} className="card">
              {memory.photo_path && (
                <img
                  src={memory.photo_path}
                  alt={memory.title}
                  className="memory-image"
                />
              )}
              <h3 className="card-title">{memory.title}</h3>
              {memory.memory_date && (
                <p className="card-date">
                  {new Date(memory.memory_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              {memory.description && (
                <p className="card-content">{memory.description}</p>
              )}
              <div className="card-actions">
                <button className="icon-button" onClick={() => handleDelete(memory.id)}>
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
              <h2 style={{ margin: 0 }}>New Memory</h2>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="photo">Photo</label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginTop: '0.5rem'
                    }}
                  />
                )}
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="memoryDate">Date</label>
                <input
                  type="date"
                  id="memoryDate"
                  value={formData.memoryDate}
                  onChange={(e) => setFormData({ ...formData, memoryDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
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

export default Memories;
