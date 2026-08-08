// ============================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ABSENSI.JS FINAL
// Developer : Asep Jamhur
// ============================================================


// ============================================================
// KONFIGURASI API
// ============================================================

const ABSENSI_API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// DATA LOGIN
// ============================================================

const absensiRole =
    String(localStorage.getItem("role") || "").trim().toLowerCase();

const absensiNisn =
    String(localStorage.getItem("nisn") || "").trim();

const absensiNamaSiswa =
    String(localStorage.getItem("namaSiswa") || "").trim();

const absensiNamaGuru =
    String(localStorage.getItem("namaGuru") || "").trim();


// ============================================================
// DATA GLOBAL
// ============================================================

let dataSemuaSiswa = [];

let dataAbsensi = [];

let sedangMemuat = false;

let sedangMenyimpan = false;


// ============================================================
// DEBUG
// ============================================================

console.log("==========================================");
console.log("ABSENSI.JS FINAL");
console.log("Role :", absensiRole);
console.log("NISN :", absensiNisn);
console.log("Nama siswa :", absensiNamaSiswa);
console.log("==========================================");


// ============================================================
// CEK LOGIN
// ============================================================

if (
    localStorage.getItem("login") !== "true"
) {

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}


// ============================================================
// FUNGSI HELPER
// ============================================================

function getElement(id) {

    return document.getElementById(id);

}


// ============================================================
// API GET
// ============================================================

async function ambilAPI(action) {

    const url =
        ABSENSI_API_URL +
        "?action=" +
        encodeURIComponent(action) +
        "&nocache=" +
        Date.now();

    console.log("Memanggil API :", url);

    const response =
        await fetch(url, {
            method: "GET",
            cache: "no-store"
        });

    if (!response.ok) {

        throw new Error(
            "Server error HTTP " +
            response.status
        );

    }

    const text =
        await response.text();

    console.log(
        "Response " + action + ":",
        text
    );

    if (!text) {

        throw new Error(
            "Server mengirim data kosong."
        );

    }

    let hasil;

    try {

        hasil =
            JSON.parse(text);

    } catch (error) {

        console.error(
            "JSON tidak valid:",
            text
        );

        throw new Error(
            "Response server bukan JSON yang valid."
        );

    }

    return hasil;

}


// ============================================================
// AMBIL DATA SISWA
// KHUSUS GURU
// ============================================================

