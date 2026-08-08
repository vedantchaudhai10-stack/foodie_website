require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { sendOrderEmails } = require("./services/emailService");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// ORDERS FILE
// ===============================

const ordersFile = path.join(__dirname, "orders.json");

// Create orders.json if it doesn't exist
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, "[]");
}

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Foodie backend is running 🚀",
  });
});

// ===============================
// PLACE ORDER
// ===============================

app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;

    console.log("New Order Received:", order.orderId);

    // Read existing orders
    const ordersData = fs.readFileSync(ordersFile, "utf8");

    const orders = JSON.parse(ordersData);

    // Create new order
    const newOrder = {
      ...order,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // Save order
    orders.push(newOrder);

    fs.writeFileSync(
      ordersFile,
      JSON.stringify(orders, null, 2)
    );

    console.log(
      "Order saved successfully:",
      order.orderId
    );

    // Send email
    await sendOrderEmails(order);

    res.status(201).json({
      success: true,
      message: "Order received and saved successfully",
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Email/Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Order received but something went wrong",
    });
  }
});

// ===============================
// GET ALL ORDERS - ADMIN
// ===============================

app.get("/api/admin/orders", (req, res) => {
  try {
    const ordersData = fs.readFileSync(
      ordersFile,
      "utf8"
    );

    const orders = JSON.parse(ordersData);

    // Latest orders first
    orders.reverse();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load orders",
    });
  }
});

// ===============================
// CANCEL ORDER - ADMIN
// ===============================

app.patch(
  "/api/admin/orders/:orderId/cancel",
  (req, res) => {
    try {
      const { orderId } = req.params;

      console.log(
        "Cancel request received for:",
        orderId
      );

      // Read orders
      const ordersData = fs.readFileSync(
        ordersFile,
        "utf8"
      );

      const orders = JSON.parse(ordersData);

      // Find order
      const orderIndex = orders.findIndex(
        (order) =>
          String(order.orderId) === String(orderId)
      );

      // Order not found
      if (orderIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Already cancelled
      if (
        orders[orderIndex].status ===
        "Cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message: "Order is already cancelled",
        });
      }

      // Cancel order
      orders[orderIndex].status = "Cancelled";

      orders[orderIndex].cancelledAt =
        new Date().toISOString();

      // Save updated orders
      fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders, null, 2)
      );

      console.log(
        "Order cancelled successfully:",
        orderId
      );

      res.json({
        success: true,
        message: "Order cancelled successfully",
        order: orders[orderIndex],
      });
    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Unable to cancel order",
      });
    }
  }
);

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Foodie backend running on port ${PORT}`);
});