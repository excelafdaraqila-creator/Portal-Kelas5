// ====================================================
// ABSENSI.JS FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ====================================================

const ABSENSI_API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

const ABSENSI_ROLE =
localStorage.getItem("role") || "";

const ABSENSI_NISN =
String(localStorage.getItem("nisn") || "").trim();

const ABSENSI_NAMA =
localStorage.getItem("namaSiswa") || "";

let ABSENSI_SEDANG_MENYIMPAN = false;


// ====================================================
// DEBUG
// ====================================================

console.log("====================================");
console.log("ABSENSI.JS FINAL AKTIF");
console.log("ROLE :", ABSENSI_ROLE);
console.log("NISN :", ABSENSI_NISN);
console.log("NAMA :", ABSENSI_NAMA);
console.log("====================================");


// ====================================================
// AMBIL DATA SISWA
// ====================================================

async function loadDataAbsensi() {

    const tabel =
        document.getElementById("tabelAbsensi");

    const info =
        document.getElementById("infoAbsensi");


    if (!tabel) {

        console.error(
            "❌ #tabelAbsensi tidak ditemukan"
        );

        return;

    }


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


    try {

        const response =
            await fetch(
                ABSENSI_API_URL +
                "?action=siswa&nocache=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server error: HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "DATA SISWA DARI SERVER:",
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


        // ====================================================
        // GURU = SEMUA SISWA
        // SISWA = SISWA SENDIRI
        // ====================================================

        let dataTampil = data;


        if (
            ABSENSI_ROLE === "siswa"
        ) {

            dataTampil =
                data.filter(function(siswa) {

                    return String(
                        siswa.NISN || ""
                    ).trim()
                    ===
                    ABSENSI_NISN;

                });

        }


        // ====================================================
        // SISWA TIDAK DITEMUKAN
        // ====================================================

        if (
            ABSENSI_ROLE === "siswa" &&
            dataTampil.length === 0
        ) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        text-align:center;
                        padding:30px;
                        color:red;
                        ">

                        ❌ Data siswa tidak ditemukan.

                        <br><br>

                        NISN Login:
                        <b>${ABSENSI_NISN}</b>

                    </td>
                </tr>
            `;

            return;

        }


        tabel.innerHTML = "";


        // ====================================================
        // TAMPILKAN DATA
        // ====================================================

        dataTampil.forEach(function(
            siswa,
            index
        ) {

            const nisn =
                String(
                    siswa.NISN || ""
                ).trim();


            const nama =
                String(
                    siswa.NAMA || ""
                ).trim();


            const tr =
                document.createElement("tr");


            // =================================================
            // GURU
            // =================================================

            if (
                ABSENSI_ROLE === "guru"
            ) {

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
                            data-nama="${nama}"
                            style="
                            padding:8px;
                            border-radius:6px;
                            ">

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

            }

            // =================================================
            // SISWA
            // =================================================

            else {

                tr.innerHTML = `

                    <td style="text-align:center;">
                        1
                    </td>

                    <td>
                        <b>${nama}</b>
                    </td>

                    <td>
                        ${nisn}
                    </td>

                    <td>
                        👤 Absensi Saya
                    </td>

                `;

            }


            tabel.appendChild(tr);

        });


        // ====================================================
        // INFO
        // ====================================================

        if (info) {

            if (
                ABSENSI_ROLE === "guru"
            ) {

                info.innerHTML =
                    "✅ Data siswa berhasil dimuat: " +
                    "<b>" +
                    dataTampil.length +
                    "</b> siswa.";

            } else {

                info.innerHTML =
                    "👨‍🎓 Absensi siswa: <b>" +
                    (
                        dataTampil[0]?.NAMA ||
                        ABSENSI_NAMA
                    ) +
                    "</b>";

            }

        }


        // ====================================================
        // STATISTIK GURU
        // ====================================================

        if (
            ABSENSI_ROLE === "guru"
        ) {

            hitungStatistikAbsensi();

        }


        console.log(
            "✅ Data berhasil ditampilkan:",
            dataTampil.length
        );

    }


    catch(error) {

        console.error(
            "❌ ERROR:",
            error
        );


        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    text-align:center;
                    padding:30px;
                    color:red;
                    font-weight:bold;
                    ">

                    ❌ Gagal mengambil data siswa

                    <br><br>

                    ${error.message}

                </td>
            </tr>
        `;


        if (info) {

            info.innerHTML =
                "❌ " +
                error.message;

        }

    }

}


// ====================================================
// STATISTIK
// ====================================================

function hitungStatistikAbsensi() {

    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );


    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;


    semua.forEach(function(select) {

        if (select.value === "H")
            hadir++;

        if (select.value === "S")
            sakit++;

        if (select.value === "I")
            izin++;

        if (select.value === "A")
            alfa++;

    });


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


// ====================================================
// PERUBAHAN STATUS
// ====================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.classList.contains(
                "status-absensi"
            )
        ) {

            hitungStatistikAbsensi();

        }

    }
);