async function ambilDataSiswa() {

    const tabel =
        getElement("tabelAbsensi");

    const info =
        getElement("infoAbsensi");


    if (tabel) {

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#2563eb;
                    font-weight:bold;">
                    ⏳ Memuat data siswa...
                </td>
            </tr>
        `;

    }


    if (info) {

        info.innerHTML =
            "⏳ Mengambil data siswa...";

    }


    try {

        const data =
            await ambilAPI("siswa");


        if (!Array.isArray(data)) {

            console.error(
                "Data siswa bukan Array:",
                data
            );

            throw new Error(
                "Data siswa bukan Array."
            );

        }


        dataSemuaSiswa =
            data.filter(function(siswa) {

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

                return nisn || nama;

            });


        console.log(
            "Jumlah siswa:",
            dataSemuaSiswa.length
        );


        if (
            dataSemuaSiswa.length === 0
        ) {

            throw new Error(
                "Data siswa kosong."
            );

        }


        tampilkanFormGuru();


    } catch (error) {

        console.error(
            "Gagal mengambil siswa:",
            error
        );


        if (tabel) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:#dc2626;
                        font-weight:bold;">
                        ❌ Gagal memuat data siswa
                        <br><br>
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;

        }


        if (info) {

            info.innerHTML =
                "❌ " +
                escapeHTML(error.message);

        }

    }

}


// ============================================================
// TAMPILKAN FORM ABSENSI GURU
// ============================================================

function tampilkanFormGuru() {

    const tabel =
        getElement("tabelAbsensi");

    const info =
        getElement("infoAbsensi");


    if (!tabel) {

        console.error(
            "Elemen #tabelAbsensi tidak ditemukan."
        );

        return;

    }


    tabel.innerHTML = "";


    dataSemuaSiswa.forEach(
        function(siswa, index) {

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

                <td>
                    <b>${escapeHTML(nama)}</b>
                </td>

                <td>
                    ${escapeHTML(nisn)}
                </td>

                <td>

                    <select
                        class="status-absensi"
                        data-nisn="${escapeHTML(nisn)}"
                        data-nama="${escapeHTML(nama)}">

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

        }
    );


    if (info) {

        info.innerHTML =
            "✅ " +
            dataSemuaSiswa.length +
            " siswa berhasil dimuat.";

    }


    hitungStatistik();

}


// ============================================================
// AMBIL DATA ABSENSI DARI SPREADSHEET
// ============================================================

async function ambilDataAbsensi() {

    try {

        const data =
            await ambilAPI("absensi");


        console.log(
            "Data ABSENSI dari server:",
            data
        );


        if (!Array.isArray(data)) {

            console.error(
                "Data absensi bukan Array:",
                data
            );

            throw new Error(
                "Data absensi bukan Array."
            );

        }


        dataAbsensi =
            data;


        return dataAbsensi;


    } catch (error) {

        console.error(
            "Gagal mengambil data absensi:",
            error
        );

        throw error;

    }

}


// ============================================================
// TAMPILKAN ABSENSI SISWA
// ============================================================

async function tampilkanAbsensiSiswa() {

    const tabel =
        getElement("tabelAbsensi");

    const info =
        getElement("infoAbsensi");


    if (!tabel) {

        console.error(
            "#tabelAbsensi tidak ditemukan."
        );

        return;

    }


    tabel.innerHTML = `
        <tr>
            <td colspan="4"
                style="
                padding:30px;
                text-align:center;
                color:#2563eb;
                font-weight:bold;">
                ⏳ Memuat riwayat kehadiran...
            </td>
        </tr>
    `;


    if (info) {

        info.innerHTML =
            "⏳ Mengambil data kehadiran Anda...";

    }


    try {

        // --------------------------------------------
        // PASTIKAN NISN ADA
        // --------------------------------------------

        if (!absensiNisn) {

            throw new Error(
                "NISN siswa tidak ditemukan di sesi login."
            );

        }


        // --------------------------------------------
        // AMBIL ABSENSI
        // --------------------------------------------

        const semuaAbsensi =
            await ambilDataAbsensi();


        console.log(
            "NISN login:",
            absensiNisn
        );


        // --------------------------------------------
        // FILTER BERDASARKAN NISN
        // --------------------------------------------

        const milikSiswa =
            semuaAbsensi.filter(
                function(item) {

                    const nisn =
                        String(
                            item.NISN ||
                            item.nisn ||
                            item.Nisn ||
                            ""
                        ).trim();


                    return (
                        nisn ===
                        absensiNisn
                    );

                }
            );


        console.log(
            "Absensi siswa:",
            milikSiswa
        );


        // --------------------------------------------
        // JIKA TIDAK ADA DATA
        // --------------------------------------------

        if (
            milikSiswa.length === 0
        ) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:#64748b;
                        font-weight:bold;">
                        📋 Belum ada data kehadiran.
                    </td>
                </tr>
            `;


            if (info) {

                info.innerHTML =
                    "Belum ada data kehadiran untuk NISN " +
                    escapeHTML(absensiNisn) +
                    ".";

            }


            tampilkanStatistikSiswa([]);

            return;

        }


        // --------------------------------------------
        // URUTKAN TERBARU DI ATAS
        // --------------------------------------------

        milikSiswa.sort(
            function(a, b) {

                const tanggalA =
                    String(
                        a.Tanggal ||
                        a.tanggal ||
                        ""
                    );

                const tanggalB =
                    String(
                        b.Tanggal ||
                        b.tanggal ||
                        ""
                    );

                return tanggalB.localeCompare(
                    tanggalA
                );

            }
        );


        // --------------------------------------------
        // TAMPILKAN
        // --------------------------------------------

        tabel.innerHTML = "";


        milikSiswa.forEach(
            function(item, index) {

                const tanggal =
                    item.Tanggal ||
                    item.tanggal ||
                    "";

                const nisn =
                    item.NISN ||
                    item.nisn ||
                    "";

                const nama =
                    item.NAMA ||
                    item.nama ||
                    "";

                const status =
                    String(
                        item.Status ||
                        item.status ||
                        ""
                    ).trim().toUpperCase();


                const tr =
                    document.createElement("tr");


                tr.innerHTML = `

                    <td style="text-align:center;">
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            formatTanggal(tanggal)
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            nama ||
                            absensiNamaSiswa
                        )}
                    </td>

                    <td style="text-align:center;">
                        <b class="${classStatus(status)}">
                            ${iconStatus(status)}
                            ${namaStatus(status)}
                        </b>
                    </td>

                `;


                tabel.appendChild(tr);

            }
        );


        if (info) {

            info.innerHTML =
                "✅ Riwayat kehadiran " +
                escapeHTML(
                    absensiNamaSiswa ||
                    "siswa"
                ) +
                " berhasil dimuat.";

        }


        tampilkanStatistikSiswa(
            milikSiswa
        );


    } catch (error) {

        console.error(
            "ERROR ABSENSI SISWA:",
            error
        );


        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#dc2626;
                    font-weight:bold;">
                    ❌ Gagal mengambil data kehadiran
                    <br><br>
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;


        if (info) {

            info.innerHTML =
                "❌ " +
                escapeHTML(error.message);

        }

    }

}


