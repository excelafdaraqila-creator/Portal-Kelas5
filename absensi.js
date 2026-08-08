// ====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// absensi.js VERSI 2.0
// ====================================================

// ====================================================
// KONFIGURASI API
// ====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ====================================================
// DATA LOGIN
// ====================================================

const roleAbsensi =
    localStorage.getItem("role") || "";

const nisnLoginAbsensi =
    String(
        localStorage.getItem("nisn") || ""
    ).trim();

const namaSiswaAbsensi =
    localStorage.getItem("namaSiswa") || "";

const namaGuruAbsensi =
    localStorage.getItem("namaGuru") || "";


// ====================================================
// DEBUG
// ====================================================

console.log("====================================");
console.log("ABSENSI.JS VERSI 2.0");
console.log("Role :", roleAbsensi);
console.log("NISN :", nisnLoginAbsensi);
console.log("Nama :", namaSiswaAbsensi);
console.log("====================================");


// ====================================================
// ELEMEN HTML
// ====================================================

let tabelAbsensi;
let infoAbsensi;
let tanggalInput;
let btnSimpan;


// ====================================================
// MULAI
// ====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        tabelAbsensi =
            document.getElementById(
                "tabelAbsensi"
            );

        infoAbsensi =
            document.getElementById(
                "infoAbsensi"
            );

        tanggalInput =
            document.getElementById(
                "tanggal"
            );

        btnSimpan =
            document.getElementById(
                "btnSimpan"
            );


        // ============================================
        // CEK LOGIN
        // ============================================

        if (
            localStorage.getItem("login") !==
            "true"
        ) {

            alert(
                "Silakan login terlebih dahulu."
            );

            location.href =
                "login.html";

            return;

        }


        // ============================================
        // JIKA SISWA
        // ============================================

        if (
            roleAbsensi === "siswa"
        ) {

            // Siswa tidak boleh menyimpan
            if (btnSimpan) {

                btnSimpan.style.display =
                    "none";

            }


            // Ambil absensi siswa sendiri
            ambilAbsensiSiswa();

        }


        // ============================================
        // JIKA GURU
        // ============================================

        else if (
            roleAbsensi === "guru"
        ) {

            // Guru boleh menyimpan
            if (btnSimpan) {

                btnSimpan.style.display =
                    "inline-block";

            }


            // Tampilkan form absensi
            ambilDataSiswaGuru();

        }


        // ============================================
        // ROLE TIDAK DIKENAL
        // ============================================

        else {

            alert(
                "Role login tidak dikenali."
            );

            location.href =
                "login.html";

        }

    }
);


// ====================================================
// PESAN
// ====================================================

function tampilPesan(
    pesan,
    warna
) {

    if (!infoAbsensi) return;

    infoAbsensi.innerHTML =
        pesan;

    infoAbsensi.style.color =
        warna || "#2563eb";

}


// ====================================================
// LOADING
// ====================================================

function tampilLoading(
    pesan
) {

    if (!tabelAbsensi) return;

    tabelAbsensi.innerHTML = `
        <tr>
            <td
                colspan="4"
                style="
                    padding:30px;
                    text-align:center;
                    font-weight:bold;
                    color:#2563eb;
                "
            >
                ⏳ ${pesan}
            </td>
        </tr>
    `;

}


// ====================================================
// AMBIL DATA SISWA UNTUK GURU
// ====================================================

async function ambilDataSiswaGuru() {

    try {

        tampilLoading(
            "Sedang memuat data siswa..."
        );

        tampilPesan(
            "🔄 Mengambil data siswa..."
        );


        const response =
            await fetch(
                API_URL +
                "?action=siswa&nocache=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "DATA SISWA:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Data siswa bukan Array."
            );

        }


        if (data.length === 0) {

            throw new Error(
                "Data siswa kosong."
            );

        }


        tampilkanFormGuru(
            data
        );


        tampilPesan(
            "✅ Data siswa berhasil dimuat: " +
            data.length +
            " siswa.",
            "#16a34a"
        );


        hitungStatistik();

    }

    catch (error) {

        console.error(
            "ERROR DATA SISWA:",
            error
        );


        tampilPesan(
            "❌ " +
            error.message,
            "#dc2626"
        );


        if (tabelAbsensi) {

            tabelAbsensi.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        style="
                            padding:30px;
                            text-align:center;
                            color:red;
                        "
                    >
                        ❌ Gagal mengambil data siswa
                        <br><br>
                        ${error.message}
                    </td>
                </tr>
            `;

        }

    }

}


// ====================================================
// TAMPILKAN FORM GURU
// ====================================================

function tampilkanFormGuru(
    data
) {

    if (!tabelAbsensi) return;


    tabelAbsensi.innerHTML =
        "";


    data.forEach(
        function (siswa, index) {

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


            if (
                !nisn &&
                !nama
            ) {

                return;

            }


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td
                    style="
                        text-align:center;
                        padding:10px;
                    "
                >
                    ${index + 1}
                </td>

                <td
                    style="
                        padding:10px;
                        font-weight:bold;
                    "
                >
                    ${nama}
                </td>

                <td
                    style="
                        padding:10px;
                    "
                >
                    ${nisn}
                </td>

                <td
                    style="
                        padding:10px;
                    "
                >

                    <select
                        class="status-absensi"
                        data-nisn="${nisn}"
                        data-nama="${nama}"
                        style="
                            padding:8px;
                            border-radius:6px;
                        "
                    >

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


            tabelAbsensi.appendChild(
                tr
            );

        }
    );

}


// ====================================================
// AMBIL ABSENSI SISWA SENDIRI
// ====================================================

async function ambilAbsensiSiswa() {

    try {

        if (
            !nisnLoginAbsensi
        ) {

            throw new Error(
                "NISN login tidak ditemukan."
            );

        }


        tampilLoading(
            "Sedang memuat absensi Anda..."
        );


        tampilPesan(
            "🔄 Mengambil riwayat absensi..."
        );


        const url =
            API_URL +
            "?action=absensi" +
            "&nisn=" +
            encodeURIComponent(
                nisnLoginAbsensi
            ) +
            "&nocache=" +
            Date.now();


        console.log(
            "URL ABSENSI SISWA:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "ABSENSI SISWA:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Data absensi bukan Array."
            );

        }


        tampilkanAbsensiSiswa(
            data
        );


    }

    catch (error) {

        console.error(
            "ERROR ABSENSI SISWA:",
            error
        );


        tampilPesan(
            "❌ " +
            error.message,
            "#dc2626"
        );


        if (tabelAbsensi) {

            tabelAbsensi.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        style="
                            padding:30px;
                            text-align:center;
                            color:red;
                        "
                    >
                        ❌ Gagal memuat absensi
                        <br><br>
                        ${error.message}
                    </td>
                </tr>
            `;

        }

    }

}


// ====================================================
// TAMPILKAN ABSENSI SISWA
// ====================================================

function tampilkanAbsensiSiswa(
    data
) {

    if (!tabelAbsensi) return;


    tabelAbsensi.innerHTML =
        "";


    // ============================================
    // JIKA BELUM ADA ABSENSI
    // ============================================

    if (data.length === 0) {

        tabelAbsensi.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    style="
                        padding:30px;
                        text-align:center;
                        color:#2563eb;
                        font-weight:bold;
                    "
                >
                    📭 Belum ada data absensi.
                </td>
            </tr>
        `;


        tampilPesan(
            "📭 Belum ada riwayat absensi untuk " +
            namaSiswaAbsensi + ".",
            "#2563eb"
        );


        return;

    }


    // ============================================
    // TAMPILKAN DATA
    // ============================================

    data.forEach(
        function (item, index) {

            const tanggal =
                item.TANGGAL ||
                item.tanggal ||
                "-";


            const nama =
                item.NAMA ||
                item.nama ||
                namaSiswaAbsensi;


            const nisn =
                item.NISN ||
                item.nisn ||
                nisnLoginAbsensi;


            const status =
                item.STATUS ||
                item.status ||
                "-";


            let teksStatus =
                status;


            if (status === "H") {

                teksStatus =
                    "🟢 H - Hadir";

            }

            else if (status === "S") {

                teksStatus =
                    "🟡 S - Sakit";

            }

            else if (status === "I") {

                teksStatus =
                    "🔵 I - Izin";

            }

            else if (status === "A") {

                teksStatus =
                    "🔴 A - Alfa";

            }


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td
                    style="
                        text-align:center;
                        padding:10px;
                    "
                >
                    ${index + 1}
                </td>

                <td
                    style="
                        padding:10px;
                    "
                >
                    ${tanggal}
                </td>

                <td
                    style="
                        padding:10px;
                    "
                >
                    ${nama}
                </td>

                <td
                    style="
                        padding:10px;
                        font-weight:bold;
                    "
                >
                    ${teksStatus}
                </td>

            `;


            tabelAbsensi.appendChild(
                tr
            );

        }
    );


    tampilPesan(
        "✅ Menampilkan " +
        data.length +
        " data absensi untuk " +
        namaSiswaAbsensi + ".",
        "#16a34a"
    );


    hitungStatistikSiswa(
        data
    );

}


