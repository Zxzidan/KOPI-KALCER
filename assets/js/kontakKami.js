// =======================
// DATA MENU
// =======================
const menuItem = {
  milk: [
    "Es Kopi Kalcer - Rp 18.000",
    "Latte - Rp 22.000",
    "Caramel Latte - Rp 24.000",
    "Mocha - Rp 25.000",
    "Vanilla Latte - Rp 24.000",
    "Hazelnut Latte - Rp 25.000",
    "Butterscotch Latte - Rp 25.000",
    "Irish Latte - Rp 26.000",
    "Salted Caramel Latte - Rp 26.000",
    "Avocado Coffee - Rp 28.000",
  ],
  black: [
    "Americano - Rp 18.000",
    "Manual Brew - Rp 25.000",
    "Espresso - Rp 15.000",
    "Long Black - Rp 18.000",
    "Cold Brew - Rp 22.000",
    "Vietnam Drip - Rp 20.000",
    "Kopi Tubruk - Rp 15.000",
    "French Press - Rp 25.000",
    "V60 - Rp 25.000",
    "Japanese Iced Coffee - Rp 27.000",
  ],
  noncoffee: [
    "Matcha Latte - Rp 23.000",
    "Chocolate - Rp 20.000",
    "Red Velvet - Rp 22.000",
    "Taro Latte - Rp 22.000",
    "Thai Tea - Rp 20.000",
    "Green Tea - Rp 18.000",
    "Lemon Tea - Rp 18.000",
    "Lychee Tea - Rp 20.000",
    "Peach Tea - Rp 20.000",
    "Mineral Water - Rp 8.000",
  ],
  snack: [
    "Donat - Rp 10.000",
    "Roti Bakar - Rp 15.000",
    "Brownies - Rp 15.000",
    "Croissant - Rp 18.000",
    "French Fries - Rp 15.000",
    "Onigiri - Rp 18.000",
    "Sandwich - Rp 20.000",
    "Pisang Goreng - Rp 12.000",
    "Cireng - Rp 12.000",
    "Nugget - Rp 15.000",
  ],
};

// =======================
// SCROLL BUTTON
// =======================
const btn = document.getElementById("scrollTopBtn");

window.onscroll = function () {
  btn.style.display =
    document.documentElement.scrollTop > 200 ? "block" : "none";
};

