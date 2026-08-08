// ============================================================
// ABSENSI.JS FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ============================================================

// ============================================================
// KONFIGURASI API
// ============================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// DATA LOGIN
// ============================================================

const ABS_ROLE =
    String(localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

const ABS_NISN =
    String(localStorage.getItem("nisn") || "")
    .trim();

const ABS_NAMA_SISWA =
    String(localStorage.getItem("namaSiswa") || "")
    .trim();

const ABS_NAMA_GURU =
    String(localStorage.getItem("namaGuru") || "")
    .trim();


// ============================================================
// VARIABEL
// ============================================================

let ABS_DATA_SISWA = [];

let ABS_SEDANG_MENYIMPAN = false;


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
// MULAI
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "======================================"
        );

        console.log(
            "ABSENSI.JS FINAL"
        );

        console.log(
            "Role:",
            ABS_ROLE
        );

        console.log(
            "NISN:",
            ABS_NISN
        );

        console.log(
            "Nama siswa:",
            ABS_NAMA_SISWA
        );

        console.log(
            "======================================"
        );


        // --------------------------------------------
        // GURU
        // --------------------------------------------

        if (
            ABS_ROLE === "guru"
        ) {

            jalankanModeGuru();

        }


        // --------------------------------------------
        // SISWA
        // --------------------------------------------

        else {

            jalankanModeSiswa();

        }

    }
);


// ============================================================
// MODE GURU
// ============================================================

function jalankanModeGuru() {

    console.log(
        "👨‍🏫 MODE GURU"
    );


    tampilkanIdentitas();


    // Tanggal otomatis hari ini

    const tanggal =
        document.getElementById("tanggal");

    if (tanggal && !tanggal.value) {

        tanggal.value =
            tanggalHariIni();

    }


    // Tombol simpan

    const tombol =
        document.getElementById("btnSimpan");

    if (tombol) {

        tombol.style.display =
            "inline-block";


        tombol.onclick =
            function (event) {

                event.preventDefault();

                simpanAbsensiGuru();

            };

    }


    // Guru melihat semua siswa

    ambilDataSiswaUntukGuru();

}


// ============================================================
// MODE SISWA
// ============================================================

function jalankanModeSiswa() {

    console.log(
        "👨‍🎓 MODE SISWA"
    );


    tampilkanIdentitas();


    // --------------------------------------------
    // Sembunyikan tombol simpan
    // --------------------------------------------

    const tombol =
        document.getElementById("btnSimpan");

    if (tombol) {

        tombol.style.display =
            "none";

    }


    // --------------------------------------------
    // Sembunyikan tanggal input guru
    // --------------------------------------------

    const tanggal =
        document.getElementById("tanggal");

    if (tanggal) {

        tanggal.style.display =
            "none";

    }


    // --------------------------------------------
    // Siswa tidak mengambil semua siswa
    // --------------------------------------------

    tampilkanLoadingSiswa();


    // Ambil data absensi
    // kemudian filter berdasarkan NISN login

    ambilAbsensiSiswa();

}


// ============================================================
// IDENTITAS LOGIN
// ============================================================

function tampilkanIdentitas() {

    const namaLogin =
        document.getElementById("namaLogin");


    if (!namaLogin) {

        return;

    }


    if (
        ABS_ROLE === "guru"
    ) {

        namaLogin.innerHTML =
            "👨‍🏫 " +
            (ABS_NAMA_GURU || "Guru");

    }

    else {

        namaLogin.innerHTML =
            "👨‍🎓 " +
            (ABS_NAMA_SISWA || "Siswa");

    }

}


// ============================================================
// TANGGAL HARI INI
// ============================================================

function tanggalHariIni() {

    const sekarang =
        new Date();


    const tahun =
        sekarang.getFullYear();


    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        tahun +
        "-" +
        bulan +
        "-" +
        tanggal
    );

}


// ============================================================
// LOADING
// ============================================================

