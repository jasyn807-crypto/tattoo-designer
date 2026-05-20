import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as apiService from '../services/apiService';

const ImageModificationPage = () => {
  const location = useLocation();
  const initialImageUrl = location.state?.imageUrl;

  const [currentImage, setCurrentImage] = useState(initialImageUrl);
  const [modifiedImage, setModifiedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialImageUrl) {
      setCurrentImage(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleRemoveBackground = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.removeBackgroundImage(currentImage);
      setModifiedImage(response.data.imageUrl);
    } catch (err) {
      setError('Failed to remove background.');
      console.error('Error removing background:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToOutline = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.convertToOutline(currentImage);
      setModifiedImage(response.data.imageUrl);
    } catch (err) {
      setError('Failed to convert to outline.');
      console.error('Error converting to outline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineDesign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.refineDesign(currentImage);
      setModifiedImage(response.data.imageUrl);
    } catch (err) {
      setError('Failed to refine design.');
      console.error('Error refining design:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Modification</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h2>Current Image:</h2>
          <img src={currentImage} alt="Current" style={{ maxWidth: '100%' }} />
          <div>
            <button onClick={handleRemoveBackground} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Remove Background'}
            </button>
            <button onClick={handleConvertToOutline} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Convert to Outline'}
            </button>
            <button onClick={handleRefineDesign} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Refine Design'}
            </button>
          </div>
        </div>
        {modifiedImage && (
          <div>
            <h2>Modified Image:</h2>
            <img src={modifiedImage} alt="Modified" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModificationPage;