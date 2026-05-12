// =========================
// DARK MODE
// =========================

const body = document.body;
const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
  if (body.classList.contains("dark-mode")) {
    themeToggle.innerHTML = "☀️ Light Mode";
  } else {
    themeToggle.innerHTML = "🌙 Dark Mode";
  }
}

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
}

if (themeToggle) {
  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

    updateThemeButton();
  });
}

function updateTableTheme() {
  const table = document.getElementById("stokTable");

  if (!table) return;

  if (body.classList.contains("dark-mode")) {
    table.classList.add("table-dark");
  } else {
    table.classList.remove("table-dark");
  }
}

function updateTrackingListTheme() {
  const list = document.getElementById("trackingList");

  if (!list) return;

  const items = list.querySelectorAll("li");

  items.forEach((item) => {
    if (body.classList.contains("dark-mode")) {
      item.classList.add("bg-dark", "text-light");
    } else {
      item.classList.remove("bg-dark", "text-light");
    }
  });
}

// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = dataPengguna.find(
      (item) => item.email === email && item.password === password,
    );

    if (user) {
      localStorage.setItem("userLogin", JSON.stringify(user));

      window.location.href = "dashboard.html";
    } else {
      alert("email/password yang anda masukkan salah");
    }
  });
}

// =========================
// GREETING
// =========================

const greeting = document.getElementById("greeting");
const username = document.getElementById("username");

const userData = JSON.parse(localStorage.getItem("userLogin"));

let namaUser = "User";

if (userData && userData.nama) {
  namaUser = userData.nama;
}

if (greeting) {
  const jam = new Date().getHours();

  let sapaan = "";

  if (jam >= 4 && jam < 11) {
    sapaan = "Selamat Pagi ☀️";
  } else if (jam >= 11 && jam < 15) {
    sapaan = "Selamat Siang 🌤️";
  } else if (jam >= 15 && jam < 18) {
    sapaan = "Selamat Sore 🌆";
  } else {
    sapaan = "Selamat Malam 🌙";
  }

  // INI INTINYA (gabung sapaan + nama)
  greeting.innerHTML = `${sapaan} ${namaUser}`;

  if (username) {
    username.innerHTML = namaUser;
  }
}

// =========================
// LOGOUT
// =========================

function logoutUser() {
  localStorage.removeItem("userLogin");

  window.location.href = "index.html";
}

// =========================
// STATISTIK DASHBOARD
// =========================

function loadCardsDashboard() {
  const bahan = window.dataBahanAjar || [];
  const tracking = window.dataTracking || {};
  const user = window.dataPengguna || [];

  // bahan ajar
  document.getElementById("cardBahan").innerText = bahan.length;

  // total stok (jumlah semua stok barang)
  const totalStok = bahan.reduce((sum, item) => {
    return sum + Number(item.stok);
  }, 0);

  document.getElementById("cardStok").innerText = totalStok;

  // tracking
  document.getElementById("cardTracking").innerText =
    Object.keys(tracking).length;

  // user
  document.getElementById("cardUser").innerText = user.length;
}

// =========================
// TAMPILKAN DATA STOK
// =========================

const stokTableBody = document.getElementById("stokTableBody");

if (stokTableBody) {
  tampilkanStok();
}

function tampilkanStok() {
  stokTableBody.innerHTML = "";

  dataBahanAjar.forEach((item, index) => {
    stokTableBody.innerHTML += `
      <tr>

        <td>${index + 1}</td>

        <td>
          <img
            src="${item.cover}"
            class="cover-img"
            alt="Cover"
          >
        </td>

        <td>${item.kodeBarang}</td>

        <td>${item.namaBarang}</td>

        <td>${item.jenisBarang}</td>

        <td>${item.edisi}</td>

        <td>${item.stok}</td>

      </tr>
    `;
  });
}

// =========================
// SEARCH STOK
// =========================

function searchStok() {
  const input = document.getElementById("searchStok").value.toLowerCase();

  const rows = document.querySelectorAll("#stokTableBody tr");

  let ditemukan = false;

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();

    if (text.includes(input)) {
      row.style.display = "";

      ditemukan = true;
    } else {
      row.style.display = "none";
    }
  });

  // Pesan jika tidak ditemukan

  let emptyRow = document.getElementById("emptySearch");

  // Hapus dulu kalau sudah ada

  if (emptyRow) {
    emptyRow.remove();
  }

  // Kalau tidak ada data ditemukan

  if (!ditemukan) {
    stokTableBody.innerHTML += `
      <tr id="emptySearch">

        <td colspan="7" class="text-center py-4">

          📚 Data bahan ajar tidak ditemukan

        </td>

      </tr>
    `;
  }
}

