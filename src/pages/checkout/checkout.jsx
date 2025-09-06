import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UserContext } from "../../app/context/userContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import './checkout.css';

const API_URL = "http://localhost:3001/auth";
const STRIPE_PUBLIC_KEY = "pk_test_51S3YAs7GapckM751dqbjBCkO0d6rPxbqmoI7MEJgSEUcoSQP4fRXDZ38LnTuUJmC5j77E9eCztLwIuHhSMQP9Ex000QCcDYywf"; // <-- Replace with your key

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

const Checkout = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		verification_code: ""
	});
	const [passwordError, setPasswordError] = useState("");
	const [awaitingVerification, setAwaitingVerification] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showStripe, setShowStripe] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const { setLoggedIn, setUser } = useContext(UserContext);
	const [amount, setAmount] = useState(null);
	const [deviceCount, setDeviceCount] = useState(1);
	const { user } = useContext(UserContext);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const devices = parseInt(params.get("devices"), 10) || 1;
		setDeviceCount(devices);
		axios.post("http://localhost:3001/payment/device-price", { device_count: devices })
			.then(res => {
				// Convert dollars to cents for Stripe
				setAmount(Math.round(Number(res.data.price) * 100));
			})
			.catch(() => setAmount(9700)); // fallback: $97 in cents
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (name === "password") validatePasswordStrength(value);
		if (passwordError) setPasswordError("");
	};

	const validatePasswordStrength = (password) => {
		const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
		if (!strongPattern.test(password)) {
			setPasswordError("Password must be 8+ chars, include upper & lower case, number, and symbol");
		} else {
			setPasswordError("");
		}
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		const { email, password, confirmPassword } = formData;
		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}
		if (passwordError) return;
		setLoading(true);
		try {
			await axios.post(`${API_URL}/signup`, { email, password });
			setAwaitingVerification(true);
		} catch (err) {
			setPasswordError(err.response?.data?.error || "Signup failed");
		}
		setLoading(false);
	};

	const handleVerify = async (e) => {
		const getCookie = (name) => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop().split(';').shift();
			return null;
		};
		const ref_link = getCookie("ref");

		e.preventDefault();
		const { email, verification_code } = formData;
		setLoading(true);
		try {
			const response = await axios.post(`${API_URL}/verify`, { email, verification_code, ref_link });
			const loginRes = await axios.post(`${API_URL}/login`, { email, password: formData.password }, { withCredentials: true });
			setLoggedIn(true);
			setUser(loginRes.data);

			// Record affiliate register event
			if (response.status === 200 && ref_link) {
				await axios.post("http://localhost:3001/event/register", {
					ref_link,
					user_email: email
				});
			}

			setShowStripe(true);
		} catch (err) {
			setPasswordError(err.response?.data?.error || "Verification failed");
		}
		setLoading(false);
	};

	const handlePaymentSuccess = async () => {
		setPaymentSuccess(true);

		const getCookie = (name) => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop().split(';').shift();
			return null;
		};
		const ref_link = getCookie("ref");

		const user_email = formData.email;

		const dollarAmount = (amount / 100).toFixed(2);

		try {
			await axios.post("http://localhost:3001/event/payment", {
				ref_link,
				user_email,
				amount: dollarAmount
			});
		} catch (err) {
			console.error("Affiliate payment event failed:", err);
		}
	};

	const handleRedirectToDashboard = () => {
		window.location.href = "/dashboard";
	};

	return (
		<div className="checkout-main">
			<div className="checkout-main-bg">
				{!showStripe && !paymentSuccess && (
					<>
						<motion.div className="signup-container"
							initial={{ opacity: 0, top: "150%" }}
							animate={{ opacity: 1, top: "50%" }}
							transition={{ duration: 0.5, ease: "easeOut" }}
						>
							<h1 className="checkout-signup-header">Create an Account</h1>
							<h3 className="checkout-signup-subheader">You will be using this account to log in to the dashboard.</h3>
							{!awaitingVerification ? (
								<div className="signup-form-wrapper">
									<form onSubmit={handleSignup}>
										<input
											type="email"
											name="email"
											placeholder="Email"
											value={formData.email}
											onChange={handleChange}
											required
											style={{ display: "block", marginBottom: 12, width: "100%" }}
										/>
										<input
											type="password"
											name="password"
											placeholder="Password"
											value={formData.password}
											onChange={handleChange}
											required
											style={{ display: "block", marginBottom: 12, width: "100%" }}
										/>
										<input
											type="password"
											name="confirmPassword"
											placeholder="Retype Password"
											value={formData.confirmPassword}
											onChange={handleChange}
											required
											style={{ display: "block", marginBottom: 12, width: "100%" }}
										/>
										{passwordError && (
											<p style={{ color: "red", marginBottom: 12 }}>{passwordError}</p>
										)}
										<button type="submit" disabled={loading}>
											{loading ? "Creating..." : "Create Account"}
										</button>
									</form>
								</div>
							) : (
								<div className="verification-form-wrapper">
									<form onSubmit={handleVerify}>
										<p>Enter the verification code sent to your email:</p>
										<input
											type="text"
											name="verification_code"
											placeholder="Verification Code"
											value={formData.verification_code}
											onChange={handleChange}
											required
											style={{ display: "block", marginBottom: 12, width: "100%" }}
										/>
										<button type="submit" disabled={loading}>
											{loading ? "Verifying..." : "Verify Email"}
										</button>
										{passwordError && (
											<p style={{ color: "red", marginTop: 12 }}>{passwordError}</p>
										)}
									</form>
								</div>
							)}
						</motion.div>
					</>
				)}
				{showStripe && !paymentSuccess && amount !== null && (
					<div className="stripe-container">
						<h1 className="checkout-stripe-header">Checkout</h1>
						<div className="checkout-total-container">
							<div className={`total-base-price ${deviceCount > 1 ? "with-extras" : ""}`}>
								<h3>Base price</h3>
								<h3>$97.00/month</h3>
							</div>
							{deviceCount > 1 && (
								<div className="total-extra-devices">
									<h3>+ {deviceCount - 1} additional device{deviceCount - 1 > 1 ? "s" : ""}</h3>
									<h3>${((amount / 100) - 97).toFixed(2)}/month</h3>
								</div>
							)}
							<div className="total-divider"></div>
							<div className="total-total-price">
								<h2>Total:</h2>
								<h2>${(amount / 100).toFixed(2)}/month</h2>
							</div>
						</div>
						<Elements stripe={stripePromise}>
							<CheckoutForm
								email={formData.email}
								userId={user.user.id}
								deviceCount={deviceCount}
								onSuccess={handlePaymentSuccess}
							/>
						</Elements>
					</div>
				)}
				{paymentSuccess && (
					<div className="payment-success-container">
						<h1 className="checkout-success-header">Payment Successful</h1>
						<h3 className="checkout-signup-subheader">Thank you for your purchase.</h3>
						<button onClick={handleRedirectToDashboard} className="checkout-success-button" type="submit">Dashboard</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Checkout;