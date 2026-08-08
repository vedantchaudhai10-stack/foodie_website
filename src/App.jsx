import { Routes, Route } from "react-router-dom";

import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import FoodDetails from "./pages/FoodDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/food/:id" element={<FoodDetails />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />

      <Route path="/success" element={<OrderSuccess />} />

      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;