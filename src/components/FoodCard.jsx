import { Link } from "react-router-dom";
import { Star, Plus } from "lucide-react";

function FoodCard({ food, onAddToCart }) {
  return (
    <div className="food-card">

      <Link to={`/food/${food.id}`} className="food-card-link">
        <img
          src={food.image}
          alt={food.name}
          className="food-image"
        />
      </Link>

      <div className="food-info">

        <div className="food-title-row">
          <Link
            to={`/food/${food.id}`}
            className="food-name-link"
          >
            <h3>{food.name}</h3>
          </Link>

          <span className="rating">
            <Star size={16} fill="currentColor" />
            {food.rating}
          </span>
        </div>

        <p>{food.description}</p>

        <div className="food-bottom">

          <span className="price">
            ₹{food.price}
          </span>

          <button
            onClick={() => onAddToCart(food)}
          >
            <Plus size={18} />
            Add
          </button>

        </div>
      </div>
    </div>
  );
}

export default FoodCard;