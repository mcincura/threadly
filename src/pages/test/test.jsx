import { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const STRIPE_PUBLIC_KEY = "pk_test_51S3YAs7GapckM751dqbjBCkO0d6rPxbqmoI7MEJgSEUcoSQP4fRXDZ38LnTuUJmC5j77E9eCztLwIuHhSMQP9Ex000QCcDYywf";
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ email, userId, deviceCount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const cardElement = elements.getElement(CardElement);

            // Step 1: Create PaymentMethod
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: { email },
            });

            if (pmError) {
                setError(pmError.message);
                setLoading(false);
                return;
            }

            // Step 2: Send to backend to create subscription
            const { data } = await axios.post("http://localhost:3001/test/subscribe", {
                paymentMethodId: paymentMethod.id,
                email,
                user_id: userId,
                device_count: deviceCount,
            });

            console.log("Backend response:", data);

            // Step 3: Handle cases
            if (data.subscriptionStatus === "active") {
                onSuccess();
            } else if (data.requiresAction && data.paymentIntentClientSecret) {
                // Step 4: Handle 3DS authentication
                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                    data.paymentIntentClientSecret
                );

                if (confirmError) {
                    console.error("3DS confirmation failed:", confirmError);
                    setError(confirmError.message);
                } else if (paymentIntent.status === "succeeded") {
                    console.log("3DS success, subscription active!");
                    onSuccess();
                } else {
                    setError("Payment could not be completed.");
                }
            } else {
                setError("Unexpected response from server.");
            }
        } catch (err) {
            console.error("Subscription failed:", err);
            setError("Subscription failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="stripe-form-wrapper">
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: { color: "#fff", "::placeholder": { color: "#ccc" } },
                            invalid: { color: "#ff5252" },
                        },
                    }}
                    className="stripe-checkout-card-input"
                />
                <button type="submit" disabled={!stripe || loading}>
                    {loading ? "Processing..." : "Subscribe"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

const Test = () => {
    const email = "test@example.com";
    const userId = 69;

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                email={email}
                userId={userId}
                deviceCount={28}
                onSuccess={() => alert("Subscription successful!")}
            />
        </Elements>
    );
};

export default Test;
