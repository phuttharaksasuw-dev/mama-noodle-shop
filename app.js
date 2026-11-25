
const products = [
  {
    id: "MN001",
    name: "บะหมี่รสหมูสับ",
    price: 10,
    emoji: "🍜"
  },
  {
    id: "MN002",
    name: "บะหมี่รสต้มยำกุ้ง",
    price: 12,
    emoji: "🍤"
  }
];

let cart = [];

function displayProducts() {
  const list = document.getElementById("productList");

  list.innerHTML = products.map(p => `
    <div class="product">
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>รหัสสินค้า: ${p.id}</p>
      <h3>${p.price} บาท</h3>
      <button onclick="addCart('${p.id}')">
        เพิ่มลงตะกร้า
      </button>
    </div>
  `).join("");
}

function addCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function updateCart() {
  document.getElementById("count").innerText = cart.length;

  document.getElementById("cartItems").innerHTML =
    cart.map(p => `<p>${p.name} - ${p.price} บาท</p>`).join("");

  const total = cart.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("total").innerText = total;
}

function showCart() {
  document.getElementById("cart").scrollIntoView();
}

function checkout() {
  if (cart.length === 0) {
    alert("กรุณาเลือกสินค้าก่อน");
    return;
  }
  document.getElementById("checkout").scrollIntoView();
}

document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("กรุณาเลือกสินค้าก่อน");
    return;
  }

  const order = {
    customer: document.getElementById("customer").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    items: cart.map(p => p.name),
    total: cart.reduce((sum, p) => sum + p.price, 0),
    date: new Date().toLocaleString("th-TH")
  };

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("สั่งซื้อสำเร็จ ขอบคุณที่ใช้บริการค่ะ!");

  cart = [];
  updateCart();
  this.reset();
});

displayProducts();
updateCart();
