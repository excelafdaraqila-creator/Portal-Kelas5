// ============================================================
// ABSENSI.JS FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ============================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// LOGIN
// ============================================================

const role =
localStorage.getItem("role") || "guru";

const nisnLogin =
String(localStorage.getItem("nisn") || "").trim();

const namaSiswa =
localStorage.getItem("namaSiswa") || "";

const namaGuru =
localStorage.getItem("namaGuru") || "";


// ============================================================
// ELEMENT
// ============================================================

let tabel;
let info;
let tanggalInput;
let btnSimpan;


// ============================================================
// MULAI
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("ABSENSI.JS FINAL");
    console.log("Role :", role);
    console.log("NISN Login :", nisnLogin);
    console.log("API :", API_URL);
    console.log("====================================");

    tabel =
        document.getElementById("tabelAbsensi");

    info =
        document.getElementById("infoAbsensi");

    tanggalInput =
        document.getElementById("tanggal");

    btnSimpan =
        document.getElementById("btnSimpan");


    // --------------------------------------------------------
    // NAMA LOGIN
    // --------------------------------------------------------

    const namaLogin =
        document.getElementById("namaLogin");

    if (namaLogin) {

        if (role === "guru") {

            namaLogin.innerHTML =
                "👨‍🏫 " + namaGuru;

        } else {

            namaLogin.innerHTML =
                "👨‍🎓 " + namaSiswa;

        }

    }


    // --------------------------------------------------------
    // TANGGAL OTOMATIS
    // --------------------------------------------------------

    if (tanggalInput) {

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
            tahun + "-" + bulan + "-" + hari;

    }


    // --------------------------------------------------------
    // TOMBOL SIMPAN
    // --------------------------------------------------------

    if (btnSimpan) {

        btnSimpan.addEventListener(
            "click",
            simpanAbsensi
        );

    }


    // --------------------------------------------------------
    // LOAD DATA
    // --------------------------------------------------------

    loadDataSiswa();

});


// ============================================================
// LOAD SISWA
// ============================================================

async function loadDataSiswa() {

    if (!tabel) {

        console.error(
            "❌ tabelAbsensi tidak ditemukan."
        );

        return;

    }


    tabel.innerHTML = `
        <tr>
            <td colspan="4"
                style="padding:30px;text-align:center;">
                ⏳ Sedang memuat data siswa...
            </td>
        </tr>
    `;


    if (info) {

        info.innerHTML =
            "⏳ Menghubungkan ke database...";

    }


    const url =
        API_URL +
        "?action=siswa&t=" +
        Date.now();


    console.log(
        "MENGAMBIL DATA DARI:",
        url
    );


    try {

        const controller =
            new AbortController();

        const timeout =
            setTimeout(
                function () {

                    controller.abort();

                },
                15000
            );


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store",
                    signal: controller.signal
                }
            );


        clearTimeout(timeout);


        console.log(
            "STATUS API:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "RESPONSE API:",
            text
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        if (!text) {

            throw new Error(
                "Server mengirim data kosong."
            );

        }


        let data;


        try {

            data =
                JSON.parse(text);

        } catch (e) {

            console.error(
                "RESPON BUKAN JSON:",
                text
            );

            throw new Error(
                "Response Apps Script bukan JSON."
            );

        }


        console.log(
            "DATA SISWA:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Format data siswa tidak benar."
            );

        }


        if (data.length === 0) {

            throw new Error(
                "Data siswa kosong."
            );

        }


        // ----------------------------------------------------
        // FILTER DATA
        // ----------------------------------------------------

        let dataTampil = data;


        // Guru melihat semua siswa

        if (role === "guru") {

            dataTampil = data;

        }

        // Siswa hanya melihat dirinya sendiri

        else {

            dataTampil =
                data.filter(
                    function (siswa) {

                        const nisn =
                            String(
                                siswa.NISN ||
                                siswa.nisn ||
                                ""
                            ).trim();

                        return (
                            nisn === nisnLogin
                        );

                    }
                );

        }


        console.log(
            "DATA TAMPIL:",
            dataTampil
        );


        if (dataTampil.length === 0) {

            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:red;
                        font-weight:bold;
                        ">
                        ❌ Data siswa tidak ditemukan.
                    </td>
                </tr>
            `;

            if (info) {

                info.innerHTML =
                    "❌ NISN login tidak ditemukan.";

            }

            return;

        }


        // ----------------------------------------------------
        // TAMPILKAN
        // ----------------------------------------------------

        renderSiswa(dataTampil);


        if (info) {

            if (role === "guru") {

                info.innerHTML =
                    "✅ Berhasil memuat " +
                    dataTampil.length +
                    " siswa.";

            } else {

                info.innerHTML =
                    "✅ Menampilkan absensi Anda.";

            }

        }


    }

    catch (error) {

        console.error(
            "❌ ERROR LOAD SISWA:",
            error
        );


        let pesan =
            error.message;


        if (
            error.name ===
            "AbortError"
        ) {

            pesan =
                "Koneksi ke Apps Script terlalu lama (timeout 15 detik).";

        }


        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:red;
                    font-weight:bold;
                    ">

                    ❌ GAGAL MEMUAT DATA SISWA

                    <br><br>

                    ${pesan}

                    <br><br>

                    <small>
                    Buka Console (F12) untuk melihat detail.
                    </small>

                </td>
            </tr>
        `;


        if (info) {

            info.innerHTML =
                "❌ " + pesan;

        }

    }

}


// ============================================================
// RENDER SISWA
// ============================================================

function renderSiswa(data) {

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


    hitungStatistik();

}


// ============================================================
// STATISTIK
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

            if (select.value === "H")
                hadir++;

            if (select.value === "S")
                sakit++;

            if (select.value === "I")
                izin++;

            if (select.value === "A")
                alfa++;

        }
    );


    const jmlHadir =
        document.getElementById(
            "jmlHadir"
        );

    const jmlSakit =
        document.getElementById(
            "jmlSakit"
        );

    const jmlIzin =
        document.getElementById(
            "jmlIzin"
        );

    const jmlAlfa =
        document.getElementById(
            "jmlAlfa"
        );


    if (jmlHadir)
        jmlHadir.innerText = hadir;

    if (jmlSakit)
        jmlSakit.innerText = sakit;

    if (jmlIzin)
        jmlIzin.innerText = izin;

    if (jmlAlfa)
        jmlAlfa.innerText = alfa;

}


// ============================================================
// PERUBAHAN STATUS
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
// SIMPAN ABSENSI
// ============================================================

async function simpanAbsensi() {

    if (!tanggalInput) {

        alert(
            "❌ Input tanggal tidak ditemukan."
        );

        return;

    }


    const tanggal =
        tanggalInput.value;


    if (!tanggal) {

        alert(
            "⚠️ Pilih tanggal terlebih dahulu."
        );

        return;

    }


    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );


    if (semua.length === 0) {

        alert(
            "❌ Tidak ada data siswa."
        );

        return;

    }


    const data = [];


    semua.forEach(
        function (select) {

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

        }
    );


    const yakin =
        confirm(
            "Simpan absensi " +
            data.length +
            " siswa?"
        );


    if (!yakin) {

        return;

    }


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
            "HASIL SIMPAN:",
            text
        );


        const hasil =
            JSON.parse(text);


        if (
            hasil.status !== true
        ) {

            throw new Error(
                hasil.pesan ||
                "Gagal menyimpan."
            );

        }


        alert(
            "✅ Absensi berhasil disimpan."
        );


    }

    catch (error) {

        console.error(
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
