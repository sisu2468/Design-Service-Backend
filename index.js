const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const sendformnotification = require("./sendformnotification");
const cors = require('cors');
const app = express();
const fs = require("fs");
const potrace = require("potrace");

app.use(cors());
app.use(bodyParser.json({ limit: '512mb' }));

const convertPngToSvg = async (pngContent, filename) => {
  const pngBuffer = Buffer.from(pngContent, "base64");
  const svgPath = `/tmp/${filename.replace(".png", ".svg")}`;

  return new Promise((resolve, reject) => {
    potrace.trace(pngBuffer, { color: "black" }, (err, svg) => {
      if (err) {
        reject(err);
      } else {
        fs.writeFileSync(svgPath, svg);
        console.log("SVG file created:", svgPath);
        resolve(svgPath);
      }
    });
  });
};

const createAttachments = async (products) => {
  const attachments = [];

  for (const [index, product] of products.entries()) {
    if (product.image && product.image.includes(",")) {
      const pngContent = product.image.split(",")[1];
      const pngFilename = `product-${index + 1}.png`;

      // Convert PNG to SVG
      const svgPath = await convertPngToSvg(pngContent, pngFilename);

      // Optional: Convert SVG to AI if required
      const aiPath = svgPath.replace(".svg", ".ai"); // Placeholder for SVG-to-AI logic

      // Add AI file to attachments
      attachments.push({
        filename: `product-${index + 1}.ai`,
        path: aiPath,
      });
    }
  }

  return attachments;
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "bremen.digital.flag@gmail.com",
    pass: "wpsq ukya xzgj erie",
  },
});

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

  // const attachments = products
  //   .filter((product) => product.image)
  //   .map((product, index) => ({
  //     filename: `product-${index + 1}.png`,
  //     content: product.image.split(",")[1],
  //     encoding: "base64",
  //   }));
  
  const attachments = await createAttachments(products);

  const generateProductHtml = (products) => {
    return products
      .map((product) => `
      <div>
        <p>商品名: ${product.flagtype}</p>
        <p>数量: ${product.amount}</p>
        <p>小計: ${product.subtotal}円</p>
      </div>
    `)
      .join("");
  };

  const mailOptions1 = {
    from: "株式会社ブレーメン",
    to: 'gdev48147@gmail.com',
    subject: "ブレーメンデジタルフラッグのご注文",
    html: `
    <h1>ご注文内容</h1>
    ${generateProductHtml(products)}
  `,
    attachments,
  };

  await transporter.sendMail(mailOptions1);
  res.status(200).json({message: "メールを送信しました"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
