import { useState } from "react";
import {
  Search,
  ShoppingCart,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import foodData from "../data/foodData.js";
import { useCart } from "../context/CartContext";

function Home() {
  const { addToCart, cartCount } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Pizza",
    "Burgers",
    "Biryani",
    "Desserts",
    "Beverages",
  ];

  const filteredFood = foodData.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || food.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          <span>Foodie</span>
        </Link>

        <nav className="main-nav">
          <Link to="/" className="nav-active">
            Home
          </Link>

          <Link to="#menu">
            Menu
          </Link>

          <Link to="#about">
            About
          </Link>

          <Link to="#contact">
            Contact
          </Link>

          <Link to="/admin" className="admin-button">
            👨‍💼 Admin
          </Link>
        </nav>

        <Link to="/cart" className="cart-button">
          <ShoppingCart size={19} />
          <span>Cart</span>

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <span>🔥</span>
            Freshly prepared for you
          </div>

          <h1>
            Delicious food,
            <br />
            <span>delivered with love.</span>
          </h1>

          <p className="hero-description">
            Discover delicious meals from your favourite
            restaurants and get them delivered straight
            to your doorstep.
          </p>

          <div className="hero-actions">
            <Link to="#menu" className="hero-button">
              Explore Menu
              <ArrowRight size={19} />
            </Link>

            <Link to="#menu" className="hero-secondary-button">
              View Popular
            </Link>
          </div>

          <div className="hero-info">

            <div className="hero-info-item">
              <div className="hero-info-icon">
                <Clock size={18} />
              </div>

              <div>
                <strong>30 min</strong>
                <span>Fast delivery</span>
              </div>
            </div>

            <div className="hero-info-item">
              <div className="hero-info-icon">
                <Star size={18} />
              </div>

              <div>
                <strong>4.8/5</strong>
                <span>Customer rating</span>
              </div>
            </div>

          </div>
        </div>

        <div className="hero-visual">

          <div className="hero-glow"></div>

          <div className="hero-circle">
            🍕
          </div>

          <div className="floating-food floating-one">
            🍔
          </div>

          <div className="floating-food floating-two">
            🍟
          </div>

          <div className="floating-food floating-three">
            🥤
          </div>

          <div className="hero-rating-card">
            <div className="rating-avatar">
              😊
            </div>

            <div>
              <strong>Excellent!</strong>

              <div className="rating-stars">
                ★★★★★
              </div>

              <small>10k+ happy customers</small>
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          SEARCH
      ========================= */}

      <section className="search-section">

        <div className="search-container">

          <div className="search-heading">
            <p>WHAT ARE YOU CRAVING?</p>
            <h2>Find your perfect meal</h2>
          </div>

          <div className="search-box">

            <Search size={21} />

            <input
              type="text"
              placeholder="Search pizza, burger, biryani..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

            <button className="search-button">
              Search
            </button>

          </div>

        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="category-section">

        <div className="category-header">

          <div>
            <p className="section-label">
              BROWSE BY CATEGORY
            </p>

            <h2>
              What are you craving?
            </h2>
          </div>

          <Link to="#menu" className="view-menu-link">
            View all
            <ChevronRight size={17} />
          </Link>

        </div>

        <div className="categories">

          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category active"
                  : "category"
              }
              onClick={() => setCategory(item)}
            >
              <span className="category-emoji">
                {item === "All" && "🍽️"}
                {item === "Pizza" && "🍕"}
                {item === "Burgers" && "🍔"}
                {item === "Biryani" && "🍛"}
                {item === "Desserts" && "🍰"}
                {item === "Beverages" && "🥤"}
              </span>

              <span>{item}</span>
            </button>
          ))}

        </div>
      </section>

      {/* =========================
          MENU
      ========================= */}

      <section className="menu-section" id="menu">

        <div className="section-heading">

          <div>
            <p className="section-label">
              OUR MENU
            </p>

            <h2>
              Popular Dishes
            </h2>

            <p className="section-subtitle">
              Delicious food made for every craving.
            </p>
          </div>

          <div className="food-count">
            <strong>{filteredFood.length}</strong>
            <span>items available</span>
          </div>

        </div>

        {filteredFood.length === 0 ? (

          <div className="no-results">

            <div className="no-results-icon">
              🔍
            </div>

            <h3>
              No food found
            </h3>

            <p>
              Try searching for something different.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="reset-button"
            >
              Show all dishes
            </button>

          </div>

        ) : (

          <div className="food-grid">

            {filteredFood.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={addToCart}
              />
            ))}

          </div>

        )}

      </section>

      {/* =========================
          ABOUT
      ========================= */}

      <section className="about-section" id="about">

        <div className="about-card">

          <div className="about-icon">
            🍴
          </div>

          <div>
            <p className="section-label">
              WHY FOODIE?
            </p>

            <h2>
              Great food.
              <br />
              Great mood.
            </h2>

            <p>
              From quick bites to delicious meals,
              Foodie makes ordering your favourite food
              simple, fast and enjoyable.
            </p>
          </div>

          <div className="about-features">

            <div>
              <span>🚀</span>
              <strong>Fast delivery</strong>
              <small>Fresh food at your door</small>
            </div>

            <div>
              <span>⭐</span>
              <strong>Quality food</strong>
              <small>Made with fresh ingredients</small>
            </div>

            <div>
              <span>❤️</span>
              <strong>Made with love</strong>
              <small>Because you deserve the best</small>
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer" id="contact">

        <div className="footer-main">

          <div className="footer-brand">

            <Link to="/" className="footer-logo">
              🍽️ Foodie
            </Link>

            <p>
              Good food. Good mood.
              Delivered fast.
            </p>

            <div className="footer-location">
              <MapPin size={16} />
              <span>Delivering happiness near you</span>
            </div>

          </div>

          <div className="footer-links">

            <div>
              <h4>Explore</h4>
              <Link to="/">Home</Link>
              <Link to="#menu">Menu</Link>
              <Link to="#about">About</Link>
            </div>

            <div>
              <h4>Help</h4>
              <Link to="/cart">Cart</Link>
              <Link to="#contact">Contact</Link>
              <Link to="/admin">Admin</Link>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Foodie. All rights reserved.
          </p>

          <p>
            Made with ❤️ for food lovers.
          </p>
        </div>

      </footer>

    </div>
  );
}

export default Home;