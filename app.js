// Ikon dipilih bergiliran karena data layanan di database tidak menyimpan ikon.
const IKON_LAYANAN = ["💻", "📱", "💡", "📈", "🎨", "⚙️"];

async function muatLayanan() {
  const wadah = document.querySelector("#daftar-layanan");
  try {
    const res = await fetch("/api/services");
    if (!res.ok) throw new Error("Gagal memuat layanan");
    const data = await res.json();

    wadah.innerHTML = "";
    if (data.length === 0) wadah.textContent = "Belum ada layanan.";
    data.forEach((item, i) => {
      const kartu = document.createElement("article");
      kartu.className = "kartu kartu-layanan";

      const ikon = document.createElement("span");
      ikon.className = "ikon";
      ikon.setAttribute("aria-hidden", "true");
      ikon.textContent = IKON_LAYANAN[i % IKON_LAYANAN.length];

      // textContent, bukan innerHTML: teks dari database tidak dijalankan sebagai HTML (cegah XSS).
      const judul = document.createElement("h3");
      judul.textContent = item.nama;
      const isi = document.createElement("p");
      isi.textContent = item.deskripsi ?? "";

      kartu.append(ikon, judul, isi);
      wadah.append(kartu);
    });
  } catch (err) {
    wadah.textContent = "Maaf, layanan belum bisa ditampilkan.";
  }
}

// Menu HP: tombol garis tiga membuka/menutup navigasi.
const tombolMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");

function aturMenu(buka) {
  menu.classList.toggle("terbuka", buka);
  tombolMenu.setAttribute("aria-expanded", String(buka));
  tombolMenu.setAttribute("aria-label", buka ? "Tutup menu" : "Buka menu");
}

tombolMenu.addEventListener("click", () =>
  aturMenu(!menu.classList.contains("terbuka")),
);
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") aturMenu(false);
});

document.querySelector("#tahun").textContent = new Date().getFullYear();
muatLayanan();


/* Interaksi modal Login dan Register */
const authModal = document.querySelector("#auth-modal");
const authTitle = document.querySelector("#auth-title");
const authSubtitle = document.querySelector("#auth-subtitle");
const authStatus = document.querySelector("#auth-status");
const formLogin = document.querySelector("#form-login");
const formRegister = document.querySelector("#form-register");
const authTabs = document.querySelectorAll("[data-auth-tab]");

function pilihAuth(mode) {
  const loginAktif = mode === "login";
  formLogin.classList.toggle("hidden", !loginAktif);
  formLogin.classList.toggle("flex", loginAktif);
  formRegister.classList.toggle("hidden", loginAktif);
  formRegister.classList.toggle("flex", !loginAktif);
  authTitle.textContent = loginAktif ? "Selamat datang kembali!" : "Buat akun baru";
  authSubtitle.textContent = loginAktif
    ? "Masuk untuk melanjutkan ke akun Anda."
    : "Daftar dan mulai gunakan layanan kami.";
  authStatus.textContent = "";
  authTabs.forEach((tab) => {
    const aktif = tab.dataset.authTab === mode;
    tab.classList.toggle("bg-white", aktif);
    tab.classList.toggle("text-utama", aktif);
    tab.classList.toggle("shadow-sm", aktif);
    tab.classList.toggle("text-teks-lembut", !aktif);
  });
}

function bukaAuth(mode) {
  pilihAuth(mode);
  authModal.classList.remove("hidden");
  authModal.classList.add("flex");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("overflow-hidden");
  document.querySelector(mode === "login" ? "#login-email" : "#register-name").focus();
}

function tutupAuth() {
  authModal.classList.add("hidden");
  authModal.classList.remove("flex");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overflow-hidden");
}

document.querySelectorAll("[data-buka-auth]").forEach((tombol) => {
  tombol.addEventListener("click", () => bukaAuth(tombol.dataset.bukaAuth));
});
authTabs.forEach((tab) => tab.addEventListener("click", () => pilihAuth(tab.dataset.authTab)));
document.querySelector("#auth-tutup").addEventListener("click", tutupAuth);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) tutupAuth();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.classList.contains("hidden")) tutupAuth();
});

// Form perlu dihubungkan ke endpoint autentikasi backend agar login/register benar-benar berfungsi.
[formLogin, formRegister].forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    authStatus.textContent = "Tampilan siap. Fitur login/register perlu dihubungkan ke backend terlebih dahulu.";
  });
});
