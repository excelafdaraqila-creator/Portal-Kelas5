// ============================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ABSENSI.JS FINAL
// MODE GURU + MODE SISWA
// ============================================================


// ============================================================
// KONFIGURASI API
// ============================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// DATA LOGIN
// ============================================================

const absensiRole =
    String(localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

const absensiNisn =
    String(localStorage.getItem("nisn") || "")
    .trim();

const absensiNamaSiswa =
    String(localStorage.getItem("namaSiswa") || "")
    .trim();

const absensiNamaGuru =
    String(localStorage.getItem("namaGuru") || "")
    .trim();


// ============================================================
// DEBUG
// ============================================================

console.log("========================================");
console.log("ABSENSI.JS FINAL");
console.log("Role :", absensiRole);
console.log("NISN :", absensiNisn);
console.log("Nama Siswa :", absensiNamaSiswa);
console.log("========================================");


// ============================================================
// CEK LOGIN
// ============================================================

if (
    localStorage.getItem("login") !== "true"
) {

    alert("Silakan login terlebih dahulu.");

    location.href = "login.html";

}


// ============================================================
// VARIABEL
// ============================================================

let dataSiswaAbsensi = [];

let dataAbsensiSemua = [];

let sedangMenyimpanAbsensi = false;


// ============================================================
// ELEMENT HTML
// ============================================================

function ambilElement(id) {

    return document.getElementById(id);

}


// ============================================================
// TANGGAL HARI INI
// ============================================================

function tanggalHariIni() {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(2, "0");

    return (
        tahun +
        "-" +
        bulan +
        "-" +
        tanggal
    );

}


// ============================================================
// CARI INPUT TANGGAL
// ============================================================

function ambilTanggal() {

    const input =
        ambilElement("tanggal");

    if (input && input.value) {

        return input.value;

    }

    return tanggalHariIni();

}


// ============================================================
// LOAD DATA
// ============================================================

async function jalankanAbsensi() {

    console.log("🚀 Jalankan absensi");

    if (
        absensiRole === "guru"
    ) {

        await tampilkanAbsensiGuru();

    }

    else {

        await tampilkanAbsensiSiswa();

    }

}


// ============================================================
// MODE GURU
// ============================================================

async function tampilkanAbsensiGuru() {

    const tabel =
        ambilElement("tabelAbsensi");

    const info =
        ambilElement("infoAbsensi");


    if (info) {

        info.innerHTML =
            "⏳ Memuat data siswa...";

    }


    if (tabel) {

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    text-align:center;
                    padding:30px;
                    ">
                    ⏳ Memuat data siswa...
                </td>
            </tr>
        `;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "?action=siswa&nocache=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Server error " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "DATA SISWA:",
            data
        );


        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "Data siswa bukan Array."
            );

        }


        dataSiswaAbsensi =
            data;


        if (
            dataSiswaAbsensi.length === 0
        ) {

            throw new Error(
                "Data siswa kosong."
            );

        }


        renderTabelGuru(
            dataSiswaAbsensi
        );


        if (info) {

            info.innerHTML =
                "✅ " +
                dataSiswaAbsensi.length +
                " siswa berhasil dimuat.";

        }


        hitungStatistik();

    }

    catch (error) {

        console.error(
            "ERROR DATA SISWA:",
            error
        );


        if (info) {

            info.innerHTML =
                "❌ " +
                error.message;

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
// TABEL GURU
// ============================================================

function renderTabelGuru(data) {

    const tabel =
        ambilElement("tabelAbsensi");


    if (!tabel) {

        console.error(
            "Element tabelAbsensi tidak ditemukan."
        );

        return;

    }


    tabel.innerHTML = "";


    data.forEach(
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
                    <b>${nama}</b>
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

        }
    );


    // Event perubahan status

    document
        .querySelectorAll(
            ".status-absensi"
        )
        .forEach(
            function(select) {

                select.addEventListener(
                    "change",
                    hitungStatistik
                );

            }
        );

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


    semua.forEach(
        function(select) {

            if (
                select.value === "H"
            ) {
                hadir++;
            }

            else if (
                select.value === "S"
            ) {
                sakit++;
            }

            else if (
                select.value === "I"
            ) {
                izin++;
            }

            else if (
                select.value === "A"
            ) {
                alfa++;
            }

        }
    );


    const jmlHadir =
        ambilElement("jmlHadir");

    const jmlSakit =
        ambilElement("jmlSakit");

    const jmlIzin =
        ambilElement("jmlIzin");

    const jmlAlfa =
        ambilElement("jmlAlfa");


    if (jmlHadir) {

        jmlHadir.innerText =
            hadir;

    }


    if (jmlSakit) {

        jmlSakit.innerText =
            sakit;

    }


    if (jmlIzin) {

        jmlIzin.innerText =
            izin;

    }


    if (jmlAlfa) {

        jmlAlfa.innerText =
            alfa;

    }

}


// ============================================================
// SIMPAN ABSENSI GURU
// ============================================================

async function simpanAbsensiGuru() {

    if (
        sedangMenyimpanAbsensi
    ) {

        return;

    }


    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );


    if (
        semua.length === 0
    ) {

        alert(
            "❌ Data siswa belum tersedia."
        );

        return;

    }


    const tanggal =
        ambilTanggal();


    if (!tanggal) {

        alert(
            "⚠️ Tanggal belum dipilih."
        );

        return;

    }


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


    const data = [];


    semua.forEach(
        function(select) {

            data.push({

                tanggal:
                    tanggal,

                nisn:
                    select.dataset.nisn || "",

                nama:
                    select.dataset.nama || "",

                status:
                    select.value || "H"

            });

        }
    );


    console.log(
        "DATA ABSENSI YANG DIKIRIM:",
        data
    );


    const tombol =
        ambilElement("btnSimpan");


    sedangMenyimpanAbsensi =
        true;


    if (tombol) {

        tombol.disabled = true;

        tombol.innerHTML =
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
            "RESPONSE SERVER:",
            text
        );


        let hasil;


        try {

            hasil =
                JSON.parse(text);

        }

        catch (error) {

            throw new Error(
                "Response server bukan JSON."
            );

        }


        if (
            hasil.status !== true
        ) {

            throw new Error(
                hasil.pesan ||
                "Gagal menyimpan absensi."
            );

        }


        alert(
            "✅ Absensi berhasil disimpan.\n\n" +
            "Tanggal: " +
            tanggal +
            "\nJumlah siswa: " +
            hasil.jumlah
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

        sedangMenyimpanAbsensi =
            false;


        if (tombol) {

            tombol.disabled = false;

            tombol.innerHTML =
                "💾 Simpan Absensi";

        }

    }

}


// ============================================================
// MODE SISWA
// ============================================================

async function tampilkanAbsensiSiswa() {

    const tabel =
        ambilElement("tabelAbsensi");

    const info =
        ambilElement("infoAbsensi");


    if (info) {

        info.innerHTML =
            "⏳ Memuat data kehadiran Anda...";

    }


    if (tabel) {

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    text-align:center;
                    padding:30px;
                    ">
                    ⏳ Memuat data kehadiran...
                </td>
            </tr>
        `;

    }


    // --------------------------------------------------------
    // CEK NISN
    // --------------------------------------------------------

    if (!absensiNisn) {

        if (info) {

            info.innerHTML =
                "❌ NISN siswa tidak ditemukan.";

        }

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "?action=absensi&nisn=" +
                encodeURIComponent(
                    absensiNisn
                ) +
                "&nocache=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Server error " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "DATA ABSENSI:",
            data
        );


        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "Data absensi bukan Array."
            );

        }


        dataAbsensiSemua =
            data;


        // ----------------------------------------------------
        // FILTER NISN SISWA
        // ----------------------------------------------------

        const milikSaya =
            data.filter(
                function(item) {

                    return String(
                        item.nisn ||
                        item.NISN ||
                        ""
                    ).trim()
                    ===
                    absensiNisn;

                }
            );


        console.log(
            "ABSENSI SAYA:",
            milikSaya
        );


        renderAbsensiSiswa(
            milikSaya
        );


    }

    catch (error) {

        console.error(
            "ERROR ABSENSI SISWA:",
            error
        );


        if (info) {

            info.innerHTML =
                "❌ Gagal mengambil data kehadiran.";

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
                        ❌ Gagal mengambil data kehadiran
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

function renderAbsensiSiswa(data) {

    const tabel =
        ambilElement("tabelAbsensi");

    const info =
        ambilElement("infoAbsensi");


    // --------------------------------------------------------
    // JIKA BELUM ADA DATA
    // --------------------------------------------------------

    if (
        data.length === 0
    ) {

        if (info) {

            info.innerHTML =
                "ℹ️ Belum ada data kehadiran untuk " +
                (
                    absensiNamaSiswa ||
                    "siswa ini"
                ) +
                ".";

        }


        if (tabel) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        text-align:center;
                        padding:30px;
                        color:#2563eb;
                        ">
                        📭 Belum ada data kehadiran.
                    </td>
                </tr>
            `;

        }


        updateRekapSiswa([]);

        return;

    }


    // --------------------------------------------------------
    // URUTKAN DARI TERBARU
    // --------------------------------------------------------

    data.sort(
        function(a, b) {

            return String(
                b.tanggal || ""
            ).localeCompare(
                String(
                    a.tanggal || ""
                )
            );

        }
    );


    if (tabel) {

        tabel.innerHTML = "";

    }


    data.forEach(
        function(item, index) {

            const tanggal =
                item.tanggal || "-";

            const nama =
                item.nama || 
                absensiNamaSiswa ||
                "-";

            const status =
                String(
                    item.status || ""
                ).toUpperCase();


            let keterangan =
                "Hadir";

            if (status === "S") {

                keterangan =
                    "Sakit";

            }

            else if (status === "I") {

                keterangan =
                    "Izin";

            }

            else if (status === "A") {

                keterangan =
                    "Alfa";

            }


            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td style="text-align:center;">
                    ${index + 1}
                </td>

                <td>
                    ${nama}
                </td>

                <td>
                    ${formatTanggal(
                        tanggal
                    )}
                </td>

                <td style="text-align:center;">
                    <b>
                        ${status}
                    </b>
                    -
                    ${keterangan}
                </td>

            `;


            if (tabel) {

                tabel.appendChild(tr);

            }

        }
    );


    if (info) {

        info.innerHTML =
            "✅ Riwayat kehadiran " +
            (
                absensiNamaSiswa ||
                "Anda"
            ) +
            ": " +
            data.length +
            " catatan.";

    }


    updateRekapSiswa(data);

}


// ============================================================
// REKAP ABSENSI SISWA
// ============================================================

function updateRekapSiswa(data) {

    let hadir = 0;

    let sakit = 0;

    let izin = 0;

    let alfa = 0;


    data.forEach(
        function(item) {

            const status =
                String(
                    item.status || ""
                ).toUpperCase();


            if (status === "H") {

                hadir++;

            }

            else if (status === "S") {

                sakit++;

            }

            else if (status === "I") {

                izin++;

            }

            else if (status === "A") {

                alfa++;

            }

        }
    );


    const jmlHadir =
        ambilElement("jmlHadir");

    const jmlSakit =
        ambilElement("jmlSakit");

    const jmlIzin =
        ambilElement("jmlIzin");

    const jmlAlfa =
        ambilElement("jmlAlfa");


    if (jmlHadir) {

        jmlHadir.innerText =
            hadir;

    }


    if (jmlSakit) {

        jmlSakit.innerText =
            sakit;

    }


    if (jmlIzin) {

        jmlIzin.innerText =
            izin;

    }


    if (jmlAlfa) {

        jmlAlfa.innerText =
            alfa;

    }

}


// ============================================================
// FORMAT TANGGAL
// ============================================================

function formatTanggal(tanggal) {

    if (!tanggal) {

        return "-";

    }


    const bagian =
        String(tanggal)
        .split("-");


    if (
        bagian.length === 3
    ) {

        return (
            bagian[2] +
            "-" +
            bagian[1] +
            "-" +
            bagian[0]
        );

    }


    return tanggal;

}


// ============================================================
// SETUP TOMBOL
// ============================================================

function setupTombol() {

    const tombolSimpan =
        ambilElement("btnSimpan");


    // --------------------------------------------------------
    // SISWA TIDAK BOLEH SIMPAN
    // --------------------------------------------------------

    if (
        absensiRole !== "guru"
    ) {

        if (tombolSimpan) {

            tombolSimpan.style.display =
                "none";

        }

        return;

    }


    // --------------------------------------------------------
    // GURU
    // --------------------------------------------------------

    if (tombolSimpan) {

        tombolSimpan.onclick =
            function(event) {

                event.preventDefault();

                simpanAbsensiGuru();

            };

    }

}


// ============================================================
// NAMA LOGIN
// ============================================================

function tampilkanNamaLogin() {

    const namaLogin =
        ambilElement("namaLogin");


    if (!namaLogin) {

        return;

    }


    if (
        absensiRole === "guru"
    ) {

        namaLogin.innerHTML =
            "👨‍🏫 " +
            absensiNamaGuru;

    }

    else {

        namaLogin.innerHTML =
            "👨‍🎓 " +
            (
                absensiNamaSiswa ||
                "Siswa"
            );

    }

}


// ============================================================
// REFRESH
// ============================================================

function setupRefresh() {

    const btnRefresh =
        ambilElement("btnRefresh");


    if (btnRefresh) {

        btnRefresh.onclick =
            function() {

                location.reload();

            };

    }

}


// ============================================================
// TOMBOL KEMBALI
// ============================================================

function setupKembali() {

    const tombol =
        document.querySelector(
            ".btn-kembali"
        );


    if (!tombol) {

        return;

    }


    tombol.onclick =
        function() {

            if (
                absensiRole === "guru"
            ) {

                location.href =
                    "index.html";

            }

            else {

                location.href =
                    "dashboard-siswa.html";

            }

        };

}


// ============================================================
// SET TANGGAL DEFAULT UNTUK GURU
// ============================================================

function setTanggalDefault() {

    if (
        absensiRole !== "guru"
    ) {

        return;

    }


    const input =
        ambilElement("tanggal");


    if (
        input &&
        !input.value
    ) {

        input.value =
            tanggalHariIni();

    }

}


// ============================================================
// MULAI
// ============================================================

function mulaiAbsensi() {

    console.log(
        "=== ABSENSI DIMULAI ==="
    );


    tampilkanNamaLogin();

    setupTombol();

    setupRefresh();

    setupKembali();

    setTanggalDefault();

    jalankanAbsensi();

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

}

else {

    mulaiAbsensi();

}
