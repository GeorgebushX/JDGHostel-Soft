const Razorpay = require("razorpay");
const crypto = require("crypto");
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY",
  key_secret: "YOUR_RAZORPAY_SECRET",
});

exports.processPayment = async (req, res) => {
  try {
    const { studentId } = req.body;

    const options = {
      amount: 20000, // Amount in paise (200 INR)
      currency: "INR",
      receipt: `receipt_${studentId}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment failed", error });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const secret = "YOUR_RAZORPAY_SECRET";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying payment", error });
  }
};