// ====================================================
// STATISTIK GURU
// ====================================================

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
        function (select) {

            if (
                select.value === "H"
            ) hadir++;


            if (
                select.value === "S"
            ) sakit++;


            if (
                select.value === "I"
            ) izin++;


            if (
                select.value === "A"
            ) alfa++;

        }
    );


    tampilStatistik(
        hadir,
        sakit,
        izin,
        alfa
    );

}


// ====================================================
// STATISTIK SISWA
// ====================================================

function hitungStatistikSiswa(
    data
) {

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;


    data.forEach(
        function (item) {

            const status =
                String(
                    item.STATUS ||
                    item.status ||
                    ""
                ).trim().toUpperCase();


            if (status === "H")
                hadir++;


            if (status === "S")
                sakit++;


            if (status === "I")
                izin++;


            if (status === "A")
                alfa++;

        }
    );


    tampilStatistik(
        hadir,
        sakit,
        izin,
        alfa
    );

}


// ====================================================
// TAMPILKAN STATISTIK
// ====================================================

function tampilStatistik(
    hadir,
    sakit,
    izin,
    alfa
) {

    const h =
        document.getElementById(
            "jmlHadir"
        );

    const s =
        document.getElementById(
            "jmlSakit"
        );

    const i =
        document.getElementById(
            "jmlIzin"
        );

    const a =
        document.getElementById(
            "jmlAlfa"
        );


    if (h)
        h.innerText = hadir;


    if (s)
        s.innerText = sakit;


    if (i)
        i.innerText = izin;


    if (a)
        a.innerText = alfa;

}


// ====================================================
// PERUBAHAN STATUS GURU
// ====================================================

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


// ====================================================
// SIMPAN ABSENSI - GURU
// ====================================================

async function simpanAbsensi() {

    if (
        roleAbsensi !== "guru"
    ) {

        alert(
            "❌ Hanya guru yang dapat menyimpan absensi."
        );

        return;

    }


    const tanggalElement =
        document.getElementById(
            "tanggal"
        );


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
            "⚠️ Silakan pilih tanggal terlebih dahulu."
        );

        return;

    }


    const siswa =
        document.querySelectorAll(
            ".status-absensi"
        );


    if (
        siswa.length === 0
    ) {

        alert(
            "❌ Data siswa belum tersedia."
        );

        return;

    }


    const konfirmasi =
        confirm(
            "Simpan absensi untuk " +
            siswa.length +
            " siswa pada tanggal " +
            tanggal +
            "?"
        );


    if (!konfirmasi) {

        return;

    }


    const data = [];


    siswa.forEach(
        function (select) {

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


    if (btnSimpan) {

        btnSimpan.disabled =
            true;

        btnSimpan.innerHTML =
            "⏳ Menyimpan...";

    }


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

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
            "RESPONSE SIMPAN:",
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
            "✅ Absensi berhasil disimpan!\n\n" +
            "Tanggal: " +
            tanggal +
            "\nJumlah siswa: " +
            data.length
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

            btnSimpan.disabled =
                false;

            btnSimpan.innerHTML =
                "💾 Simpan Absensi";

        }

    }

}


// ====================================================
// HUBUNGKAN TOMBOL SIMPAN
// ====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const tombol =
            document.getElementById(
                "btnSimpan"
            );


        if (tombol) {

            tombol.onclick =
                function (event) {

                    event.preventDefault();

                    simpanAbsensi();

                };

        }

    }
);


// ====================================================
// SELESAI
// ====================================================

console.log(
    "✅ ABSENSI.JS VERSI 2.0 AKTIF"
);
