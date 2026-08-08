// ============================================================
// ABSENSI.JS
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// VERSI FINAL
// ============================================================

// ============================================================
// API GOOGLE APPS SCRIPT
// ============================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// LOGIN
// ============================================================

const role =
    localStorage.getItem("role") || "";

const nisnLogin =
    String(localStorage.getItem("nisn") || "").trim();

const namaSiswa =
    localStorage.getItem("namaSiswa") || "";

const namaGuru =
    localStorage.getItem("namaGuru") || "";


// ============================================================
// DEBUG
// ============================================================

console.log("====================================");
console.log("ABSENSI.JS VERSI FINAL");
console.log("Role :", role);
console.log("NISN Login :", nisnLogin);
console.log("Nama Siswa :", namaSiswa);
console.log("====================================");


// ============================================================
// CEK LOGIN
// ============================================================

if (localStorage.getItem("login") !== "true") {

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}


// ============================================================
// VARIABEL
// ============================================================

let dataSiswa = [];
let dataAbsensi = [];


// ============================================================
// ELEMENT HTML
// ============================================================

const tabel =
    document.getElementById("tabelAbsensi");

const info =
    document.getElementById("infoAbsensi");

const tanggalInput =
    document.getElementById("tanggal");

const btnSimpan =
    document.getElementById("btnSimpan");


// ============================================================
// TAMPILKAN NAMA LOGIN
// ============================================================

function tampilkanNamaLogin() {

    const nama =
        document.getElementById("namaLogin");

    if (!nama) return;

    if (role === "guru") {

        nama.innerHTML =
            "👨‍🏫 " + namaGuru;

    } else {

        nama.innerHTML =
            "👨‍🎓 " + namaSiswa;

    }

}


// ============================================================
// PESAN LOADING
// ============================================================

function loadingPesan() {

    if (info) {

        info.innerHTML =
            "⏳ Sedang memuat data siswa...";

    }

    if (tabel) {

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    text-align:center;
                    padding:30px;
                    color:#2563eb;
                    font-weight:bold;
                    ">
                    ⏳ Sedang memuat data siswa...
                </td>
            </tr>
        `;

    }

}


// ============================================================
// LOAD DATA SISWA
// ============================================================

async function loadSiswa() {

    try {

        console.log("Mengambil data siswa...");

        const url =
            API_URL +
            "?action=siswa&_=" +
            Date.now();

        console.log("API SISWA:", url);

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Server error " +
                response.status
            );

        }

        const text =
            await response.text();

        console.log(
            "Response siswa:",
            text
        );

        let data;

        try {

            data = JSON.parse(text);

        } catch (e) {

            throw new Error(
                "Response Google Apps Script bukan JSON."
            );

        }

        if (!Array.isArray(data)) {

            throw new Error(
                "Data siswa bukan array."
            );

        }

        dataSiswa = data;

        console.log(
            "Jumlah siswa:",
            dataSiswa.length
        );

        if (dataSiswa.length === 0) {

            throw new Error(
                "Data siswa kosong."
            );

        }

        // ====================================================
        // JIKA SISWA
        // HANYA TAMPILKAN SISWA YANG LOGIN
        // ====================================================

        if (role !== "guru") {

            const siswaSaya =
                dataSiswa.filter(function (siswa) {

                    const nisn =
                        String(
                            siswa.NISN ||
                            siswa.nisn ||
                            ""
                        ).trim();

                    return nisn === nisnLogin;

                });

            console.log(
                "Data siswa login:",
                siswaSaya
            );

            if (siswaSaya.length === 0) {

                throw new Error(
                    "NISN login tidak ditemukan pada data siswa."
                );

            }

            dataSiswa = siswaSaya;

        }

        // ====================================================
        // TAMPILKAN SESUAI ROLE
        // ====================================================

        if (role === "guru") {

            tampilkanFormGuru();

        } else {

            await loadAbsensiSiswa();

        }

    }

    catch (error) {

        console.error(
            "ERROR LOAD SISWA:",
            error
        );

        if (info) {

            info.innerHTML =
                "❌ " + error.message;

        }

        if (tabel) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        text-align:center;
                        padding:30px;
                        color:red;
                        font-weight:bold;
                        ">
                        ❌ Gagal memuat data siswa
                        <br><br>
                        ${error.message}
                    </td>
                </tr>
            `;

        }

    }

}


// ============================================================
// TAMPILKAN FORM ABSENSI GURU
// ============================================================

