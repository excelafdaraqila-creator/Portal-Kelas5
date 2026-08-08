// ====================================================
// ABSENSI.JS
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// SISWA = HANYA MELIHAT ABSENSI SENDIRI
// GURU = MELIHAT SEMUA ABSENSI
// ====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ====================================================
// LOGIN
// ====================================================

const role =
    String(localStorage.getItem("role") || "").trim().toLowerCase();

const nisnLogin =
    String(localStorage.getItem("nisn") || "").trim();

const namaSiswa =
    String(localStorage.getItem("namaSiswa") || "").trim();

const namaGuru =
    String(localStorage.getItem("namaGuru") || "").trim();

console.log("====================================");
console.log("ABSENSI PORTAL KELAS 5");
console.log("Role :", role);
console.log("NISN Login :", nisnLogin);
console.log("Nama Siswa :", namaSiswa);
console.log("====================================");


// ====================================================
// CEK LOGIN
// ====================================================

if (localStorage.getItem("login") !== "true") {

    alert("Silakan login terlebih dahulu.");

    location.href = "login.html";

}


// ====================================================
// VARIABEL
// ====================================================

let semuaAbsensi = [];
let dataTampil = [];


// ====================================================
// ELEMENT
// ====================================================

const tabel =
    document.getElementById("tabelAbsensi");

const info =
    document.getElementById("infoAbsensi");

const tanggalInput =
    document.getElementById("tanggal");

const btnRefresh =
    document.getElementById("btnRefresh");


// ====================================================
// TANGGAL HARI INI
// ====================================================

if (tanggalInput) {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(sekarang.getMonth() + 1)
        .padStart(2, "0");

    const tanggal =
        String(sekarang.getDate())
        .padStart(2, "0");

    tanggalInput.value =
        `${tahun}-${bulan}-${tanggal}`;

}


// ====================================================
// LOAD ABSENSI
// ====================================================

async function loadAbsensi() {

    try {

        if (tabel) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:#2563eb;
                        font-weight:bold;
                        ">
                        ⏳ Mengambil data absensi...
                    </td>
                </tr>
            `;

        }


        // =================================================
        // UNTUK SISWA
        // KIRIM NISN LOGIN KE SERVER
        // =================================================

        let url =
            API_URL +
            "?action=absensi" +
            "&nocache=" +
            Date.now();


        if (role !== "guru") {

            url +=
                "&nisn=" +
                encodeURIComponent(nisnLogin);

        }


        console.log("URL ABSENSI:");
        console.log(url);


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const text =
            await response.text();


        console.log(
            "RESPONSE ABSENSI:",
            text
        );


        const data =
            JSON.parse(text);


        if (!Array.isArray(data)) {

            throw new Error(
                data.pesan ||
                "Data absensi bukan array."
            );

        }


        semuaAbsensi = data;


        // =================================================
        // FILTER TAMBAHAN DI SISI SISWA
        // =================================================

        if (role === "guru") {

            dataTampil =
                semuaAbsensi;

        }
        else {

            dataTampil =
                semuaAbsensi.filter(function(item) {

                    const nisn =
                        String(
                            item.NISN ||
                            item.nisn ||
                            ""
                        ).trim();

                    return nisn === nisnLogin;

                });

        }


        console.log(
            "Jumlah seluruh data:",
            semuaAbsensi.length
        );

        console.log(
            "Jumlah data tampil:",
            dataTampil.length
        );


        renderAbsensi(
            dataTampil
        );


        updateInfo(
            dataTampil.length
        );


    }
    catch (error) {

        console.error(
            "ERROR ABSENSI:",
            error
        );


        if (tabel) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:red;
                        font-weight:bold;
                        ">
                        ❌ Gagal mengambil data absensi
                        <br><br>
                        ${error.message}
                    </td>
                </tr>
            `;

        }


        if (info) {

            info.innerHTML =
                "❌ " + error.message;

        }

    }

}


// ====================================================
// RENDER TABEL
// ====================================================

function renderAbsensi(data) {

    if (!tabel) return;


    tabel.innerHTML = "";


    if (data.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#777;
                    ">
                    📭 Belum ada data absensi.
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(function(item, index) {

        // ==============================================
        // PENTING
        // JANGAN MENGGUNAKAN item[0], item[1], dst.
        // GUNAKAN NAMA KOLOM
        // ==============================================

        const tanggal =
            item.TANGGAL ||
            item.tanggal ||
            "-";


        const nama =
            item.NAMA ||
            item.nama ||
            namaSiswa ||
            "-";


        const nisn =
            item.NISN ||
            item.nisn ||
            "-";


        const status =
            item.STATUS ||
            item.status ||
            "-";


        let warna = "#555";


        if (status === "H") {

            warna = "#16a34a";

        }
        else if (status === "S") {

            warna = "#2563eb";

        }
        else if (status === "I") {

            warna = "#d97706";

        }
        else if (status === "A") {

            warna = "#dc2626";

        }


        let keterangan = status;


        if (status === "H") {

            keterangan =
                "H - Hadir";

        }
        else if (status === "S") {

            keterangan =
                "S - Sakit";

        }
        else if (status === "I") {

            keterangan =
                "I - Izin";

        }
        else if (status === "A") {

            keterangan =
                "A - Alfa";

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
                <b>${nama}</b>
                <br>
                <small>${nisn}</small>
            </td>

            <td style="
                font-weight:bold;
                color:${warna};
            ">
                🟢 ${keterangan}
            </td>

        `;


        tabel.appendChild(tr);

    });

}


// ====================================================
// INFO
// ====================================================

function updateInfo(jumlah) {

    if (!info) return;


    if (role === "guru") {

        info.innerHTML =
            `✅ Menampilkan ${jumlah} data absensi.`;

    }
    else {

        info.innerHTML =
            `✅ Menampilkan ${jumlah} data absensi untuk <b>${namaSiswa}</b>.`;

    }

}


// ====================================================
// FILTER BERDASARKAN TANGGAL
// ====================================================

if (tanggalInput) {

    tanggalInput.addEventListener(
        "change",
        function() {

            const tanggal =
                this.value;


            if (!tanggal) {

                renderAbsensi(
                    dataTampil
                );

                return;

            }


            const hasil =
                dataTampil.filter(
                    function(item) {

                        const t =
                            item.TANGGAL ||
                            item.tanggal ||
                            "";

                        return String(t)
                            .substring(0, 10)
                            === tanggal;

                    }
                );


            renderAbsensi(hasil);


            if (info) {

                info.innerHTML =
                    `📅 ${hasil.length} data absensi pada ${tanggal}.`;

            }

        }
    );

}


// ====================================================
// REFRESH
// ====================================================

if (btnRefresh) {

    btnRefresh.onclick =
        function() {

            location.reload();

        };

}


// ====================================================
// MULAI
// ====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadAbsensi
    );

}
else {

    loadAbsensi();

}
