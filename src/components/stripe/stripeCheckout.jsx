import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51S3YAs7GapckM751dqbjBCkO0d6rPxbqmoI7MEJgSEUcoSQP4fRXDZ38LnTuUJmC5j77E9eCztLwIuHhSMQP9Ex000QCcDYywf'); // Your publishable key

const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [message, setMessage] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		const res = await fetch('http://localhost:3001/payment/create-payment-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ amount: 19099, currency: 'usd' }), // $190.99
		});
		const { clientSecret } = await res.json();

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
		});

		if (result.error) {
			setMessage(result.error.message);
		} else {
			if (result.paymentIntent.status === 'succeeded') {
				setMessage('Payment successful!');
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement />
			<button type="submit" disabled={!stripe}>Pay</button>
			{message && <div>{message}</div>}
		</form>
	);
};

const StripeCheckout = () => (
	<Elements stripe={stripePromise}>
		<CheckoutForm />
	</Elements>
);

export default StripeCheckout;