import { Link } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";

function OrderSuccess() {
  const savedOrder = localStorage.getItem("foodieOrder");

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  const orderId =
    order?.orderId || "FD" + Date.now().toString().slice(-6);

  return (
    <div className="success-page">
      <div className="success-card">

        <div className="success-icon">
          <CheckCircle size={70} />
        </div>

        <h1>Order Placed Successfully! 🎉</h1>

        <p className="success-message">
          Thank you for ordering from Foodie.
          Your delicious food is on its way!
        </p>

        <div className="order-id">
          <span>Order ID</span>
          <strong>#{orderId}</strong>
        </div>

        {order && (
          <div className="success-details">

            <div>
              <span>Customer</span>
              <strong>{order.customer.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{order.customer.email}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>₹{order.total}</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </strong>
            </div>

          </div>
        )}

        <div className="success-actions">

          <Link to="/" className="home-button">
            <Home size={18} />
            Back to Home
          </Link>

          <Link to="/" className="order-more-button">
            <ShoppingBag size={18} />
            Order More Food
          </Link>

        </div>

        <p className="success-note">
          📧 A confirmation message will be sent to your email.
        </p>

      </div>
    </div>
  );
}

export default OrderSuccess;