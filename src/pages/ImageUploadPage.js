import React, { useState } from 'react';
import { uploadImage } from '../services/apiService'; // Import the API service
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function ImageUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Renamed for clarity
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedImageUrl(null); // Clear previous image
    setError(null); // Clear previous errors
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await uploadImage(selectedFile, token);
      setUploadedImageUrl(response.imageUrl); // Set the URL from the backend response
      alert('Image uploaded successfully!');
      // Optionally, redirect to the modification page with the uploaded image URL
      navigate('/modify-image', { state: { imageUrl: response.imageUrl } });
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUploadImage} disabled={!selectedFile || isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </button>

      {isLoading && <p>Uploading image...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {uploadedImageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUploadPage;