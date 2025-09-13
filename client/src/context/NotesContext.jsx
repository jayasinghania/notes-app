import { createContext, useState, useEffect, useContext } from 'react';
import notesService from '../services/notesService';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      notesService.getNotes().then((data) => {
        setNotes(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const createNote = async (noteData) => {
    const newNote = await notesService.createNote(noteData.title, noteData.content);
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const deleteNote = async (id) => {
    await notesService.deleteNote(id);
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
  };
  
  const value = {
    notes,
    loading,
    createNote,
    deleteNote,
    setNotes
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};