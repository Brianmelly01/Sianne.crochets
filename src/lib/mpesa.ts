import axios from "axios";
import { formatPhoneNumber } from "./utils";

const MPESA_ENV = process.env.MPESA_ENVIRONMENT || "sandbox";
const BASE_URL =
  MPESA_ENV === "sandbox"
    ? "https://sandbox.safaricom.co.ke"
    : "https://api.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  return response.data.access_token;
}

export async function initiateSTKPush({
  phone,
  amount,
  orderId,
  orderNumber,
}: {
  phone: string;
  amount: number;
  orderId: string;
  orderNumber: string;
}) {
  const accessToken = await getAccessToken();
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const callbackUrl = process.env.MPESA_CALLBACK_URL!;

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  const formattedPhone = formatPhoneNumber(phone);

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.ceil(amount),
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: orderNumber,
    TransactionDesc: `Payment for order ${orderNumber}`,
  };

  const response = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
