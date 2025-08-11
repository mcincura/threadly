import './payment.css'
import DotGrid from '../../ui/dotGrid/dotgrid';

const Payment = () => {
    return (
        <div className="payment-main">
            <div className="payment-dot-grid">
                <DotGrid
                    dotSize={4}
                    gap={15}
                    baseColor="#271E37"
                    activeColor="#5227ff"
                    proximity={200}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>
        </div>
    )
}

export default Payment;