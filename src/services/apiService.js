const API_BASE_URL = 'http://localhost:5000/api'; // Assuming backend runs on port 5000

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const generateDesign = async (designData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/generate-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(designData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Design generation failed');
    }
    return data;
  } catch (error) {
    console.error('Design generation error:', error);
    throw error;
  }
};

export const refineDesign = async (refinementData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/designs/refine-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(refinementData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Design refinement failed');
    }
    return data;
  } catch (error) {
    console.error('Design refinement error:', error);
    throw error;
  }
};

export const uploadImage = async (imageFile, token) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/images/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }
    return data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

export const removeBackgroundImage = async (imageUrl, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/modify-image/background-removal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Background removal failed');
    }
    return data;
  } catch (error) {
    console.error('Background removal error:', error);
    throw error;
  }
};

export const convertToOutline = async (imageUrl, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/modify-image/outline-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Outline conversion failed');
    }
    return data;
  } catch (error) {
    console.error('Outline conversion error:', error);
    throw error;
  }
};

export const getDesigns = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/designs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch designs');
    }
    return data;
  } catch (error) {
    console.error('Fetch designs error:', error);
    throw error;
  }
};

export const fetchArtists = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/artists?${query}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch artists');
    }
    return data;
  } catch (error) {
    console.error('Fetch artists error:', error);
    throw error;
  }
};

export const fetchArtistById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch artist');
    }
    return data;
  } catch (error) {
    console.error('Fetch artist by ID error:', error);
    throw error;
  }
};

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Collection Management
export const createCollection = async (collectionData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(collectionData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create collection');
    }
    return data;
  } catch (error) {
    console.error('Create collection error:', error);
    throw error;
  }
};

export const getCollections = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch collections');
    }
    return data;
  } catch (error) {
    console.error('Fetch collections error:', error);
    throw error;
  }
};

export const getCollectionById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch collection');
    }
    return data;
  } catch (error) {
    console.error('Fetch collection by ID error:', error);
    throw error;
  }
};

export const updateCollection = async (id, updateData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update collection');
    }
    return data;
  } catch (error) {
    console.error('Update collection error:', error);
    throw error;
  }
};

export const getMySubscription = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/subscriptions/my-subscription`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch subscription');
    }
    return data;
  } catch (error) {
    console.error('Fetch subscription error:', error);
    throw error;
  }
};

export const createCheckoutSession = async (plan) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/subscriptions/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create checkout session');
    }
    return data;
  } catch (error) {
    console.error('Create checkout session error:', error);
    throw error;
  }
};

export const deleteCollection = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete collection');
    }
    return data;
  } catch (error) {
    console.error('Delete collection error:', error);
    throw error;
  }
};