// =========================
// TAMBAH STOK
// =========================

function tambahStok() {
  const kodeBarang = document.getElementById("kodeBarang").value;

  const namaBarang = document.getElementById("namaBarang").value;

  const jenisBarang = document.getElementById("jenisBarang").value;

  const edisiBarang = document.getElementById("edisiBarang").value;

  const stokBarang = document.getElementById("stokBarang").value;

  const coverBarang = document.getElementById("coverBarang").value;

  // Validasi sederhana

  if (
    kodeBarang === "" ||
    namaBarang === "" ||
    jenisBarang === "" ||
    edisiBarang === "" ||
    stokBarang === "" ||
    coverBarang === ""
  ) {
    alert("Semua data harus diisi");
    return;
  }

  // Data baru

  const dataBaru = {
    kodeBarang: kodeBarang,

    namaBarang: namaBarang,

    jenisBarang: jenisBarang,

    edisi: edisiBarang,

    stok: stokBarang,

    cover: "assets/img/" + coverBarang,
  };

  // Push ke array

  dataBahanAjar.push(dataBaru);

  // Refresh tabel

  tampilkanStok();

  // Reset form

  document.getElementById("kodeBarang").value = "";

  document.getElementById("namaBarang").value = "";

  document.getElementById("jenisBarang").value = "";

  document.getElementById("edisiBarang").value = "";

  document.getElementById("stokBarang").value = "";

  document.getElementById("coverBarang").value = "";

  // Tutup modal Bootstrap

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalTambahStok"),
  );

  modal.hide();

  // Notifikasi

  alert("Data stok berhasil ditambahkan 😎");
}

// =========================
// TRACKING PENGIRIMAN
// =========================

function cariTracking() {
  const nomorDO = document.getElementById("nomorDO").value;

  const hasilTracking = document.getElementById("hasilTracking");

  const data = dataTracking[nomorDO];

  // Kalau data ditemukan

  if (data) {
    let statusClass = "secondary";

    if (data.status === "Dikirim") {
      statusClass = "success";
    }

    if (data.status === "Dalam Perjalanan") {
      statusClass = "warning";
    }

    // Timeline perjalanan

    let perjalananHTML = "";

    data.perjalanan.forEach((item) => {
      perjalananHTML += `
        <li class="list-group-item">

          <strong>${item.waktu}</strong>

          <br>

          ${item.keterangan}

        </li>
      `;
    });

    // Render hasil

    hasilTracking.innerHTML = `

      <div class="card border-0 shadow-sm">

        <div class="card-body">

          <div class="d-flex flex-wrap justify-content-between gap-3 mb-3">

            <div>
              <h4>${data.nama}</h4>

              <p class="text-secondary mb-0">
                Nomor DO: ${data.nomorDO}
              </p>
            </div>

            <span class="badge bg-${statusClass} d-inline-flex align-items-center px-3 py-2">
              ${data.status}
            </span>

          </div>

          <div class="row g-3 mb-4">

            <div class="col-md-3">
              <div class="border rounded p-3 h-100">
                <small class="text-secondary">
                  Ekspedisi
                </small>

                <h6 class="mt-2">
                  ${data.ekspedisi}
                </h6>
              </div>
            </div>

            <div class="col-md-3">
              <div class="border rounded p-3 h-100">
                <small class="text-secondary">
                  Tanggal Kirim
                </small>

                <h6 class="mt-2">
                  ${data.tanggalKirim}
                </h6>
              </div>
            </div>

            <div class="col-md-3">
              <div class="border rounded p-3 h-100">
                <small class="text-secondary">
                  Jenis Paket
                </small>

                <h6 class="mt-2">
                  ${data.paket}
                </h6>
              </div>
            </div>

            <div class="col-md-3">
              <div class="border rounded p-3 h-100">
                <small class="text-secondary">
                  Total Pembayaran
                </small>

                <h6 class="mt-2">
                  ${data.total}
                </h6>
              </div>
            </div>

          </div>

          <h5 class="mb-3">
            📍 Riwayat Perjalanan
          </h5>

          <ul class="list-group" id="trackingList">

            ${perjalananHTML}

          </ul>

        </div>

      </div>
    `;
    setTimeout(() => {
      updateTrackingListTheme();
    }, 0);
  } else {
    hasilTracking.innerHTML = `

      <div class="alert alert-warning">

        📦 Nomor delivery order tidak ditemukan

      </div>
    `;
  }
}
