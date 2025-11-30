import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, CheckCircle, Target } from 'lucide-react';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../api';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    status: 'active'
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response.data);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, formData);
      } else {
        await createGoal(formData);
      }

      loadGoals();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.target_date || '',
      status: goal.status
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (goal) => {
    const newStatus = goal.status === 'active' ? 'completed' : 'active';
    try {
      await updateGoal(goal.id, { ...goal, status: newStatus });
      loadGoals();
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        loadGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({ title: '', description: '', targetDate: '', status: 'active' });
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Relationship Goals</h1>

      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <div className="empty-state">
          <Target size={64} color="#388e3c" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>No Goals Yet</h2>
          <p style={{ marginBottom: '1.5rem', color: '#757575' }}>
            Set goals together and track your progress as a couple. Create shared aspirations and celebrate achievements!
          </p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Set Your First Goal
          </button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <>
              <h2 style={{ marginBottom: '1rem', color: '#388e3c' }}>Active Goals</h2>
              <div style={{ marginBottom: '2rem' }}>
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="card">
                    <div className="card-header">
                      <div style={{ flex: 1 }}>
                        <h3 className="card-title">{goal.title}</h3>
                        {goal.target_date && (
                          <p className="card-date">
                            Target: {new Date(goal.target_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <span className="goal-status active">Active</span>
                    </div>
                    {goal.description && (
                      <p className="card-content">{goal.description}</p>
                    )}
                    <div className="card-actions">
                      <button
                        className="icon-button"
                        onClick={() => handleToggleStatus(goal)}
                        title="Mark as completed"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button className="icon-button" onClick={() => handleEdit(goal)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="icon-button" onClick={() => handleDelete(goal.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {completedGoals.length > 0 && (
            <>
              <h2 style={{ marginBottom: '1rem', color: '#757575' }}>Completed Goals</h2>
              <div>
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="card" style={{ opacity: 0.7 }}>
                    <div className="card-header">
                      <div style={{ flex: 1 }}>
                        <h3 className="card-title">{goal.title}</h3>
                        {goal.completed_at && (
                          <p className="card-date">
                            Completed: {new Date(goal.completed_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <span className="goal-status completed">Completed</span>
                    </div>
                    {goal.description && (
                      <p className="card-content">{goal.description}</p>
                    )}
                    <div className="card-actions">
                      <button
                        className="icon-button"
                        onClick={() => handleToggleStatus(goal)}
                        title="Mark as active"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button className="icon-button" onClick={() => handleDelete(goal.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>
                {editingGoal ? 'Edit Goal' : 'New Goal'}
              </h2>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Goal Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Plan a weekend getaway"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="Add details about your goal..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="targetDate">Target Date (optional)</label>
                <input
                  type="date"
                  id="targetDate"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingGoal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