// ====================================================
// SIMPAN ABSENSI
// ====================================================

async function simpanAbsensiGuru() {

    console.log(
        "🟢 SIMPAN ABSENSI DIJALANKAN"
    );


    // =================================================
    // HANYA GURU
    // =================================================

    if (
        ABSENSI_ROLE !== "guru"
    ) {

        alert(
            "❌ Hanya guru yang dapat menyimpan absensi."
        );

        return;

    }


    // =================================================
    // CEGAH KLIK BERULANG
    // =================================================

    if (
        ABSENSI_SEDANG_MENYIMPAN
    ) {

        return;

    }


    // =================================================
    // AMBIL TANGGAL
    // =================================================

    const tanggalElement =
        document.getElementById("tanggal");


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

        tanggalElement.focus();

        return;

    }


    // =================================================
    // AMBIL SEMUA SISWA
    // =================================================

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


    // =================================================
    // KONFIRMASI
    // =================================================

    const yakin =
        confirm(
            "Simpan absensi untuk " +
            semua.length +
            " siswa pada tanggal " +
            tanggal +
            "?"
        );


    if (!yakin) {

        return;

    }


    // =================================================
    // SIAPKAN DATA
    // =================================================

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
        "DATA ABSENSI:",
        data
    );


    // =================================================
    // TOMBOL
    // =================================================

    const tombol =
        document.getElementById(
            "btnSimpan"
        );


    let teksAwal =
        "💾 Simpan Absensi";


    if (tombol) {

        teksAwal =
            tombol.innerHTML;

        tombol.disabled = true;

        tombol.innerHTML =
            "⏳ Menyimpan...";

    }


    ABSENSI_SEDANG_MENYIMPAN = true;


    // =================================================
    // KIRIM KE APPS SCRIPT
    // =================================================

    try {

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
            "RESPONSE SERVER:",
            text
        );


        let hasil;


        try {

            hasil =
                JSON.parse(text);

        }

        catch(error) {

            throw new Error(
                "Response server bukan JSON."
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


        // =================================================
        // BERHASIL
        // =================================================

        alert(
            "✅ ABSENSI BERHASIL DISIMPAN!\n\n" +
            "Tanggal: " +
            tanggal +
            "\nJumlah siswa: " +
            data.length
        );


        console.log(
            "✅ ABSENSI BERHASIL DISIMPAN"
        );

    }


    catch(error) {

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

        ABSENSI_SEDANG_MENYIMPAN =
            false;


        if (tombol) {

            tombol.disabled =
                false;

            tombol.innerHTML =
                teksAwal;

        }

    }

}


// ====================================================
// HUBUNGKAN TOMBOL SIMPAN
// ====================================================

function pasangTombolSimpan() {

    const tombol =
        document.getElementById(
            "btnSimpan"
        );


    if (!tombol) {

        console.error(
            "❌ Tombol #btnSimpan tidak ditemukan."
        );

        return;

    }


    console.log(
        "✅ Tombol Simpan ditemukan."
    );


    // Hindari event dobel
    tombol.onclick =
        function(event) {

            event.preventDefault();

            simpanAbsensiGuru();

        };

}


// ====================================================
// REFRESH
// ====================================================

function pasangTombolRefresh() {

    const tombol =
        document.getElementById(
            "btnRefresh"
        );


    if (!tombol) {

        return;

    }


    tombol.onclick =
        function() {

            location.reload();

        };

}


// ====================================================
// MULAI APLIKASI
// ====================================================

function mulaiAbsensi() {

    console.log(
        "🚀 MULAI ABSENSI"
    );


    pasangTombolSimpan();

    pasangTombolRefresh();

    loadDataAbsensi();

}


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
