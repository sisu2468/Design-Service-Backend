const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const sendformnotification = require("./sendformnotification");
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://design-service-znjc.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST'],       // Allow only specific HTTP methods
  credentials: true               // Enable cookies if needed
}));

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'gmail', // さくらインターネットのSMTPサーバー
  auth: {
    user: "info@bremen.co.jp",
    pass: "aork umuw vdkn batl", // アプリパスワードを使用推奨
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
  const orderdate = req.body.orderdate;
  const products = req.body.products;
  const totalprice = req.body.totalprice;
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
      orderdate,
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
