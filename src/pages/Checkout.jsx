import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import axios from "axios";

import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    subtotal,
    deliveryFee,
    total,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    const order = {
      orderId: `FD${Date.now()}`,
      customer: formData,
      items: cart,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      orderDate: new Date().toISOString(),
    };

    try {
      console.log("Sending order to backend:", order);

      // Send order to backend
      const response = await axios.post(
        "https://foodie-backend-j2su.onrender.com/api/orders",
        order
      );

      console.log("Order response:", response.data);

      if (response.data.success) {
        // Save order for success page
        localStorage.setItem(
          "foodieOrder",
          JSON.stringify(order)
        );

        // Clear cart
        clearCart();

        // Go to success page
        navigate("/success");
      } else {
        throw new Error(
          response.data.message || "Order failed"
        );
      }
    } catch (error) {
      console.error("Order error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to place your order. Please try again.";

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty 🛒</h2>

        <p>
          Add some delicious food before checking out.
        </p>

        <Link to="/" className="checkout-button">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Navbar */}
      <header className="navbar">
        <Link to="/" className="logo">
          🍽️ Foodie
        </Link>

        <Link to="/cart" className="back-menu">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>
      </header>

      <main className="checkout-container">
        {/* Heading */}
        <div className="checkout-heading">
          <p>ALMOST THERE</p>

          <h1>Checkout</h1>

          <span>
            Enter your details to complete your order.
          </span>
        </div>

        <div className="checkout-layout">
          {/* Customer Form */}
          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            {/* Contact Information */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <div className="checkout-icon">
                  👤
                </div>

                <div>
                  <h2>Contact Information</h2>

                  <p>
                    We'll use this to contact you about your order.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                {/* Name */}
                <div className="form-group">
                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label>
                    Mobile Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group full-width">
                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <div className="checkout-icon">
                  <MapPin size={22} />
                </div>

                <div>
                  <h2>Delivery Address</h2>

                  <p>
                    Where should we deliver your food?
                  </p>
                </div>
              </div>

              <div className="form-grid">
                {/* Address */}
                <div className="form-group full-width">
                  <label>
                    Address *
                  </label>

                  <textarea
                    name="address"
                    placeholder="House no., street, area..."
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>

                {/* City */}
                <div className="form-group">
                  <label>
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Jalgaon"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PIN Code */}
                <div className="form-group">
                  <label>
                    PIN Code *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="425001"
                    value={formData.pincode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <div className="checkout-icon">
                  <CreditCard size={22} />
                </div>

                <div>
                  <h2>Payment Method</h2>

                  <p>
                    Select how you want to pay.
                  </p>
                </div>
              </div>

              <div className="payment-options">
                {/* Cash on Delivery */}
                <label
                  className={
                    paymentMethod === "cod"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your food arrives
                    </span>
                  </div>
                </label>

                {/* Online Payment */}
                <label
                  className={
                    paymentMethod === "online"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      UI only — payment gateway not connected
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order */}
            <button
              type="submit"
              className="place-order-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Placing Order..."
                : `Place Order · ₹${total}`}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <h2>Your Order</h2>

            <div className="checkout-items">
              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                ₹{subtotal}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>

              <strong>
                ₹{deliveryFee}
              </strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{total}
              </strong>
            </div>

            <div className="checkout-security">
              🔒 Your information is secure
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Checkout;