import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateDesign, refineDesign, getMySubscription } from '../services/apiService';
import { Alert, Badge, Button } from 'react-bootstrap'; // Import Button for upgrade prompt

function DesignGenerationPage() {
  const [designPreference, setDesignPreference] = useState('');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [currentDesignId, setCurrentDesignId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null); // New state for subscription
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true); // New state for subscription loading
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await getMySubscription();
          setUserSubscription(response.data);
        } catch (err) {
          console.error('Failed to fetch subscription status:', err);
          // If there's an error, assume free plan or no subscription
          setUserSubscription({ plan: 'Free', isActive: false });
        }
      } else {
        setUserSubscription({ plan: 'Free', isActive: false }); // Default to free if not logged in
      }
      setIsSubscriptionLoading(false);
    };
    fetchSubscriptionStatus();
  }, []);

  const isPremiumUser = userSubscription?.plan === 'Premium' || userSubscription?.plan === 'Pro';
  const isFreeUser = userSubscription?.plan === 'Free';

  const handleGenerateDesign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);
    setSuccessMessage(null);

    if (isFreeUser && !isSubscriptionLoading) {
      setError('Free users are limited in AI generations. Please upgrade to Premium or Pro for unlimited access.');
      setIsLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Please log in to generate designs.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const designData = { prompt: designPreference };
      const response = await generateDesign(designData, token);
      setGeneratedImage(response.imageUrl);
      setCurrentDesignId(response.design._id);
      setSuccessMessage('Design generated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to generate design.');
      console.error('Generate design error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineDesign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!currentDesignId) {
      setError('No design to refine. Generate a design first.');
      setIsLoading(false);
      return;
    }
    if (!refinementPrompt) {
      setError('Please provide a refinement prompt.');
      setIsLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Please log in to refine designs.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const refinementData = { designId: currentDesignId, refinementPrompt };
      const response = await refineDesign(refinementData, token);
      setGeneratedImage(response.imageUrl);
      setCurrentDesignId(response.design._id); // Update with new refined design ID
      setSuccessMessage('Design refined successfully!');
      setRefinementPrompt(''); // Clear refinement prompt
    } catch (err) {
      setError(err.message || 'Failed to refine design.');
      console.error('Refine design error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateDesign = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!currentDesignId) {
      setError('No design to regenerate. Generate a design first.');
      setIsLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Please log in to regenerate designs.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      // Regenerate using the current design's ID to fetch its original parameters
      const designData = { designId: currentDesignId };
      const response = await generateDesign(designData, token);
      setGeneratedImage(response.imageUrl);
      setCurrentDesignId(response.design._id); // Update with new regenerated design ID
      setSuccessMessage('Design regenerated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to regenerate design.');
      console.error('Regenerate design error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Design Generation {isPremiumUser && <Badge bg="info">Premium</Badge>}</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {isSubscriptionLoading ? (
        <p>Loading subscription status...</p>
      ) : isFreeUser && (
        <Alert variant="warning" className="text-center">
          You are currently on the Free plan. Upgrade to Premium or Pro for unlimited AI generations and more features!
          <Button variant="info" className="ms-3" onClick={() => navigate('/pricing')}>
            Upgrade Now
          </Button>
        </Alert>
      )}

      <form onSubmit={handleGenerateDesign}>
        <div>
          <label>Design Preferences:</label>
          <textarea
            value={designPreference}
            onChange={(e) => setDesignPreference(e.target.value)}
            placeholder="e.g., 'A realistic lion head tattoo for the shoulder, black and grey'"
            rows="5"
            cols="50"
            disabled={isLoading}
          ></textarea>
        </div>
        <button type="submit" disabled={isLoading || isFreeUser}>
          {isLoading ? 'Generating...' : 'Generate Design'}
        </button>
      </form>

      {generatedImage && (
        <div>
          <h2>Generated Design:</h2>
          <img src={generatedImage} alt="Generated Tattoo Design" style={{ maxWidth: '100%' }} />
          
          {/* Refinement UI */}
          <h3>Refine Design</h3>
          <form onSubmit={handleRefineDesign}>
            <div>
              <label>Refinement Prompt:</label>
              <textarea
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                placeholder="e.g., 'Make it more abstract, add tribal elements'"
                rows="3"
                cols="50"
                disabled={isLoading}
              ></textarea>
            </div>
            <button type="submit" disabled={isLoading || isFreeUser}>
              {isLoading ? 'Refining...' : 'Refine Design'}
            </button>
          </form>

          {/* Regeneration UI */}
          <button onClick={handleRegenerateDesign} disabled={isLoading || isFreeUser} style={{ marginTop: '10px' }}>
            {isLoading ? 'Regenerating...' : 'Generate Again'}
          </button>
        </div>
      )}
    </div>
  );
}

export default DesignGenerationPage;