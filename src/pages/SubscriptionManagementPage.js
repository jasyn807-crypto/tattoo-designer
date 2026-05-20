import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { getMySubscription, createCheckoutSession } from '../services/apiService'; // Assuming apiService exists

const SubscriptionManagementPage = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscription = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getMySubscription();
            setSubscription(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch subscription details.');
        } finally {
            setLoading(false);
        }
    }, [setSubscription, setLoading, setError]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const handleUpgrade = async (plan) => {
        try {
            const response = await createCheckoutSession(plan);
            // Redirect to payment gateway
            window.location.href = response.data.checkoutUrl;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate checkout session.');
        }
    };

    const handleCancel = () => {
        // Placeholder for cancellation logic
        alert('Cancellation functionality not yet implemented.');
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading subscription details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Subscription Management</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white py-3">
                            <h4 className="mb-0">Your Current Plan</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Plan:</strong> {subscription?.plan}</p>
                            <p><strong>Status:</strong> {subscription?.isActive ? 'Active' : 'Inactive'}</p>
                            {subscription?.startDate && <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>}
                            {subscription?.endDate && <p><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>}

                            <hr />

                            <h5>Manage Your Subscription</h5>
                            {subscription?.plan === 'Free' && (
                                <Button variant="success" className="me-2" onClick={() => handleUpgrade('Premium')}>
                                    Upgrade to Premium
                                </Button>
                            )}
                            {subscription?.plan === 'Premium' && (
                                <>
                                    <Button variant="success" className="me-2" onClick={() => handleUpgrade('Pro')}>
                                        Upgrade to Pro
                                    </Button>
                                    <Button variant="warning" className="me-2" onClick={handleCancel}>
                                        Cancel Subscription
                                    </Button>
                                </>
                            )}
                            {subscription?.plan === 'Pro' && (
                                <Button variant="warning" className="me-2" onClick={handleCancel}>
                                    Cancel Subscription
                                </Button>
                            )}
                            {/* Add downgrade options if applicable */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SubscriptionManagementPage;