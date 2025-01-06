module.exports = {
  sendformnotification: (buyername, ordernumber, emailaddress, postalcode, address, telnumber, orderdate, products, totalprice, deliverydate) => {
    return `
        <!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>フォーム提出通知</title>
        <style>
        .content { font-family: Arial, sans-serif; }
        .clinic { margin-bottom: 30px;}
        .phase1 { margin-bottom: 30px;}
        .phase2 { margin-bottom: 50px;}
        .companyinfo {font-weight: 700;}
        </style>
    </head>
    <body>
        <div class="content">
            <h1 class="clinic">${buyername} 様</h1>
            <p class="">※このメールは送信専用です。このメールに返信いただいても対応できませんので、ご了承ください。</p>
            <p class="phase1">※お問い合わせは「info@bremen.co.jp」までお願いいたします。</p>
            <p class="">この度はブレーメンデジタルフラッグのご注文いただき、誠にありがとございます。</p>
            <p class="phase1">本日、以下のご注文を承りましたので、ご確認をお願い申し上げます。</p>
            <p>
                【　受　注　番　号　】${ordernumber}
                <br>
                ▼お客様情報
                <br>
                ================================
                <br>
                【　お　　名　　前　】${buyername} 様
                <br>
                【　メールアドレス　】${emailaddress}
                <br>
                【　郵　便　番　号　】${postalcode}
                <br>
                【　ご　　住　　所　】${address}
                <br>
                【　電　話　番　号　】${telnumber}
                <br>
                【　注　　文　　日　】${orderdate}
                <br>
                【　決　済　方　法　】銀行振込
                <br>
                ================================
            </p>
            <p>
                ▼配送先情報
                <br>
                ================================
                <br>
                【　お　　名　　前　】${buyername}
                <br>
                【　郵　便　番　号　】${postalcode}
                <br>
                【　ご　　住　　所　】${address}
                <br>
                【　電　話　番　号　】${telnumber}
                <br>
                ================================
                <br>
            </p>
            <p>
                ▼商品詳細
                <br>
                ================================
                <br>
                ${products.map ((products, index) => `
                  【　商　　品　　名　】${products.flagtype}
                  <br>
                  【　　数　　　量　　】${products.amount}
                  <br>
                  【　　小　　　計　　】${Number(products.subtotal).toLocaleString('en-US')}
                  <br>
                  --------------------------------
                  <br>
                  ================================
                  <br>
                `).join('')}
            </p>
            <p>
                ▼総合計
                <br>
                ================================
                <br>
                【　総　　合　　計　】${totalprice}
                <br>
                ================================
                <br>
            </p>
            <p class="phase1">
                【納品予定日】
                <br>
                この注文の納品予定日は、${deliverydate}日です。
                <br>
            </p>
            <p class="phase2">
                【振込先口座情報】
                <br>
                ーーーーーーーーーーーー
                <br>
                金融機関名：PayPay銀行
                <br>
                支店名：すずめ支店(002)
                <br>
                口座番号：3747255
                <br>
                口座名義：カ）ブレーメン
                <br>
                ーーーーーーーーーーーー
                <br>
                ※振込手数料はお客様ご負担でお願いいたします。
                <br>
                ※ご入金の確認後の手配となります。
                <br>
            </p>
            <p class="phase2">
                【今後の流れについて】
                <br>
                商品はお支払い完了後の手配となります。
                <br>
                お客様からのご入金が確認できない場合、次の納期スケジュールとなりますこと、
                <br>
                あらかじめご了承ください。
                <br>
                詳しくは納品スケジュールをご確認いただけますようお願い申し上げます。
                <br>
            </p>
            <p class="phase2">
                株式会社ブレーメン───────────
                <br>
                〒662-0045
                <br>
                兵庫県西宮市安井町2-33
                <br>
                TEL：(0798)33-4737(代)
                <br>
                HP：http://www.bremen.co.jp/
                <br>
                MAIL：info@bremen.co.jp
                <br>
                営業時間：9:30 - 17:00（土・日・祝日休み）
                <br> ────────────────────
                <br>
                <br>
            </p>
        </div>
    </body>
</html>
    `
  }
}
