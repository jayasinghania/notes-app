import axios from 'axios';

const NOTES_API_URL = `${import.meta.env.VITE_API_URL}/api/notes`;
const TENANTS_API_URL = `${import.meta.env.VITE_API_URL}/api/tenants`;

const getNotes = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.get(NOTES_API_URL, config);
  return response.data;
};

const createNote = async (title, content) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.post(NOTES_API_URL, { title, content }, config);
  return response.data;
};

// NEW FUNCTION TO UPDATE A NOTE
const updateNote = async (id, title, content) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.put(`${NOTES_API_URL}/${id}`, { title, content }, config);
  return response.data;
};

const deleteNote = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.delete(`${NOTES_API_URL}/${id}`, config);
  return response.data;
};

// NEW FUNCTION TO UPGRADE A TENANT
const upgradeTenant = async (slug) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const response = await axios.post(`${TENANTS_API_URL}/${slug}/upgrade`, {}, config);
    return response.data;
}

export default {
  getNotes,
  createNote,
  updateNote, // Export new function
  deleteNote,
  upgradeTenant, // Export new function
};