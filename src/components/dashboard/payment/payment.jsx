import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import { IconCreditCardPay, IconX } from "@tabler/icons-react";
import './payment.css';

const STRIPE_PUBLIC_KEY = "pk_test_51S3YAs7GapckM751dqbjBCkO0d6rPxbqmoI7MEJgSEUcoSQP4fRXDZ38LnTuUJmC5j77E9eCztLwIuHhSMQP9Ex000QCcDYywf";
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Payment = ({ user }) => {
	const [loading, setLoading] = useState(true);
	const [subscription, setSubscription] = useState(null);
	const [invoices, setInvoices] = useState([]);
	const [error, setError] = useState("");
	const [cancelLoading, setCancelLoading] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [pmLoading, setPmLoading] = useState(false);
	const [pmError, setPmError] = useState("");
	const [pmSuccess, setPmSuccess] = useState("");

	// Fetch payment dashboard data
	useEffect(() => {
		if (user?.user?.stripe_customer_id) {
			fetchSubscriptionData();
		}
	}, [user]);

	//fetch subscription data:
	const fetchSubscriptionData = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch("http://localhost:3001/payment/dashboard", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ stripe_customer_id: user?.user?.stripe_customer_id }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch payment data");
			setSubscription(data.subscription);
			setInvoices(data.invoices);
		} catch (err) {
			setError(err.message);
		}
		setLoading(false);
	};

	// Fetch payment methods
	const fetchPaymentMethods = async () => {
		setPmLoading(true);
		setPmError("");
		try {
			const res = await fetch("http://localhost:3001/payment/methods", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ stripe_customer_id: user?.user?.stripe_customer_id }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch payment methods");
			let methods = data.paymentMethods || [];
			// Sort: default payment method first
			methods = methods.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
			setPaymentMethods(methods);
		} catch (err) {
			setPmError(err.message);
		}
		setPmLoading(false);
	};

	// Cancel subscription
	const handleCancelSubscription = async () => {
		if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
		setCancelLoading(true);
		setError("");
		try {
			const res = await fetch("http://localhost:3001/payment/cancel", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ stripe_customer_id: user?.user?.stripe_customer_id }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to cancel subscription");
			setSubscription(null);
		} catch (err) {
			setError(err.message);
		}
		setCancelLoading(false);
	};

	// Payment method actions
	//delete payment method
	const handleDeletePaymentMethod = async (pmId) => {
		if (!window.confirm("Delete this payment method?")) return;
		setPmLoading(true);
		setPmError("");
		setPmSuccess("");
		try {
			const res = await fetch("http://localhost:3001/payment/methods/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ stripe_customer_id: user?.user?.stripe_customer_id, payment_method_id: pmId }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to delete payment method");
			setPmSuccess("Payment method deleted.");
			await fetchPaymentMethods();
		} catch (err) {
			setPmError(err.message);
		}
		setPmLoading(false);
	};

	//set default payment method
	const handleSetDefaultPaymentMethod = async (pmId) => {
		setPmLoading(true);
		setPmError("");
		setPmSuccess("");
		try {
			const res = await fetch("http://localhost:3001/payment/methods/default", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ stripe_customer_id: user?.user?.stripe_customer_id, payment_method_id: pmId }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to set default payment method");
			setPmSuccess("Default payment method updated.");
			await fetchPaymentMethods();
		} catch (err) {
			setPmError(err.message);
		}
		setPmLoading(false);
	};

	//add payment method
	const AddPaymentMethod = ({ user }) => {
		const stripe = useStripe();
		const elements = useElements();
		const [inputHeight, setInputHeight] = useState(40);

		const handleAddPaymentMethod = async (e) => {
			e.preventDefault();
			if (!stripe || !elements) return;

			const cardElement = elements.getElement(CardElement);

			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: "card",
				card: cardElement,
			});

			if (error) {
				console.error(error);
				return;
			}

			const res = await fetch("http://localhost:3001/payment/methods/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					stripe_customer_id: user?.user?.stripe_customer_id,
					payment_method_id: paymentMethod.id,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				console.error(data.error);
			} else {
				console.log("Payment method added:", paymentMethod.id);
			}
		};

		return (
			<div className="add-pm-form-wrapper">
				<form onSubmit={handleAddPaymentMethod} >
					<CardElement
						options={{
							hidePostalCode: true,
							style: {
								base: { color: "#fff", "::placeholder": { color: "#ccc" } },
								invalid: { color: "#ff5252" },
							}
						}}
					/>
					<button type="add-pm-submit" style={{ height: `${inputHeight}px` }}><IconCreditCardPay stroke={2} /></button>
				</form>
			</div>
		);
	};

	const openPaymentModal = () => {
		setShowPaymentModal(true);
		setPmSuccess("");
		setPmError("");
		fetchPaymentMethods();
	};

	const closePaymentModal = () => {
		setShowPaymentModal(false);
		setPaymentMethods([]);
	};

	const openDeleteModal = () => {
		setShowDeleteConfirm(true);
	}

	return (
		<div className="payment-main">
			<div className="payment-main-bg" />
			<h1 className="payment-main-header">Subscription</h1>
			<div className="payment-main-content">
				{loading && <p>Loading payment info...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{!loading && !error && (
					<>
						{subscription ? (
							<div className="subscription-info">
								<p>Status: {subscription.status}</p>
								<p>Amount: {(subscription.amount / 100).toFixed(2)} {subscription.currency?.toUpperCase()}</p>
								<p>Next Billing Date: {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleString() : "N/A"}</p>
								<p>Latest Invoice Status: {subscription.latest_invoice_status}</p>
								<button
									className="cancel-btn"
									onClick={handleCancelSubscription}
									disabled={cancelLoading}
								>
									{cancelLoading ? "Cancelling..." : "Cancel Subscription"}
								</button>
							</div>
						) : (
							<p>No active subscription found.</p>
						)}
						<button className="payment-methods-btn" onClick={openPaymentModal}>
							Payment Methods
						</button>
						<h2>Invoices</h2>
						<div className="invoice-list">
							{invoices.length > 0 ? (
								invoices.map(inv => (
									<div className="invoice-card" key={inv.id}>
										<div className="invoice-header">
											<a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
												Invoice #{inv.id.slice(-8)}
											</a>
											<span className={`invoice-status ${inv.status}`}>{inv.status}</span>
										</div>
										<div className="invoice-details">
											<div>
												<strong>Paid:</strong> ${(inv.amount_paid / 100).toFixed(2)}
											</div>
											<div>
												<strong>Due:</strong> ${(inv.amount_due / 100).toFixed(2)}
											</div>
											<div>
												<strong>Date:</strong> {new Date(inv.created).toLocaleString()}
											</div>
										</div>
									</div>
								))
							) : (
								<p>No invoices found.</p>
							)}
						</div>
					</>
				)}
			</div>

			{/* Payment methods modal */}
			{showPaymentModal && (
				<div className="modal-overlay" onClick={closePaymentModal}>
					<div className="modal-content" onClick={e => e.stopPropagation()}>
						<h2>Manage Payment Methods</h2>
						{pmLoading && <p>Loading...</p>}
						{pmError && <p style={{ color: "red" }}>{pmError}</p>}
						{pmSuccess && <p style={{ color: "green" }}>{pmSuccess}</p>}
						<ul className="payment-method-list">
							{paymentMethods.map(pm => (
								<li key={pm.id} className={`payment-method-item ${pm.is_default ? 'default' : ''}`}>
									<div className="payment-method-info">
										<PaymentIcon type={pm.card?.brand} format="flatRounded" style={{ width: '40px', height: '25px' }} />

										<span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
											**** {pm.card?.last4}
										</span>
										<span style={{ color: "#828282ff", marginLeft: "1rem" }}>
											({pm.card?.exp_month}/{pm.card?.exp_year})
										</span>
									</div>
									<div className="default-pm">
										{pm.is_default && <button className="default-badge">Default</button>}
									</div>
									<div className="normal-pm">
										{!pm.is_default && (
											<button onClick={() => handleSetDefaultPaymentMethod(pm.id)} disabled={pmLoading} className="set-default-btn">
												Set Default
											</button>
										)}
										{!pm.is_default && (
											<button onClick={() => handleDeletePaymentMethod(pm.id)} disabled={pmLoading} className="delete-btn">
												Delete
											</button>
										)}
									</div>
								</li>
							))}
						</ul>
						<div className="add-payment-method-form">
							<h3>Add New Payment Method</h3>
							<Elements stripe={stripePromise} style={{ height: "200px" }}>
								<AddPaymentMethod user={user} style={{ height: "200px" }} />
							</Elements>
						</div>
						<div className="modal-close-button" onClick={closePaymentModal}>
							<IconX size={24} />
						</div>
					</div>
				</div>
			)}

			{/* Delete confirmation modal */}
			{showDeleteConfirm && (
				<div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
					<div className="modal-content" onClick={e => e.stopPropagation()}>
						<h2>Confirm Deletion</h2>
						<p>Are you sure you want to delete this payment method?</p>
						<div className="confirm-buttons">
							<button onClick={() => setShowDeleteConfirm(false)} className="cancel-btn">Cancel</button>
							<button onClick={confirmDeletePaymentMethod} className="delete-btn" disabled={pmLoading}>
								{pmLoading ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Payment;