// ====================================================
// ABSENSI.JS FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

console.log("======================================");
console.log("ABSENSI.JS FINAL AKTIF");
console.log("API:", API_URL);
console.log("======================================");


// ====================================================
// DATA LOGIN
// ====================================================

const absensiRole =
    localStorage.getItem("role") || "";

const absensiNisnLogin =
    String(localStorage.getItem("nisn") || "").trim();

const absensiNamaSiswa =
    localStorage.getItem("namaSiswa") || "";

const absensiNamaGuru =
    localStorage.getItem("namaGuru") || "";

console.log("ROLE LOGIN:", role);
console.log("NISN LOGIN:", nisnLogin);
console.log("NAMA SISWA:", namaSiswa);


// ====================================================
// ELEMENT HTML
// ====================================================

const tabelAbsensi =
    document.getElementById("tabelAbsensi");

const infoAbsensi =
    document.getElementById("infoAbsensi");

const tanggalInput =
    document.getElementById("tanggal");

const btnSimpan =
    document.getElementById("btnSimpan");


// ====================================================
// TANGGAL HARI INI
// ====================================================

if (tanggalInput && !tanggalInput.value) {

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
        tahun + "-" + bulan + "-" + tanggal;
}


// ====================================================
// TAMPILKAN PESAN
// ====================================================

function tampilInfo(pesan) {

    if (infoAbsensi) {
        infoAbsensi.innerHTML = pesan;
    }

}


// ====================================================
// LOAD DATA SISWA
// ====================================================

async function loadSiswa() {

    console.log("🟢 MULAI LOAD DATA SISWA");

    if (!tabelAbsensi) {

        console.error(
            "❌ ID tabelAbsensi tidak ditemukan."
        );

        return;
    }


    tabelAbsensi.innerHTML = `
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


    tampilInfo(
        "🔄 Mengambil data siswa dari Google Spreadsheet..."
    );


    try {

        const url =
            API_URL +
            "?action=siswa&nocache=" +
            Date.now();


        console.log("📡 URL API:");
        console.log(url);


        const response =
            await fetch(url, {
                method: "GET",
                cache: "no-store"
            });


        console.log(
            "📡 STATUS:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        const text =
            await response.text();


        console.log(
            "📦 RESPONSE API:",
            text
        );


        if (!text.trim()) {

            throw new Error(
                "API mengirim data kosong."
            );

        }


        let data;

        try {

            data = JSON.parse(text);

        } catch (error) {

            console.error(
                "Response bukan JSON:",
                text
            );

            throw new Error(
                "Response Apps Script bukan JSON."
            );

        }


        console.log(
            "✅ DATA JSON:",
            data
        );


        // ============================================
        // VALIDASI
        // ============================================

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


        console.log(
            "Jumlah siswa:",
            data.length
        );


        // ============================================
        // JIKA LOGIN SISWA
        // ============================================

        let dataTampil = data;


        if (role === "siswa") {

            dataTampil =
                data.filter(function(siswa) {

                    const nisn =
                        String(
                            siswa.NISN ||
                            siswa.nisn ||
                            ""
                        ).trim();

                    return nisn === nisnLogin;

                });


            console.log(
                "Data siswa setelah filter:",
                dataTampil
            );

        }


        // ============================================
        // JIKA SISWA TIDAK DITEMUKAN
        // ============================================

        if (role === "siswa" &&
            dataTampil.length === 0) {

            tabelAbsensi.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        text-align:center;
                        padding:30px;
                        color:red;
                        font-weight:bold;
                        ">
                        ❌ Data siswa dengan NISN
                        <br>
                        ${nisnLogin || "-"}
                        <br>
                        tidak ditemukan.
                    </td>
                </tr>
            `;

            tampilInfo(
                "❌ NISN login tidak ditemukan."
            );

            return;

        }


        // ============================================
        // TAMPILKAN TABEL
        // ============================================

        tabelAbsensi.innerHTML = "";


        dataTampil.forEach(function(siswa, index) {


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


            // ----------------------------------------
            // JIKA GURU
            // ----------------------------------------

            if (role === "guru") {

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

            }


            // ----------------------------------------
            // JIKA SISWA
            // ----------------------------------------

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

                        <span
                            class="status-siswa"
                            data-nisn="${nisn}">

                            ⏳ Memuat status...

                        </span>

                    </td>

                `;

            }


            tabelAbsensi.appendChild(tr);

        });


        // ============================================
        // INFO
        // ============================================

        if (role === "guru") {

            tampilInfo(
                "✅ Data siswa berhasil dimuat: " +
                dataTampil.length +
                " siswa."
            );

        } else {

            tampilInfo(
                "✅ Menampilkan data absensi untuk " +
                dataTampil[0].NAMA
            );

        }


        // ============================================
        // STATISTIK
        // ============================================

        if (role === "guru") {

            hitungStatistik();

        }


        console.log(
            "🎉 LOAD SISWA BERHASIL"
        );


    } catch (error) {

        console.error(
            "❌ ERROR LOAD SISWA:",
            error
        );


        tabelAbsensi.innerHTML = `

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


        tampilInfo(
            "❌ " + error.message
        );

    }

}


// ====================================================
// STATISTIK
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


    semua.forEach(function(select) {

        if (select.value === "H") hadir++;

        if (select.value === "S") sakit++;

        if (select.value === "I") izin++;

        if (select.value === "A") alfa++;

    });


    const h =
        document.getElementById("jmlHadir");

    const s =
        document.getElementById("jmlSakit");

    const i =
        document.getElementById("jmlIzin");

    const a =
        document.getElementById("jmlAlfa");


    if (h) h.innerText = hadir;

    if (s) s.innerText = sakit;

    if (i) i.innerText = izin;

    if (a) a.innerText = alfa;

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

            hitungStatistik();

        }

    }
);


// ====================================================
// TOMBOL REFRESH
// ====================================================

const btnRefresh =
    document.getElementById("btnRefresh");


if (btnRefresh) {

    btnRefresh.onclick =
        function() {

            location.reload();

        };

}


// ====================================================
// TOMBOL SIMPAN
// ====================================================

if (btnSimpan) {

    btnSimpan.onclick =
        function(event) {

            event.preventDefault();

            simpanAbsensi();

        };

}


// ====================================================
// SIMPAN ABSENSI
// ====================================================

async function simpanAbsensi() {

    if (role !== "guru") {

        alert(
            "❌ Siswa tidak dapat mengubah absensi."
        );

        return;

    }


    const tanggal =
        tanggalInput ?
        tanggalInput.value :
        "";


    if (!tanggal) {

        alert(
            "⚠️ Silakan pilih tanggal."
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
            " siswa?"
        );


    if (!yakin) return;


    const data = [];


    semua.forEach(function(select) {

        data.push({

            tanggal: tanggal,

            nisn:
                select.dataset.nisn || "",

            nama:
                select.dataset.nama || "",

            status:
                select.value || "H"

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


        if (hasil.status !== true) {

            throw new Error(
                hasil.pesan ||
                "Absensi gagal disimpan."
            );

        }


        alert(
            "✅ Absensi berhasil disimpan!"
        );


    } catch (error) {

        console.error(
            error
        );


        alert(
            "❌ Gagal menyimpan absensi.\n\n" +
            error.message
        );

    }


    if (btnSimpan) {

        btnSimpan.disabled = false;

        btnSimpan.innerHTML =
            "💾 Simpan Absensi";

    }

}


// ====================================================
// MULAI
// ====================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadSiswa
    );

} else {

    loadSiswa();

}
