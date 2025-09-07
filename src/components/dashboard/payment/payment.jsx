import { useEffect, useState } from "react";
import Iridescence from "../../ui/iridescence.js";
import './payment.css';

const Payment = ({ user }) => {
	const [loading, setLoading] = useState(true);
	const [subscription, setSubscription] = useState(null);
	const [invoices, setInvoices] = useState([]);
	const [error, setError] = useState("");
	const [cancelLoading, setCancelLoading] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
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
			setPaymentMethods(data.paymentMethods || []);
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

	const handleAddPaymentMethod = async (e) => {
		e.preventDefault();
		setPmLoading(true);
		setPmError("");
		setPmSuccess("");
		const form = e.target;
		const cardNumber = form.cardNumber.value;
		const expMonth = form.expMonth.value;
		const expYear = form.expYear.value;
		const cvc = form.cvc.value;
		try {
			const res = await fetch("http://localhost:3001/payment/methods/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					stripe_customer_id: user?.user?.stripe_customer_id,
					card: { number: cardNumber, exp_month: expMonth, exp_year: expYear, cvc }
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to add payment method");
			setPmSuccess("Payment method added.");
			form.reset();
			await fetchPaymentMethods();
		} catch (err) {
			setPmError(err.message);
		}
		setPmLoading(false);
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

			{/* Payment Methods Modal */}
			{showPaymentModal && (
				<div className="modal-overlay" onClick={closePaymentModal}>
					<div className="modal-content" onClick={e => e.stopPropagation()}>
						<h2>Manage Payment Methods</h2>
						{pmLoading && <p>Loading...</p>}
						{pmError && <p style={{ color: "red" }}>{pmError}</p>}
						{pmSuccess && <p style={{ color: "green" }}>{pmSuccess}</p>}
						<ul className="payment-method-list">
							{paymentMethods.map(pm => (
								<li key={pm.id} className="payment-method-item">
									<span>
										{pm.card?.brand?.toUpperCase()} **** {pm.card?.last4} (exp {pm.card?.exp_month}/{pm.card?.exp_year})
										{pm.is_default && <span className="default-badge">Default</span>}
									</span>
									<div>
										{!pm.is_default && (
											<button onClick={() => handleSetDefaultPaymentMethod(pm.id)} disabled={pmLoading}>
												Set Default
											</button>
										)}
										<button onClick={() => handleDeletePaymentMethod(pm.id)} disabled={pmLoading}>
											Delete
										</button>
									</div>
								</li>
							))}
						</ul>
						<form className="add-payment-method-form" onSubmit={handleAddPaymentMethod}>
							<h3>Add Payment Method</h3>
							<input name="cardNumber" type="text" placeholder="Card Number" required minLength={12} maxLength={19} />
							<input name="expMonth" type="number" placeholder="Exp Month" required min={1} max={12} />
							<input name="expYear" type="number" placeholder="Exp Year" required min={2024} max={2100} />
							<input name="cvc" type="text" placeholder="CVC" required minLength={3} maxLength={4} />
							<button type="submit" disabled={pmLoading}>Add</button>
						</form>
						<button className="close-modal-btn" onClick={closePaymentModal}>Close</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Payment;