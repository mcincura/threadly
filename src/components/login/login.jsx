import { useState } from "react";
import axios from "axios";
import { IconEye, IconEyeOff, IconSquareX } from "@tabler/icons-react";
// ...existing imports...
import { useContext } from "react";
import { UserContext } from "../../app/context/userContext";
import "./login.css";

const API_URL = "http://localhost:3001/auth";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [closed, setClosed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        remember: false,
        verification_code: ""
    });
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    const { setLoggedIn, setUser } = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });

        if (name === "password" && isSignup) {
            validatePasswordStrength(value);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            remember: false,
            verification_code: ""
        });
        setPasswordError("");
        setAwaitingVerification(false);
    };

    const validatePasswordStrength = (password) => {
        const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!strongPattern.test(password)) {
            setPasswordError("Password must be 8+ characters, include upper & lower case, number, and symbol");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirmPassword, remember } = formData;

        try {
            if (isSignup) {
                if (password !== confirmPassword) {
                    alert("Passwords do not match");
                    return;
                }
                if (passwordError) {
                    alert("Please choose a stronger password.");
                    return;
                }
                const signupData = { email, password };
                const response = await axios.post(`${API_URL}/signup`, signupData);
                alert(response.data.message || "Signup successful. Verification pending.");
                setAwaitingVerification(true);
            } else {
                const response = await axios.post(`${API_URL}/login`, { email, password, remember }, { withCredentials: true });
                alert(response.data.message || "Login successful");
                setLoggedIn(true);
                setUser(response.data.user);
            }
        } catch (err) {
            alert(err.response?.data?.error || "An error occurred");
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const { email, verification_code } = formData;
        // Get ref from cookie if present
        const ref_link = getCookie('ref');
        try {
            const response = await axios.post(`${API_URL}/verify`, { email, verification_code, ref_link });
            alert(response.data.message || "Email verified successfully.");
            setAwaitingVerification(false);
            setIsSignup(false);
        } catch (err) {
            alert(err.response?.data?.error || "Verification failed.");
        }
    };

    if (closed) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-close-icon" onClick={() => setClosed(true)}>
                    <IconSquareX />
                </div>
                <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
                {!awaitingVerification ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IconEye /> : <IconEyeOff />}
                            </span>
                        </div>
                        {isSignup && (
                            <>
                                <div className="password-input">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                    <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <IconEye /> : <IconEyeOff />}
                                    </span>
                                </div>
                                {passwordError && (
                                    <p className="password-error">{passwordError}</p>
                                )}
                            </>
                        )}
                        {!isSignup && (
                            <div className="remember-me-wrapper">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="remember-me-checkbox"
                                />
                                <p className="remember-me-text">Remember Me</p>
                            </div>
                        )}
                        <button type="submit">{isSignup ? "Create Account" : "Log In"}</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <p>
                            Enter the verification code sent to your email:
                        </p>
                        <input
                            type="text"
                            name="verification_code"
                            placeholder="Verification Code"
                            value={formData.verification_code}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                        <button type="submit">Verify Email</button>
                    </form>
                )}
                <p onClick={toggleMode} className="toggle-link">
                    {isSignup
                        ? "Already have an account? Log in"
                        : "Don't have an account? Sign up"}
                </p>
            </div>
        </div>
    );
};

export default Login;