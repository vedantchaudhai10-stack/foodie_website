import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH ALL ORDERS
  // ===============================

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
  "https://foodie-backend-j2su.onrender.com/api/admin/orders"
);

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // CANCEL ORDER
  // ===============================

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.patch(
  `https://foodie-backend-j2su.onrender.com/api/admin/orders/${orderId}/cancel`
);

      if (response.data.success) {
        alert("Order cancelled successfully");

        // Reload orders
        fetchOrders();
      }
    } catch (error) {
      console.error("Cancel order error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  // ===============================
  // STATUS CLASS
  // ===============================

  const getStatusClass = (status) => {
    if (status === "Pending") return "status pending";
    if (status === "Confirmed") return "status confirmed";
    if (status === "Preparing") return "status preparing";
    if (status === "Out for Delivery")
      return "status out-for-delivery";
    if (status === "Delivered")
      return "status delivered";
    if (status === "Cancelled")
      return "status cancelled";

    return "status";
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* ===============================
          HEADER
      =============================== */}

      <header className="admin-header">
        <div>
          <h1>🍽️ Foodie Admin</h1>
          <p>Manage your customer orders</p>
        </div>

        <button
          onClick={fetchOrders}
          className="refresh-button"
        >
          ↻ Refresh Orders
        </button>
      </header>

      {/* ===============================
          STATISTICS
      =============================== */}

      <div className="admin-stats">

        {/* Total Orders */}

        <div className="stat-card">
          <span>📦</span>

          <div>
            <p>Total Orders</p>

            <h2>{orders.length}</h2>
          </div>
        </div>

        {/* Pending Orders */}

        <div className="stat-card">
          <span>⏳</span>

          <div>
            <p>Pending</p>

            <h2>
              {
                orders.filter(
                  (order) =>
                    order.status === "Pending"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Revenue */}

        <div className="stat-card">
          <span>💰</span>

          <div>
            <p>Total Revenue</p>

            <h2>
              ₹
              {orders.reduce(
                (sum, order) =>
                  sum +
                  Number(order.total || 0),
                0
              )}
            </h2>
          </div>
        </div>

      </div>

      {/* ===============================
          ORDERS
      =============================== */}

      <main className="admin-content">

        <div className="orders-heading">
          <div>
            <h2>All Orders</h2>

            <p>
              View all orders placed by customers
            </p>
          </div>
        </div>

        {/* NO ORDERS */}

        {orders.length === 0 ? (

          <div className="no-orders">
            <div>📦</div>

            <h2>No orders yet</h2>

            <p>
              Customer orders will appear here.
            </p>
          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.orderId}
              >

                {/* ===============================
                    ORDER HEADER
                =============================== */}

                <div className="order-top">

                  <div>
                    <h3>
                      Order #{order.orderId}
                    </h3>

                    <p>
                      {new Date(
                        order.orderDate ||
                          order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {order.status || "Pending"}
                  </span>

                </div>

                {/* ===============================
                    CUSTOMER / ADDRESS / PAYMENT
                =============================== */}

                <div className="order-details">

                  {/* Customer */}

                  <div className="customer-details">

                    <h4>👤 Customer</h4>

                    <p>
                      <strong>
                        {order.customer?.name}
                      </strong>
                    </p>

                    <p>
                      📞 {order.customer?.phone}
                    </p>

                    <p>
                      ✉️ {order.customer?.email}
                    </p>

                  </div>

                  {/* Address */}

                  <div className="delivery-details">

                    <h4>
                      📍 Delivery Address
                    </h4>

                    <p>
                      {order.customer?.address}
                    </p>

                    <p>
                      {order.customer?.city} -{" "}
                      {order.customer?.pincode}
                    </p>

                  </div>

                  {/* Payment */}

                  <div className="payment-details">

                    <h4>💳 Payment</h4>

                    <p>
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>

                    <strong>
                      ₹{order.total}
                    </strong>

                  </div>

                </div>

                {/* ===============================
                    ORDER ITEMS
                =============================== */}

                <div className="order-items">

                  <h4>🍔 Ordered Items</h4>

                  {order.items?.map((item) => (

                    <div
                      className="admin-item"
                      key={item.id}
                    >

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.quantity} × ₹
                          {item.price}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {Number(item.price) *
                          Number(item.quantity)}
                      </strong>

                    </div>

                  ))}

                </div>

                {/* ===============================
                    ORDER BOTTOM
                =============================== */}

                <div className="order-bottom">

                  <span>
                    {order.items?.length || 0} item
                    {order.items?.length === 1
                      ? ""
                      : "s"}
                  </span>

                  <strong>
                    Total: ₹{order.total}
                  </strong>

                  {/* CANCEL BUTTON */}

                  {order.status !== "Cancelled" && (
                    <button
                      className="cancel-order-button"
                      onClick={() =>
                        cancelOrder(
                          order.orderId
                        )
                      }
                    >
                      ✕ Cancel Order
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </main>
    </div>
  );
}

export default Admin;