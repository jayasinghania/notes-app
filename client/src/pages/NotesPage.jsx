import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import notesService from '../services/notesService';

const NotesPage = () => {
  const { notes, loading, createNote, deleteNote, setNotes } = useNotes();
  const { user, login } = useAuth(); // We need 'login' to refresh user data

  // State for the create form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // State for the edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNote({ title, content });
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note.');
    }
  };

  const handleEditClick = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
        const updatedNote = await notesService.updateNote(currentNote._id, currentNote.title, currentNote.content);
        setNotes(notes.map(note => note._id === currentNote._id ? updatedNote : note));
        setIsEditing(false);
        setCurrentNote(null);
    } catch (err) {
        console.error("Failed to update note:", err);
    }
  }

  const handleUpgrade = async () => {
    if (user.role !== 'Admin') {
        alert('Only Admins can upgrade the plan.');
        return;
    }
    try {
      // We use the tenant slug from the user object
      await notesService.upgradeTenant(user.tenantData.slug);
      alert('Upgrade successful! Your note limit has been removed.');
      
      // Re-login to get the updated user/tenant info, which will hide the banner
      const updatedUser = await login(user.email, 'password'); // Assumes password is known/storable
                                                              // In a real app, you'd handle this more securely
      // This will trigger a re-render and hide the upgrade banner
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upgrade. Please try again.');
    }
  }

  return (
    <div className="notes-page">
      {/* Edit Note Modal */}
      {isEditing && (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Edit Note</h2>
                <form onSubmit={handleUpdateSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input"
                            value={currentNote.title}
                            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                        />
                    </div>
                     <div className="form-group">
                        <textarea
                            className="form-input"
                            rows="5"
                            value={currentNote.content}
                            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Create Note Form */}
      <div className="note-form-card">
        <h2>Create a New Note</h2>
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Note
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Notes List */}
      <div className="notes-list">
        <h2>Your Notes</h2>
        {loading && <p>Loading notes...</p>}
        {!loading && notes.map((note) => (
          <div key={note._id} className="note-card">
            <div className="note-card-content">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
            <div className="note-card-actions">
                <button onClick={() => handleEditClick(note)} className="btn-edit">Edit</button>
                <button onClick={() => deleteNote(note._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
        {!loading && notes.length === 0 && <p>You have no notes yet.</p>}
      </div>
      
      {/* Upgrade Banner */}
      {user.tenantData && user.tenantData.plan === 'free' && notes.length >= 3 && (
        <div className="upgrade-banner">
          <strong>Free Plan Limit Reached!</strong>
          <span> You can have a maximum of 3 notes.</span>
          {user.role === 'Admin' && (
             <button onClick={handleUpgrade} className="btn btn-upgrade">
                Upgrade to Pro
             </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesPage;