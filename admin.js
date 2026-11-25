
function loadOrders() {
  const orders = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

  const container = document.getElementById("orders");

  if (orders.length === 0) {
    container.innerHTML = "<p>ยังไม่มีรายการสั่งซื้อ</p>";
    return;
  }

  container.innerHTML = "";

  orders.forEach((order, index) => {
    const card = document.createElement("div");
    card.className = "product";

    const title = document.createElement("h3");
    title.textContent = "คำสั่งซื้อ #" + (index + 1);

    const customer = document.createElement("p");
    customer.textContent = "ชื่อลูกค้า: " + order.customer;

    const phone = document.createElement("p");
    phone.textContent = "เบอร์โทร: " + order.phone;

    const address = document.createElement("p");
    address.textContent = "ที่อยู่: " + order.address;

    const items = document.createElement("p");
    items.textContent = "สินค้า: " + order.items.join(", ");

    const total = document.createElement("h3");
    total.textContent = "ยอดรวม: " + order.total + " บาท";

    const date = document.createElement("p");
    date.textContent = "วันที่สั่งซื้อ: " + order.date;

    const printButton = document.createElement("button");
    printButton.textContent = "พิมพ์ใบจ่าหน้าพัสดุ";

    printButton.onclick = function() {
      printLabel(order);
    };

    card.append(
      title,
      customer,
      phone,
      address,
      items,
      total,
      date,
      printButton
    );

    container.appendChild(card);
  });
}

function printLabel(order) {
  const win = window.open("", "_blank");

  if (!win) {
    alert("กรุณาอนุญาตป๊อปอัปเพื่อพิมพ์");
    return;
  }

  const safe = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  win.document.write(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>ใบจ่าหน้าพัสดุ</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
        }
        .label {
          border: 2px solid black;
          padding: 25px;
          max-width: 500px;
          margin: auto;
        }
        h2 { text-align: center; }
        p { font-size: 18px; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="label">
        <h2>ใบจ่าหน้าพัสดุ</h2>
        <hr>
        <h3>ผู้รับ</h3>
        <p>ชื่อ: ${safe(order.customer)}</p>
        <p>โทร: ${safe(order.phone)}</p>
        <p>ที่อยู่: ${safe(order.address)}</p>
        <hr>
        <p>เลขที่คำสั่งซื้อ: ${safe(order.date)}</p>
        <p>สินค้า: ${safe(order.items.join(", "))}</p>
        <p>ยอดรวม: ${safe(order.total)} บาท</p>
        <button onclick="window.print()">พิมพ์เอกสาร</button>
      </div>
    </body>
    </html>
  `);

  win.document.close();
}

loadOrders();