// ============================================================
// FORMAT TANGGAL
// ============================================================

function formatTanggal(tanggal) {

    if (!tanggal) {

        return "-";

    }


    const text =
        String(tanggal).trim();


    // YYYY-MM-DD
    if (
        /^\d{4}-\d{2}-\d{2}$/.test(text)
    ) {

        const bagian =
            text.split("-");


        return (
            bagian[2] +
            "-" +
            bagian[1] +
            "-" +
            bagian[0]
        );

    }


    return text;

}


// ============================================================
// NAMA STATUS
// ============================================================

function namaStatus(status) {

    if (status === "H") {

        return "Hadir";

    }

    if (status === "S") {

        return "Sakit";

    }

    if (status === "I") {

        return "Izin";

    }

    if (status === "A") {

        return "Alfa";

    }

    return status || "-";

}


// ============================================================
// ICON STATUS
// ============================================================

function iconStatus(status) {

    if (status === "H") return "✅";

    if (status === "S") return "🤒";

    if (status === "I") return "📝";

    if (status === "A") return "❌";

    return "•";

}


// ============================================================
// CLASS STATUS
// ============================================================

function classStatus(status) {

    if (status === "H") return "status-hadir";

    if (status === "S") return "status-sakit";

    if (status === "I") return "status-izin";

    if (status === "A") return "status-alfa";

    return "";

}


// ============================================================
// STATISTIK SISWA
// ============================================================

function tampilkanStatistikSiswa(data) {

    let hadir = 0;

    let sakit = 0;

    let izin = 0;

    let alfa = 0;


    data.forEach(
        function(item) {

            const status =
                String(
                    item.Status ||
                    item.status ||
                    ""
                ).trim().toUpperCase();


            if (status === "H") hadir++;

            if (status === "S") sakit++;

            if (status === "I") izin++;

            if (status === "A") alfa++;

        }
    );


    const h =
        getElement("jmlHadir");

    const s =
        getElement("jmlSakit");

    const i =
        getElement("jmlIzin");

    const a =
        getElement("jmlAlfa");


    if (h) h.innerText = hadir;

    if (s) s.innerText = sakit;

    if (i) i.innerText = izin;

    if (a) a.innerText = alfa;

}


