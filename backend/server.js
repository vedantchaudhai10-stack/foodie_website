app.post("/api/orders", async (req, res) => {
  console.log("🔥 POST /api/orders REACHED RENDER");

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

    console.log("✅ Order email function completed");

    res.status(201).json({
      success: true,
      message: "Order received and saved successfully",
      orderId: order.orderId,
    });

  } catch (error) {
    console.error("❌ Email/Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Order received but something went wrong",
    });
  }
});