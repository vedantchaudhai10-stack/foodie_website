import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";

import foodData from "../data/foodData.js";
import { useCart } from "../context/CartContext";

function FoodDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const food = foodData.find((item) => item.id === Number(id));

  const [quantity, setQuantity] = useState(1);

  if (!food) {
    return (
      <div className="not-found">
        <h2>Food item not found 😔</h2>

        <Link to="/" className="checkout-button">
          Back to Menu
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(food);
    }
  };

  return (
    <div className="details-page">

      <header className="navbar">
        <Link to="/" className="logo">
          🍽️ Foodie
        </Link>

        <Link to="/cart" className="cart-button">
          🛒 Cart
        </Link>
      </header>

      <main className="details-container">

        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Menu
        </Link>

        <div className="details-card">

          {/* Image */}
          <div className="details-image-container">
            <img
              src={food.image}
              alt={food.name}
              className="details-image"
            />
          </div>

          {/* Information */}
          <div className="details-info">

            <span className="details-category">
              {food.category}
            </span>

            <h1>{food.name}</h1>

            <div className="details-rating">
              <Star size={18} fill="currentColor" />
              <strong>{food.rating}</strong>
              <span>Excellent choice</span>
            </div>

            <p className="details-description">
              {food.description}
            </p>

            <div className="details-price">
              ₹{food.price}
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <span>Quantity</span>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    setQuantity((value) => Math.max(1, value - 1))
                  }
                >
                  <Minus size={18} />
                </button>

                <strong>{quantity}</strong>

                <button
                  onClick={() =>
                    setQuantity((value) => value + 1)
                  }
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              className="add-details-button"
              onClick={handleAddToCart}
            >
              Add {quantity} to Cart · ₹{food.price * quantity}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}

export default FoodDetails;