// ============================================================
// STATISTIK FORM GURU
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


    semua.forEach(
        function(select) {

            const status =
                select.value;


            if (status === "H") hadir++;

            if (status === "S") sakit++;

            if (status === "I") izin++;

            if (status === "A") alfa++;

        }
    );


    const h =
        getElement("jmlHadir");

    const s =
        getElement("jmlSakit");

    const i =
        getElement("jmlIzin");

    const a =
        getElement("jmlAlfa");


    if (h) h.innerText = hadir;

    if (s) s.innerText = sakit;

    if (i) i.innerText = izin;

    if (a) a.innerText = alfa;

}


// ============================================================
// SIMPAN ABSENSI GURU
// ============================================================

async function simpanAbsensiGuru() {

    if (sedangMenyimpan) {

        return;

    }


    const tanggalElement =
        getElement("tanggal");


    if (!tanggalElement) {

        alert(
            "❌ Kolom tanggal tidak ditemukan."
        );

        return;

    }


    const tanggal =
        tanggalElement.value;


    if (!tanggal) {

        alert(
            "⚠️ Silakan pilih tanggal absensi terlebih dahulu."
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


    // --------------------------------------------------------
    // KONFIRMASI
    // --------------------------------------------------------

    const yakin =
        confirm(
            "Simpan absensi " +
            semua.length +
            " siswa pada tanggal " +
            tanggal +
            "?"
        );


    if (!yakin) {

        return;

    }


    sedangMenyimpan = true;


    const tombol =
        getElement("btnSimpan");


    if (tombol) {

        tombol.disabled = true;

        tombol.innerHTML =
            "⏳ Menyimpan...";

    }


    try {

        const data = [];


        semua.forEach(
            function(select) {

                data.push({

                    tanggal:
                        tanggal,

                    nisn:
                        select.dataset.nisn ||
                        "",

                    nama:
                        select.dataset.nama ||
                        "",

                    status:
                        select.value ||
                        "H"

                });

            }
        );


        console.log(
            "Data yang dikirim:",
            data
        );


        const response =
            await fetch(
                ABSENSI_API_URL,
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
            "Response POST:",
            text
        );


        let hasil;


        try {

            hasil =
                JSON.parse(text);

        } catch (error) {

            throw new Error(
                "Response server bukan JSON yang valid."
            );

        }


        if (
            hasil.status !== true
        ) {

            throw new Error(
                hasil.pesan ||
                "Absensi gagal disimpan."
            );

        }


        alert(
            "✅ Absensi berhasil disimpan!\n\n" +
            "Tanggal: " +
            tanggal +
            "\nJumlah siswa: " +
            hasil.jumlah
        );


        // ----------------------------------------------------
        // SETELAH SIMPAN, REFRESH DATA
        // ----------------------------------------------------

        console.log(
            "Absensi berhasil masuk database."
        );


    } catch (error) {

        console.error(
            "ERROR SIMPAN:",
            error
        );


        alert(
            "❌ Gagal menyimpan absensi.\n\n" +
            error.message
        );


    } finally {

        sedangMenyimpan = false;


        if (tombol) {

            tombol.disabled = false;

            tombol.innerHTML =
                "💾 Simpan Absensi";

        }

    }

}


// ============================================================
// EVENT STATUS GURU
// ============================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target &&
            event.target.classList.contains(
                "status-absensi"
            )
        ) {

            hitungStatistik();

        }

    }
);


// ============================================================
// TOMBOL SIMPAN
// ============================================================

function pasangTombolSimpan() {

    const tombol =
        getElement("btnSimpan");


    if (!tombol) {

        console.warn(
            "Tombol #btnSimpan tidak ditemukan."
        );

        return;

    }


    tombol.onclick =
        function(event) {

            event.preventDefault();

            simpanAbsensiGuru();

        };


    console.log(
        "✅ Tombol Simpan terhubung."
    );

}


// ============================================================
// TOMBOL REFRESH
// ============================================================