function tampilkanFormGuru() {

    if (!tabel) return;

    tabel.innerHTML = "";

    dataSiswa.forEach(function (siswa, index) {

        const nisn =
            String(
                siswa.NISN ||
                siswa.nisn ||
                ""
            ).trim();

        const nama =
            String(
                siswa.NAMA ||
                siswa.nama ||
                ""
            ).trim();

        const tr =
            document.createElement("tr");

        tr.innerHTML = `

            <td style="text-align:center;">
                ${index + 1}
            </td>

            <td style="font-weight:bold;">
                ${nama}
            </td>

            <td>
                ${nisn}
            </td>

            <td>

                <select
                    class="status-absensi"
                    data-nisn="${nisn}"
                    data-nama="${nama}">

                    <option value="H">
                        H - Hadir
                    </option>

                    <option value="S">
                        S - Sakit
                    </option>

                    <option value="I">
                        I - Izin
                    </option>

                    <option value="A">
                        A - Alfa
                    </option>

                </select>

            </td>

        `;

        tabel.appendChild(tr);

    });

    if (info) {

        info.innerHTML =
            "✅ Menampilkan " +
            dataSiswa.length +
            " siswa.";

    }

    if (btnSimpan) {

        btnSimpan.style.display = "inline-block";

    }

    hitungStatistik();

}


// ============================================================
// LOAD ABSENSI SISWA
// ============================================================

async function loadAbsensiSiswa() {

    try {

        const nisn =
            nisnLogin;

        if (!nisn) {

            throw new Error(
                "NISN login tidak ditemukan."
            );

        }

        const url =
            API_URL +
            "?action=absensi&nisn=" +
            encodeURIComponent(nisn) +
            "&_=" +
            Date.now();

        console.log(
            "API ABSENSI SISWA:",
            url
        );

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Server error " +
                response.status
            );

        }

        const text =
            await response.text();

        console.log(
            "Response absensi:",
            text
        );

        let data;

        try {

            data = JSON.parse(text);

        } catch (e) {

            throw new Error(
                "Data absensi bukan JSON."
            );

        }

        if (!Array.isArray(data)) {

            throw new Error(
                "Format data absensi tidak benar."
            );

        }

        dataAbsensi = data;

        tampilkanAbsensiSiswa();

    }

    catch (error) {

        console.error(
            "ERROR ABSENSI SISWA:",
            error
        );

        if (info) {

            info.innerHTML =
                "❌ " + error.message;

        }

        if (tabel) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        text-align:center;
                        padding:30px;
                        color:red;
                        ">
                        ❌ Gagal mengambil data absensi
                        <br><br>
                        ${error.message}
                    </td>
                </tr>
            `;

        }

    }

}


// ============================================================
// TAMPILKAN ABSENSI SISWA
// ============================================================

function tampilkanAbsensiSiswa() {

    if (!tabel) return;

    tabel.innerHTML = "";

    // --------------------------------------------------------
    // JIKA BELUM ADA ABSENSI
    // --------------------------------------------------------

    if (dataAbsensi.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    text-align:center;
                    padding:30px;
                    ">
                    📭 Belum ada data absensi.
                </td>
            </tr>
        `;

        if (info) {

            info.innerHTML =
                "📭 Belum ada riwayat absensi.";

        }

        return;

    }


    // --------------------------------------------------------
    // TAMPILKAN DATA
    // --------------------------------------------------------

    dataAbsensi.forEach(function (item, index) {

        const tanggal =
            item.TANGGAL ||
            item.tanggal ||
            "-";

        const nama =
            item.NAMA ||
            item.nama ||
            namaSiswa;

        const nisn =
            item.NISN ||
            item.nisn ||
            nisnLogin;

        const status =
            item.STATUS ||
            item.status ||
            "H";

        let statusText =
            "H - Hadir";

        let icon =
            "🟢";

        if (status === "S") {

            statusText =
                "S - Sakit";

            icon =
                "🟡";

        }

        else if (status === "I") {

            statusText =
                "I - Izin";

            icon =
                "📄";

        }

        else if (status === "A") {

            statusText =
                "A - Alfa";

            icon =
                "❌";

        }

        const tr =
            document.createElement("tr");

        tr.innerHTML = `

            <td style="text-align:center;">
                ${index + 1}
            </td>

            <td>
                ${tanggal}
            </td>

            <td>
                ${nama}
                <br>
                <small>${nisn}</small>
            </td>

            <td style="font-weight:bold;">
                ${icon} ${statusText}
            </td>

        `;

        tabel.appendChild(tr);

    });


    if (info) {

        info.innerHTML =
            "✅ Menampilkan " +
            dataAbsensi.length +
            " data absensi untuk " +
            namaSiswa +
            ".";

    }


    // Untuk siswa tidak perlu tombol simpan
    if (btnSimpan) {

        btnSimpan.style.display =
            "none";

    }


    hitungStatistikSiswa();

}


// ============================================================
// STATISTIK GURU
// ============================================================

