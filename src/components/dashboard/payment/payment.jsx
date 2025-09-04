import './payment.css'
import DotGrid from '../../ui/dotGrid/dotgrid';
import StripeCheckout from '../../stripe/stripeCheckout';

const Payment = () => {
    return (
        <div className="payment-main">

            <StripeCheckout />
        </div>
    )
}

export default Payment;