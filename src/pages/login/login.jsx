import React, { useState } from "react";
import axios from "axios";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import "./login.css";

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "password" && isSignup) {
            validatePasswordStrength(e.target.value);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setFormData({
            email: "",
            password: "",
            confirmPassword: ""
        });
        setPasswordError("");
    };

    const validatePasswordStrength = (password) => {
        const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!strongPattern.test(password)) {
            setPasswordError("Password must be 8+ chars, include upper & lower case, number, and symbol");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password, confirmPassword } = formData;

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
                const response = await axios.post("/api/signup", {
                    email,
                    password
                });
                alert("Signup successful");
                console.log(response.data);
            } else {
                const response = await axios.post("/api/login", {
                    email,
                    password
                });
                alert("Login successful");
                console.log(response.data);
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="password-input">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? < IconEye /> : < IconEyeOff />}
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
                                />
                                <span
                                    className="eye-icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? < IconEye /> : < IconEyeOff />}
                                </span>
                            </div>
                            {passwordError && (
                                <p className="password-error">{passwordError}</p>
                            )}
                        </>
                    )}

                    <button type="submit">{isSignup ? "Create Account" : "Login"}</button>
                </form>
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
