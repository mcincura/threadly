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

	const [pmToDelete, setPmToDelete] = useState();
	const [showAddPmSuccess, setShowAddPmSuccess] = useState(false);

	// Fetch payment dashboard data
	useEffect(() => {
		if (user?.user?.stripe_customer_id) {
			fetchSubscriptionData();
			fetchPaymentMethods();
		}
	}, [user]);

	//fetch subscription data
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

	//delete payment method
	const handleDeletePaymentMethod = async (pmId) => {
		setShowDeleteConfirm(false);
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
			//setPmSuccess("Payment method deleted.");
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
		const [adding, setAdding] = useState(false);

		const handleAddPaymentMethod = async (e) => {
			e.preventDefault();
			if (!stripe || !elements) return;
			setAdding(true);

			const cardElement = elements.getElement(CardElement);

			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: "card",
				card: cardElement,
			});

			if (error) {
				console.error(error);
				setAdding(false);
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
			setAdding(false);
			if (!res.ok) {
				console.error(data.error);

			} else {
				console.log("Payment method added:", paymentMethod.id);
				fetchPaymentMethods();
				setShowAddPmSuccess(true);
				setTimeout(() => setShowAddPmSuccess(false), 3000);
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
	};

	const closePaymentModal = () => {
		setShowPaymentModal(false);
	};

	const openDeleteModal = (pmID) => {
		setPmToDelete(pmID);
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
								<div className="subscription-info-container">
									<p><span>Status:</span> {subscription.status}</p>
									<p><span>Amount:</span> {(subscription.amount / 100).toFixed(2)} {subscription.currency?.toUpperCase()}</p>
									<p><span>Next Billing Date:</span> {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleString() : "N/A"}</p>
									<p><span>Latest Invoice Status:</span> {subscription.latest_invoice_status}</p>
								</div>
								<div className="subscription-info-buttons">
									<button
										className="cancel-btn"
										onClick={handleCancelSubscription}
										disabled={cancelLoading}
									>
										{cancelLoading ? "Cancelling..." : "Cancel Subscription"}
									</button>
									<button className="payment-methods-btn" onClick={openPaymentModal}>
										Payment Methods
									</button>
								</div>
							</div>

						) : (
							<p>No active subscription found.</p>
						)}
						<h2>Invoices</h2>
						<div className="invoice-table-wrapper">
							{invoices.length > 0 ? (
								<table className="invoice-table">
									<thead>
										<tr>
											<th>Invoice #</th>
											<th>Issued</th>
											<th>Total Amount</th>
											<th>Amount Remaining</th>
											<th>Status</th>
											<th></th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{invoices.map(inv => (
											<tr key={inv.id}>
												<td>
													<a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
														{inv.id.slice(-8)}
													</a>
												</td>
												<td>{new Date(inv.created).toLocaleDateString()}</td>
												<td>${(inv.amount_paid / 100).toFixed(2)}</td>
												<td>${(inv.amount_due / 100).toFixed(2)}</td>
												<td>
													<span className={`invoice-status ${inv.status}`}>{inv.status}</span>
												</td>
												<td>
													<button className="pay-btn">
														Pay
													</button>
												</td>
												<td>
													<button className="invoice-menu-btn">
														&#8942;
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
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
						{/*{pmLoading && <p>Loading...</p>}*/}
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
											<button onClick={() => openDeleteModal(pm.id)} disabled={pmLoading} className="delete-btn">
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
							<button onClick={() => handleDeletePaymentMethod(pmToDelete)} className="lara-btn" disabled={pmLoading}>
								{pmLoading ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success message for adding payment method */}
			{showAddPmSuccess && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2>Payment Method Added!</h2>
						<p>Your new payment method was successfully added.</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Payment;