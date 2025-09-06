import { useEffect, useState } from "react";
import './payment.css';

const Payment = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPaymentData = async () => {
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

        if (user?.user?.stripe_customer_id) {
            fetchPaymentData();
        }
    }, [user]);

    return (
        <div className="payment-main">
            {loading && <p>Loading payment info...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && (
                <>
                    <h2>Subscription</h2>
                    {subscription ? (
                        <div>
                            <p>Status: {subscription.status}</p>
                            <p>Amount: {(subscription.amount / 100).toFixed(2)} {subscription.currency?.toUpperCase()}</p>
                            <p>Next Billing Date: {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleString() : "N/A"}</p>
                            <p>Latest Invoice Status: {subscription.latest_invoice_status}</p>
                        </div>
                    ) : (
                        <p>No active subscription found.</p>
                    )}

                    <h2>Invoices</h2>
                    {invoices.length > 0 ? (
                        <ul>
                            {invoices.map(inv => (
                                <li key={inv.id}>
                                    <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">{inv.id}</a> -
                                    Paid: {(inv.amount_paid / 100).toFixed(2)} | Due: {(inv.amount_due / 100).toFixed(2)} |
                                    Status: {inv.status} | Date: {new Date(inv.created).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No invoices found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Payment;