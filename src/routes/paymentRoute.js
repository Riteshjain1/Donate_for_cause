import Razorpay from "razorpay";
import "dotenv/config";

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_KEY,
});