function pasangTombolRefresh() {

    const tombol =
        getElement("btnRefresh");


    if (!tombol) return;


    tombol.onclick =
        function() {

            location.reload();

        };

}


// ============================================================
// TAMPILKAN NAMA LOGIN
// ============================================================

function tampilkanNamaLogin() {

    const elemen =
        getElement("namaLogin");


    if (!elemen) return;


    if (
        absensiRole === "guru"
    ) {

        elemen.innerHTML =
            "👨‍🏫 " +
            escapeHTML(
                absensiNamaGuru ||
                "Guru"
            );

    } else {

        elemen.innerHTML =
            "👨‍🎓 " +
            escapeHTML(
                absensiNamaSiswa ||
                "Siswa"
            );

    }

}


// ============================================================
// MODE GURU
// ============================================================

async function jalankanModeGuru() {

    console.log(
        "MODE ABSENSI: GURU"
    );


    // Pastikan tombol tersedia
    pasangTombolSimpan();

    pasangTombolRefresh();

    tampilkanNamaLogin();


    // Guru melihat seluruh siswa
    await ambilDataSiswa();

}


// ============================================================
// MODE SISWA
// ============================================================

async function jalankanModeSiswa() {

    console.log(
        "MODE ABSENSI: SISWA"
    );


    // Siswa TIDAK boleh menyimpan absensi
    const tombolSimpan =
        getElement("btnSimpan");


    if (tombolSimpan) {

        tombolSimpan.style.display =
            "none";

    }


    // Siswa tidak perlu memilih tanggal
    const tanggal =
        getElement("tanggal");


    if (tanggal) {

        tanggal.style.display =
            "none";

    }


    tampilkanNamaLogin();


    // Ambil riwayat siswa
    await tampilkanAbsensiSiswa();

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// INJECT CSS STATUS
// ============================================================

function pasangCSS() {

    if (
        document.getElementById(
            "cssAbsensiFinal"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "cssAbsensiFinal";


    style.innerHTML = `

        .status-hadir {
            color:#16a34a;
        }

        .status-sakit {
            color:#dc2626;
        }

        .status-izin {
            color:#d97706;
        }

        .status-alfa {
            color:#7f1d1d;
        }

        .status-absensi {
            min-width:120px;
            padding:7px 10px;
            border-radius:6px;
            border:1px solid #cbd5e1;
        }

        @media print {

            #btnSimpan,
            #btnRefresh,
            .btn-kembali,
            button,
            input,
            select {
                display:none !important;
            }

            .sidebar {
                display:none !important;
            }

            body {
                margin:10px;
            }

        }

    `;


    document.head.appendChild(style);

}


// ============================================================
// INISIALISASI
// ============================================================

async function mulaiAbsensiFinal() {

    console.log(
        "🚀 ABSENSI FINAL DIMULAI"
    );


    pasangCSS();


    // --------------------------------------------------------
    // CEK ROLE
    // --------------------------------------------------------

    if (
        absensiRole === "guru"
    ) {

        await jalankanModeGuru();

        return;

    }


    if (
        absensiRole === "siswa"
    ) {

        await jalankanModeSiswa();

        return;

    }


    // --------------------------------------------------------
    // ROLE TIDAK DIKENAL
    // --------------------------------------------------------

    console.warn(
        "Role tidak dikenali:",
        absensiRole
    );


    alert(
        "Sesi login tidak dikenali. Silakan login kembali."
    );


    localStorage.clear();

    window.location.href =
        "login.html";

}


// ============================================================
// JALANKAN SETELAH HTML SIAP
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        mulaiAbsensiFinal
    );

} else {

    mulaiAbsensiFinal();

}


// ============================================================
// LOGOUT
// ============================================================

function logout() {

    if (
        confirm(
            "Yakin ingin logout?"
        )
    ) {

        localStorage.clear();

        window.location.href =
            "login.html";

    }

}


// ============================================================
// SELESAI
// ============================================================

console.log(
    "ABSENSI.JS FINAL berhasil dimuat."
);
