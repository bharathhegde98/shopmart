// shopmart/src/components/Auth/Register.jsx

import { useState } from "react";
import "./auth.css";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [apiError, setApiError] = useState("");
  // I've added the optional isLoading state for better UX
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Valid email required.";
    if (!form.mobile.match(/^\d{10}$/)) newErrors.mobile = "10-digit mobile number required.";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setApiError(""); // Clear previous errors

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true); // Start loading
      try {
        // This fetch call is how the frontend talks to the backend
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        if (response.ok) {
          setIsRegistered(true);
        } else {
          setApiError(data.message || "Registration failed.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setApiError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="auth-form-wrapper">
      {isRegistered ? (
        <div className="success-message">
          <h2>You have been successfully registered!</h2>
          <Link to="/" className="btn">Return to Homepage</Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          {apiError && <p className="error">{apiError}</p>}

          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}

          <input
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="text"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          {errors.mobile && <p className="error">{errors.mobile}</p>}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className="auth-footer mt-3">
  Already have an account? <Link to="/#login">Login here</Link>
</p>
        </form>
      )}
    </div>
  );
};

export default Register;