function hitungStatistik() {

    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;

    semua.forEach(function (select) {

        if (select.value === "H")
            hadir++;

        if (select.value === "S")
            sakit++;

        if (select.value === "I")
            izin++;

        if (select.value === "A")
            alfa++;

    });

    setStatistik(
        hadir,
        sakit,
        izin,
        alfa
    );

}


// ============================================================
// STATISTIK SISWA
// ============================================================

function hitungStatistikSiswa() {

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;

    dataAbsensi.forEach(function (item) {

        const status =
            item.STATUS ||
            item.status ||
            "";

        if (status === "H")
            hadir++;

        if (status === "S")
            sakit++;

        if (status === "I")
            izin++;

        if (status === "A")
            alfa++;

    });

    setStatistik(
        hadir,
        sakit,
        izin,
        alfa
    );

}


// ============================================================
// SET STATISTIK KE HTML
// ============================================================

function setStatistik(
    hadir,
    sakit,
    izin,
    alfa
) {

    const h =
        document.getElementById("jmlHadir");

    const s =
        document.getElementById("jmlSakit");

    const i =
        document.getElementById("jmlIzin");

    const a =
        document.getElementById("jmlAlfa");

    if (h)
        h.innerText = hadir;

    if (s)
        s.innerText = sakit;

    if (i)
        i.innerText = izin;

    if (a)
        a.innerText = alfa;

}


// ============================================================
// PERUBAHAN STATUS GURU
// ============================================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.classList.contains(
                "status-absensi"
            )
        ) {

            hitungStatistik();

        }

    }
);


// ============================================================
// SIMPAN ABSENSI GURU
// ============================================================

async function simpanAbsensi() {

    if (role !== "guru") {

        alert(
            "❌ Hanya guru yang dapat menyimpan absensi."
        );

        return;

    }

    if (!tanggalInput) {

        alert(
            "❌ Kolom tanggal tidak ditemukan."
        );

        return;

    }

    const tanggal =
        tanggalInput.value;

    if (!tanggal) {

        alert(
            "⚠️ Silakan pilih tanggal terlebih dahulu."
        );

        return;

    }

    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );

    if (semua.length === 0) {

        alert(
            "❌ Data siswa belum tersedia."
        );

        return;

    }

    const yakin =
        confirm(
            "Simpan absensi untuk " +
            semua.length +
            " siswa pada tanggal " +
            tanggal +
            "?"
        );

    if (!yakin)
        return;


    const data = [];

    semua.forEach(function (select) {

        data.push({

            tanggal:
                tanggal,

            nisn:
                select.dataset.nisn,

            nama:
                select.dataset.nama,

            status:
                select.value

        });

    });


    if (btnSimpan) {

        btnSimpan.disabled = true;

        btnSimpan.innerHTML =
            "⏳ Menyimpan...";

    }


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "simpanAbsensi",

                            data:
                                data

                        })

                }
            );


        const text =
            await response.text();

        console.log(
            "Response simpan:",
            text
        );


        const hasil =
            JSON.parse(text);


        if (
            hasil.status !== true
        ) {

            throw new Error(
                hasil.pesan ||
                "Absensi gagal disimpan."
            );

        }


        alert(
            "✅ Absensi berhasil disimpan!"
        );


    }

    catch (error) {

        console.error(
            "ERROR SIMPAN:",
            error
        );

        alert(
            "❌ Gagal menyimpan absensi.\n\n" +
            error.message
        );

    }

    finally {

        if (btnSimpan) {

            btnSimpan.disabled = false;

            btnSimpan.innerHTML =
                "💾 Simpan Absensi";

        }

    }

}


// ============================================================
// HUBUNGKAN TOMBOL SIMPAN
// ============================================================

if (btnSimpan) {

    btnSimpan.addEventListener(
        "click",
        simpanAbsensi
    );

}


// ============================================================
// REFRESH
// ============================================================

const btnRefresh =
    document.getElementById(
        "btnRefresh"
    );

if (btnRefresh) {

    btnRefresh.addEventListener(
        "click",
        function () {

            location.reload();

        }
    );

}


// ============================================================
// TANGGAL DEFAULT UNTUK GURU
// ============================================================

function setTanggalHariIni() {

    if (
        !tanggalInput ||
        role !== "guru"
    )
        return;

    const sekarang =
        new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    const hari =
        String(
            sekarang.getDate()
        ).padStart(2, "0");

    tanggalInput.value =
        tahun +
        "-" +
        bulan +
        "-" +
        hari;

}


// ============================================================
// MULAI
// ============================================================

function mulaiAbsensi() {

    console.log(
        "🚀 ABSENSI DIMULAI"
    );

    tampilkanNamaLogin();

    loadingPesan();

    setTanggalHariIni();

    loadSiswa();

}


// ============================================================
// DOM READY
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        mulaiAbsensi
    );

} else {

    mulaiAbsensi();

}
