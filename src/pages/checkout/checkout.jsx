import './checkout.css';

const Checkout = () => {
	return (
		<div>
			<h1>Create an Account</h1>
			<form>
				<input type="email" placeholder="Email" />
				<input type="password" placeholder="Password" />
				<button type="submit">Create Account</button>
			</form>
		</div>
	);
}

export default Checkout;