btn.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// =======================
// MAIN APP
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");
  const list = document.getElementById("listPesanan");
  const btnWA = document.getElementById("kirimWA");
  const totalHargaElement = document.getElementById("totalHarga");

  // Dropdown
  const kategoriSelect = document.getElementById("kategoriMenu");
  const menuSelect = document.getElementById("menuItem");

  // Qty & Subtotal
  const qtyInput = document.getElementById("qty");
  const subtotalInput = document.getElementById("subtotal");

  // Menu Grid
  const menuList = document.getElementById("menuList");
  const categoryButtons = document.querySelectorAll(".category-btn");

  let dataList = JSON.parse(localStorage.getItem("dataList")) || [];

  // =======================
  // DROPDOWN DINAMIS
  // =======================
  function populateMenu(category) {
    menuSelect.innerHTML = '<option value="">— Pilih Menu —</option>';
    if (!category || !menuItem[category]) return;

    menuItem[category].forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      menuSelect.appendChild(option);
    });

    updateSubtotal();
  }

  if (kategoriSelect) {
    kategoriSelect.addEventListener("change", function () {
      populateMenu(this.value);
    });
  }

  // =======================
  // HITUNG SUBTOTAL
  // =======================
  function updateSubtotal() {
    const selectedMenu = menuSelect.value;
    const qty = parseInt(qtyInput.value) || 0;
    const price = getPrice(selectedMenu);
    const subtotal = price * qty;
    subtotalInput.value = formatRupiah(subtotal);
  }

  menuSelect.addEventListener("change", updateSubtotal);
  qtyInput.addEventListener("input", updateSubtotal);

  // =======================
  // RENDER MENU GRID
  // =======================
  function renderMenu(category) {
    if (!menuList) return;

    menuList.innerHTML = "";
    let items = [];

    if (category === "all") {
      Object.values(menuItem).forEach((cat) => {
        items = items.concat(cat);
      });
    } else {
      items = menuItem[category];
    }

    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "menu-item";
      div.textContent = item;
      menuList.appendChild(div);
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      renderMenu(this.dataset.category);
    });
  });

  renderMenu("all");

  // =======================
  // RENDER PESANAN & TOTAL
  // =======================
  function render() {
    list.innerHTML = "";
    let total = 0;

    dataList.forEach((item, index) => {
      total += item.subtotal;

      list.innerHTML += `
        <div style="
          background:#fff;
          padding:15px;
          margin-top:10px;
          border-radius:10px;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
        ">
          <b>${item.nama}</b> (${item.whatsapp})<br>
          Kebutuhan: ${item.kebutuhan}<br>
          Kategori: ${item.kategoriMenu}<br>
          Menu: ${item.menuItem}<br>
          Qty: ${item.qty}<br>
          Harga: ${formatRupiah(item.harga)}<br>
          Subtotal: <b>${formatRupiah(item.subtotal)}</b><br>
          Pesan: ${item.pesan}<br>
          <button onclick="hapusData(${index})" style="
            margin-top:10px;
            background:red;
            color:white;
            border:none;
            padding:5px 10px;
            border-radius:5px;
          ">Hapus</button>
        </div>
      `;
    });

    if (totalHargaElement) {
      totalHargaElement.textContent = `Total: ${formatRupiah(total)}`;
    }
  }

  window.hapusData = function (index) {
    dataList.splice(index, 1);
    localStorage.setItem("dataList", JSON.stringify(dataList));
    render();
  };

  // =======================
  // SUBMIT FORM
  // =======================
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const price = getPrice(menuSelect.value);
    const qty = parseInt(qtyInput.value) || 1;
    const subtotal = price * qty;

    const data = {
      kebutuhan: form.kebutuhan.value,
      kategoriMenu: kategoriSelect.value,
      menuItem: menuSelect.value,
      qty: qty,
      harga: price,
      subtotal: subtotal,
      nama: form.nama.value,
      whatsapp: form.whatsapp.value,
      email: form.email.value,
      pesan: form.pesan.value,
    };

    if (
      !data.kebutuhan ||
      !data.kategoriMenu ||
      !data.menuItem ||
      !data.nama ||
      !data.whatsapp ||
      !data.pesan
    ) {
      alert("Harap isi semua data wajib!");
      return;
    }

    dataList.push(data);
    localStorage.setItem("dataList", JSON.stringify(dataList));

    form.reset();
    subtotalInput.value = "";
    menuSelect.innerHTML = '<option value="">— Pilih Menu —</option>';
    render();
  });

  // =======================
  // KIRIM WA
  // =======================
  btnWA.addEventListener("click", function () {
    if (dataList.length === 0) {
      alert("Belum ada data!");
      return;
    }

    let text = "Halo Kopi Kalcer\n\nSaya ingin memesan:\n\n";
    let total = 0;

    dataList.forEach((item, i) => {
      total += item.subtotal;

      text += `${i + 1}. ${item.menuItem}\n`;
      text += `   Qty: ${item.qty}\n`;
      text += `   Harga: ${formatRupiah(item.harga)}\n`;
      text += `   Subtotal: ${formatRupiah(item.subtotal)}\n\n`;
    });

    text += `Total Pesanan: ${formatRupiah(total)}\n\n`;
    text += `Nama: ${dataList[0].nama}\n`;
    text += `No. WA: ${dataList[0].whatsapp}\n`;

    const no_admin = "6282131466942";
    const link = `https://wa.me/${no_admin}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank");
  });

  render();
});

// =======================
// FUNGSI UTILITAS
// =======================

// Mengambil harga dari string menu
function getPrice(menu) {
  const match = menu.match(/Rp\s?([\d.]+)/);
  return match ? parseInt(match[1].replace(/\./g, ""), 10) : 0;
}

// Format angka ke Rupiah
function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}
