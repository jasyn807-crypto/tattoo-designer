import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for navigation

const PricingPage = () => {
    const plans = [
        {
            name: "Free",
            price: "$0/month",
            features: [
                "Limited AI generations (5/day)",
                "Basic design tools",
                "Access to public designs",
                "Standard support"
            ],
            buttonText: "Current Plan",
            buttonVariant: "secondary",
            disabled: true
        },
        {
            name: "Premium",
            price: "$9.99/month",
            features: [
                "Unlimited AI generations",
                "Advanced design tools",
                "Access to premium designs",
                "Priority support",
                "Ad-free experience"
            ],
            buttonText: "Upgrade to Premium",
            buttonVariant: "primary",
            link: "/checkout/premium" // Placeholder link
        },
        {
            name: "Pro",
            price: "$19.99/month",
            features: [
                "All Premium features",
                "Exclusive AI models",
                "Early access to new features",
                "Dedicated account manager",
                "Commercial usage rights"
            ],
            buttonText: "Upgrade to Pro",
            buttonVariant: "success",
            link: "/checkout/pro" // Placeholder link
        }
    ];

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Choose Your Plan</h1>
            <p className="text-center mb-5">Unlock powerful features and take your tattoo designs to the next level.</p>

            <Row className="justify-content-center">
                {plans.map((plan, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Header className="text-center bg-light py-3">
                                <h3 className="mb-0">{plan.name}</h3>
                            </Card.Header>
                            <Card.Body className="d-flex flex-column">
                                <h2 className="text-center mb-3">{plan.price}</h2>
                                <ul className="list-unstyled flex-grow-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto text-center">
                                    {plan.link ? (
                                        <Button as={Link} to={plan.link} variant={plan.buttonVariant} size="lg" disabled={plan.disabled}>
                                            {plan.buttonText}
                                        </Button>
                                    ) : (
                                        <Button variant={plan.buttonVariant} size="lg" disabled={plan.disabled}>
                                            {plan.buttonText}
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PricingPage;