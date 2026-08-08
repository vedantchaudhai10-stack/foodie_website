require("dotenv").config();

const nodemailer = require("nodemailer");

// ==========================================
// SMTP CONFIG CHECK
// ==========================================

console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP HOST:", process.env.SMTP_HOST);
console.log("SMTP PORT:", process.env.SMTP_PORT);
console.log("SENDER EMAIL:", process.env.SENDER_EMAIL);
console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL);
console.log("SMTP PASS EXISTS:", !!process.env.SMTP_PASS);
console.log("SMTP PASS LENGTH:", process.env.SMTP_PASS?.length);

// ==========================================
// CREATE TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==========================================
// TEST SMTP CONNECTION
// ==========================================

async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful!");
  } catch (error) {
    console.error("❌ SMTP connection failed:");
    console.error(error.message);
  }
}

testEmailConnection();

// ==========================================
// SEND ORDER EMAILS
// ==========================================

async function sendOrderEmails(order) {
  try {
    const {
      orderId,
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    } = order;

    // Use SENDER_EMAIL if available.
    // Otherwise use ADMIN_EMAIL.
    const senderEmail =
      process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL;

    // Make sure sender email exists
    if (!senderEmail) {
      throw new Error(
        "SENDER_EMAIL and ADMIN_EMAIL are both missing from .env"
      );
    }

    console.log("📧 Sending emails FROM:", senderEmail);

    // ==========================================
    // ADMIN ORDER ROWS
    // ==========================================

    const adminItemRows = items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${item.price * item.quantity}</td>
          </tr>
        `
      )
      .join("");

    // ==========================================
    // CUSTOMER ORDER ROWS
    // ==========================================

    const customerItemRows = items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price * item.quantity}</td>
          </tr>
        `
      )
      .join("");

    // ==========================================
    // ADMIN EMAIL
    // ==========================================

    await transporter.sendMail({
      from: `"Foodie Orders" <${senderEmail}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: customer.email,
      subject: `🔔 New Food Order #${orderId}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: auto;
          padding: 20px;
        ">

          <h2>🍽️ New Food Order</h2>

          <h3>Order #${orderId}</h3>

          <hr>

          <h3>👤 Customer Details</h3>

          <p>
            <strong>Name:</strong> ${customer.name}<br>
            <strong>Phone:</strong> ${customer.phone}<br>
            <strong>Email:</strong> ${customer.email}
          </p>

          <h3>📍 Delivery Address</h3>

          <p>
            ${customer.address}<br>
            ${customer.city} - ${customer.pincode}
          </p>

          <h3>🍔 Order Items</h3>

          <table
            border="1"
            cellpadding="8"
            cellspacing="0"
            style="
              border-collapse: collapse;
              width: 100%;
            "
          >
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${adminItemRows}
            </tbody>
          </table>

          <h3>💰 Order Summary</h3>

          <p>
            Subtotal: ₹${subtotal}<br>
            Delivery Fee: ₹${deliveryFee}<br>

            <strong>
              Total: ₹${total}
            </strong>

            <br>

            Payment: ${paymentMethod}
          </p>

          <hr>

          <p>
            🔔 <strong>New order received on Foodie.</strong>
          </p>

        </div>
      `,
    });

    console.log(`✅ Admin email sent for order ${orderId}`);

    // ==========================================
    // CUSTOMER EMAIL
    // ==========================================

    await transporter.sendMail({
      from: `"Foodie" <${senderEmail}>`,
      to: customer.email,
      replyTo: process.env.ADMIN_EMAIL,
      subject: `Thank you for your Foodie order #${orderId} 🍽️`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: auto;
          padding: 20px;
        ">

          <h2>
            Thank you for your order, ${customer.name}! 🎉
          </h2>

          <p>
            We've successfully received your Foodie order.
          </p>

          <h3>Order #${orderId}</h3>

          <hr>

          <h3>🍔 Your Order</h3>

          <table
            border="1"
            cellpadding="8"
            cellspacing="0"
            style="
              border-collapse: collapse;
              width: 100%;
            "
          >
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${customerItemRows}
            </tbody>
          </table>

          <h3>💰 Order Summary</h3>

          <p>
            Subtotal: ₹${subtotal}<br>
            Delivery Fee: ₹${deliveryFee}<br>

            <strong>
              Total: ₹${total}
            </strong>
          </p>

          <p>
            <strong>Payment:</strong> ${paymentMethod}
          </p>

          <hr>

          <h3>🍽️ We're preparing your food now!</h3>

          <p>
            Thank you for choosing Foodie ❤️
          </p>

        </div>
      `,
    });

    console.log(`✅ Customer email sent to ${customer.email}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
}

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendOrderEmails,
};