function tampilkanLoadingSiswa() {

    const tabel =
        document.getElementById(
            "tabelAbsensi"
        );


    if (!tabel) {

        return;

    }


    tabel.innerHTML = `

        <tr>

            <td
                colspan="4"
                style="
                    text-align:center;
                    padding:30px;
                    font-weight:bold;
                    color:#2563eb;
                "
            >

                ⏳ Memuat data absensi...

            </td>

        </tr>

    `;

}


// ============================================================
// AMBIL DATA SISWA UNTUK GURU
// ============================================================

async function ambilDataSiswaUntukGuru() {

    const tabel =
        document.getElementById(
            "tabelAbsensi"
        );


    if (!tabel) {

        console.error(
            "tabelAbsensi tidak ditemukan."
        );

        return;

    }


    tabel.innerHTML = `

        <tr>

            <td
                colspan="4"
                style="
                    text-align:center;
                    padding:30px;
                    color:#2563eb;
                    font-weight:bold;
                "
            >

                ⏳ Memuat data siswa...

            </td>

        </tr>

    `;


    try {

        const url =
            API_URL +
            "?action=siswa&nocache=" +
            Date.now();


        console.log(
            "Mengambil siswa:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Data siswa:",
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


        ABS_DATA_SISWA =
            data;


        renderAbsensiGuru(
            data
        );


        updateInfo(
            "Jumlah siswa: " +
            data.length
        );


    }

    catch (error) {

        console.error(
            "Gagal mengambil siswa:",
            error
        );


        tabel.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:30px;
                        color:red;
                        font-weight:bold;
                    "
                >

                    ❌ Gagal memuat data siswa

                    <br><br>

                    ${escapeHTML(
                        error.message
                    )}

                </td>

            </tr>

        `;

    }

}


// ============================================================
// TAMPILKAN ABSENSI GURU
// ============================================================

function renderAbsensiGuru(data) {

    const tabel =
        document.getElementById(
            "tabelAbsensi"
        );


    if (!tabel) {

        return;

    }


    tabel.innerHTML = "";


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

                    ${escapeHTML(nama)}

                </td>


                <td
                    style="
                        padding:10px;
                    "
                >

                    ${escapeHTML(nisn)}

                </td>


                <td
                    style="
                        padding:10px;
                    "
                >

                    <select
                        class="status-absensi"
                        data-nisn="${escapeHTML(nisn)}"
                        data-nama="${escapeHTML(nama)}"
                        style="
                            padding:8px;
                            border-radius:6px;
                            width:100%;
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


            tabel.appendChild(
                tr
            );

        }
    );


    hitungStatistik();

}


// ============================================================
// SIMPAN ABSENSI GURU
// ============================================================

async function simpanAbsensiGuru() {

    console.log(
        "🟢 SIMPAN ABSENSI GURU"
    );


    if (
        ABS_SEDANG_MENYIMPAN
    ) {

        return;

    }


    // --------------------------------------------
    // Ambil tanggal
    // --------------------------------------------

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
        String(
            tanggalElement.value ||
            ""
        ).trim();


    if (!tanggal) {

        alert(
            "⚠️ Silakan pilih tanggal."
        );

        return;

    }


    // --------------------------------------------
    // Ambil semua pilihan status
    // --------------------------------------------

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


    // --------------------------------------------
    // BENTUK DATA
    // --------------------------------------------

    const data = [];


    semua.forEach(
        function (select) {

            const status =
                String(
                    select.value ||
                    "H"
                ).trim().toUpperCase();


            const nisn =
                String(
                    select.dataset.nisn ||
                    ""
                ).trim();


            const nama =
                String(
                    select.dataset.nama ||
                    ""
                ).trim();


            data.push({

                tanggal:
                    tanggal,

                nisn:
                    nisn,

                nama:
                    nama,

                status:
                    status

            });

        }
    );


    // --------------------------------------------
    // TAMPILKAN DATA YANG AKAN DIKIRIM
    // --------------------------------------------

    console.log(
        "DATA ABSENSI YANG DIKIRIM:"
    );

    console.table(
        data
    );


    // --------------------------------------------
    // HITUNG STATUS
    // --------------------------------------------

    const jumlahSakit =
        data.filter(
            function (x) {
                return x.status === "S";
            }
        ).length;


    const jumlahIzin =
        data.filter(
            function (x) {
                return x.status === "I";
            }
        ).length;


    const jumlahAlfa =
        data.filter(
            function (x) {
                return x.status === "A";
            }
        ).length;


    const jumlahHadir =
        data.filter(
            function (x) {
                return x.status === "H";
            }
        ).length;


    const yakin =
        confirm(

            "Simpan absensi tanggal " +
            tanggal +
            "?\n\n" +

            "Hadir : " +
            jumlahHadir +
            "\n" +

            "Sakit : " +
            jumlahSakit +
            "\n" +

            "Izin : " +
            jumlahIzin +
            "\n" +

            "Alfa : " +
            jumlahAlfa

        );


    if (!yakin) {

        return;

    }


    // --------------------------------------------
    // LOCK TOMBOL
    // --------------------------------------------

    ABS_SEDANG_MENYIMPAN =
        true;


    const tombol =
        document.getElementById(
            "btnSimpan"
        );


    const teksAwal =
        tombol
            ? tombol.innerHTML
            : "";


    if (tombol) {

        tombol.disabled =
            true;

        tombol.innerHTML =
            "⏳ Menyimpan...";

    }


    // --------------------------------------------
    // KIRIM KE APPS SCRIPT
    // --------------------------------------------

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


        console.log(
            "STATUS RESPONSE:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "RESPONSE APPS SCRIPT:",
            text
        );


        let hasil;


        try {

            hasil =
                JSON.parse(
                    text
                );

        }

        catch (error) {

            throw new Error(
                "Response Apps Script bukan JSON."
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

            "✅ ABSENSI BERHASIL DISIMPAN\n\n" +

            "Tanggal: " +
            tanggal +
            "\n" +

            "Hadir: " +
            jumlahHadir +
            "\n" +

            "Sakit: " +
            jumlahSakit +
            "\n" +

            "Izin: " +
            jumlahIzin +
            "\n" +

            "Alfa: " +
            jumlahAlfa

        );


        console.log(
            "✅ ABSENSI BERHASIL DISIMPAN"
        );


    }

    catch (error) {

        console.error(
            "❌ ERROR SIMPAN:",
            error
        );


        alert(

            "❌ Gagal menyimpan absensi.\n\n" +
            error.message

        );

    }

    finally {

        ABS_SEDANG_MENYIMPAN =
            false;


        if (tombol) {

            tombol.disabled =
                false;

            tombol.innerHTML =
                teksAwal ||
                "💾 Simpan Absensi";

        }

    }

}


// ============================================================
// AMBIL ABSENSI SISWA
// ============================================================

async function ambilAbsensiSiswa() {

    console.log(
        "Mengambil data absensi siswa:"
    );

    console.log(
        "NISN:",
        ABS_NISN
    );


    if (!ABS_NISN) {

        tampilkanPesanSiswa(
            "❌ NISN siswa tidak ditemukan pada login."
        );

        return;

    }


    try {

        const response =
            await fetch(

                API_URL +
                "?action=cekAbsensi&nocache=" +
                Date.now()

            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );

        }


        const resultado =
            await response.json();


        console.log(
            "ABSENSI DATABASE:",
            resultado
        );


        if (
            !resultado ||
            resultado.status !== true
        ) {

            throw new Error(
                resultado.pesan ||
                "Data absensi gagal diambil."
            );

        }


        const semuaData =
            resultado.data || [];


        // --------------------------------------------
        // FILTER NISN SISWA YANG LOGIN
        // --------------------------------------------

        const dataSaya =
            semuaData
                .slice(1)
                .filter(
                    function (row) {

                        const nisn =
                            String(
                                row[1] ||
                                ""
                            ).trim();


                        return (
                            nisn ===
                            ABS_NISN
                        );

                    }
                );


        console.log(
            "ABSENSI SAYA:",
            dataSaya
        );


        renderAbsensiSiswa(
            dataSaya
        );


    }

    catch (error) {

        console.error(
            "ERROR ABSENSI SISWA:",
            error
        );


        tampilkanPesanSiswa(

            "❌ Gagal mengambil data absensi.<br><br>" +
            escapeHTML(
                error.message
            )

        );

    }

}


// ============================================================
// TAMPILKAN ABSENSI SISWA
// ============================================================

function renderAbsensiSiswa(
    data
) {

    const tabel =
        document.getElementById(
            "tabelAbsensi"
        );


    if (!tabel) {

        return;

    }


    tabel.innerHTML = "";


    if (
        data.length === 0
    ) {

        tabel.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    📭 Belum ada data absensi Anda.

                </td>

            </tr>

        `;


        updateInfo(
            "Belum ada data kehadiran."
        );


        return;

    }


    // --------------------------------------------
    // HITUNG REKAP
    // --------------------------------------------

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;


    data.forEach(
        function (row) {

            const status =
                String(
                    row[3] ||
                    ""
                ).trim().toUpperCase();


            if (
                status === "H"
            ) {

                hadir++;

            }

            else if (
                status === "S"
            ) {

                sakit++;

            }

            else if (
                status === "I"
            ) {

                izin++;

            }

            else if (
                status === "A"
            ) {

                alfa++;

            }

        }
    );


    // --------------------------------------------
    // TAMPILKAN DATA
    // --------------------------------------------

    data.forEach(
        function (row) {

            const tanggal =
                row[0] || "";


            const nama =
                row[2] || "";


            const status =
                String(
                    row[3] ||
                    ""
                ).trim().toUpperCase();


            let tulisan =
                "Hadir";


            if (
                status === "S"
            ) {

                tulisan =
                    "Sakit";

            }

            else if (
                status === "I"
            ) {

                tulisan =
                    "Izin";

            }

            else if (
                status === "A"
            ) {

                tulisan =
                    "Alfa";

            }


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td
                    style="
                        padding:10px;
                    "
                >

                    ${escapeHTML(
                        String(tanggal)
                    )}

                </td>


                <td
                    style="
                        padding:10px;
                        font-weight:bold;
                    "
                >

                    ${escapeHTML(
                        String(nama)
                    )}

                </td>


                <td
                    style="
                        text-align:center;
                        padding:10px;
                    "
                >

                    ${status}

                </td>


                <td
                    style="
                        padding:10px;
                    "
                >

                    ${tulisan}

                </td>

            `;


            tabel.appendChild(
                tr
            );

        }
    );


    updateInfo(

        "Hadir: " +
        hadir +
        " | " +

        "Sakit: " +
        sakit +
        " | " +

        "Izin: " +
        izin +
        " | " +

        "Alfa: " +
        alfa

    );

}


// ============================================================
// PESAN SISWA
// ============================================================

function tampilkanPesanSiswa(
    pesan
) {

    const tabel =
        document.getElementById(
            "tabelAbsensi"
        );


    if (!tabel) {

        return;

    }


    tabel.innerHTML = `

        <tr>

            <td
                colspan="4"
                style="
                    text-align:center;
                    padding:30px;
                "
            >

                ${pesan}

            </td>

        </tr>

    `;

}


// ============================================================
// INFO
// ============================================================

function updateInfo(
    teks
) {

    const info =
        document.getElementById(
            "infoAbsensi"
        );


    if (info) {

        info.innerHTML =
            teks;

    }

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
        function (select) {

            const status =
                select.value;


            if (
                status === "H"
            ) {

                hadir++;

            }

            else if (
                status === "S"
            ) {

                sakit++;

            }

            else if (
                status === "I"
            ) {

                izin++;

            }

            else if (
                status === "A"
            ) {

                alfa++;

            }

        }
    );


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


    if (h) {

        h.innerText =
            hadir;

    }


    if (s) {

        s.innerText =
            sakit;

    }


    if (i) {

        i.innerText =
            izin;

    }


    if (a) {

        a.innerText =
            alfa;

    }

}


// ============================================================
// PERUBAHAN STATUS
// ============================================================

document.addEventListener(
    "change",
    function (event) {

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
// ESCAPE HTML
// ============================================================

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

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
    "✅ absensi.js FINAL berhasil dimuat."
);
