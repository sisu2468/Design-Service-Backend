const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const sendformnotification = require("./sendformnotification");
const cors = require('cors');
const app = express();

app.use(cors());

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Correct SMTP server for Gmail
  port: 465, // Use 465 for secure connection, or 587 for STARTTLS
  secure: true, // true for port 465, false for 587
  auth: {
    user: "bremen.digital.flag@gmail.com",
    pass: "wpsq ukya xzgj erie",
  },
});

function generateOrderNumber() {
  return Math.floor(10000 + Math.random() * 90000); // 10000〜99999の範囲でランダムな整数を生成
}

app.post("/deliver", async (req, res) => {
  const buyername = req.body.buyername;
  const ordernumber = generateOrderNumber(); // ランダムな注文番号
  const emailaddress = req.body.emailaddress;
  const postalcode = req.body.postalcode;
  const address = req.body.address;
  const telnumber = req.body.telnumber;
  const orderdate = req.body.orderdate; // Input: 2024-12-17T09:24:32.284Z

  const date = new Date(orderdate);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const products = req.body.products;
  const totalprice = Number(req.body.totalprice).toLocaleString('en-US');
  const deliverydate = req.body.deliverydate;

  console.log("data", req.body);

  // 通知メールを送信
  const mailOptions = {
    from: "株式会社ブレーメン",
    to: emailaddress,
    subject: "ブレーメンデジタルフラッグのご注文",
    html: sendformnotification.sendformnotification(
      buyername,
      ordernumber,
      emailaddress,
      postalcode,
      address,
      telnumber,
      formattedDate,
      products,
      totalprice,
      deliverydate
    ),
  };
  await transporter.sendMail(mailOptions);
  res.status(200).send("メールを送信しました");
});

// サーバーを開始
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
