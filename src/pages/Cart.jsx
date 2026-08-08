import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <header className="navbar">
          <Link to="/" className="logo">
            🍽️ Foodie
          </Link>
        </header>

        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your cart is empty</h1>

          <p>
            Looks like you haven't added anything to your
            cart yet.
          </p>

          <Link to="/" className="checkout-button">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Navbar */}
      <header className="navbar">
        <Link to="/" className="logo">
          🍽️ Foodie
        </Link>

        <Link to="/" className="back-menu">
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </header>

      <main className="cart-container">

        <div className="cart-heading">
          <p>YOUR ORDER</p>
          <h1>Shopping Cart</h1>
          <span>{cart.length} different items</span>
        </div>

        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items">

            {cart.map((item) => (
              <div className="cart-item" key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">

                  <span>{item.category}</span>

                  <h3>{item.name}</h3>

                  <p>₹{item.price} each</p>

                  <div className="cart-item-actions">

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <strong>{item.quantity}</strong>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

                  </div>
                </div>

                <strong className="cart-item-total">
                  ₹{item.price * item.quantity}
                </strong>

              </div>
            ))}

          </div>

          {/* Summary */}
          <aside className="order-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <strong>₹{deliveryFee}</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout →
            </Link>

            <p className="secure-text">
              🔒 Secure checkout
            </p>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default Cart;