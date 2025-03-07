const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sendformnotification = require("./sendformnotification");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '512mb' }));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "bremen.digital.flag@gmail.com",
    pass: "yuii haue jeps fcao",
  },
});
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};

function generateOrderNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

app.post("/deliver", async (req, res) => {
  const buyername = req.body.buyername;
  const ordernumber = generateOrderNumber();
  const emailaddress = req.body.emailaddress;
  const postalcode = req.body.postalcode;
  const address = req.body.address;
  const telnumber = req.body.telnumber;
  const orderdate = req.body.orderdate;

  const date = new Date(orderdate);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const products = req.body.products;
  const totalprice = Number(req.body.totalprice).toLocaleString('en-US');
  const deliverydate = req.body.deliverydate;
  const shippingInfo = req.body.shippingInfo;

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
      deliverydate,
      shippingInfo ? shippingInfo : null
    ),
  };
  sendEmail(mailOptions);

  const attachments = products
    .filter((product) => product.image)
    .map((product, index) => {
      const buffer = Buffer.from(product.image.split(",")[1], 'base64');
      return {
        filename: `product-${index + 1}.psd`,
        content: buffer,
        encoding: "base64",
      }
    });

  const mailOptions1 = {
    from: "株式会社ブレーメン",
    to: 'info@bremen.co.jp',
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
    attachments,
  };
  sendEmail(mailOptions1)
  res.status(200).json({ message: "メールを送信しました" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
