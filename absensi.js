// ====================================================
// ABSENSI.JS FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ====================================================

const API_URL = "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

// ====================================================
// LOGIN
// ====================================================

const role =
localStorage.getItem("role") || "";

const nisnLogin =
String(localStorage.getItem("nisn") || "").trim();

const namaSiswa =
localStorage.getItem("namaSiswa") || "";

console.log("ROLE:", role);
console.log("NISN LOGIN:", nisnLogin);
console.log("NAMA SISWA:", namaSiswa);


// ====================================================
// ELEMENT
// ====================================================

const tabel =
document.getElementById("tabelAbsensi");

const info =
document.getElementById("infoAbsensi");


// ====================================================
// LOAD DATA SISWA
// ====================================================

async function loadSiswa() {

    console.log("🔵 MULAI LOAD DATA SISWA");

    if (!tabel) {

        console.error(
            "❌ tabelAbsensi tidak ditemukan"
        );

        return;

    }


    tabel.innerHTML = `
        <tr>
            <td colspan="4"
                style="
                text-align:center;
                padding:30px;
                font-weight:bold;
                color:#2563eb;
                ">
                ⏳ Sedang memuat data siswa...
            </td>
        </tr>
    `;


    try {

        const url =
        API_URL +
        "?action=siswa&nocache=" +
        Date.now();


        console.log(
            "🌐 REQUEST:",
            url
        );


        const response =
        await fetch(url);


        console.log(
            "STATUS:",
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
            "📦 RESPONSE:",
            text
        );


        const data =
        JSON.parse(text);


        console.log(
            "📚 DATA SISWA:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Data yang diterima bukan Array."
            );

        }


        if (data.length === 0) {

            throw new Error(
                "Data siswa kosong."
            );

        }


        // ==================================================
        // SISWA LOGIN
        // ==================================================

        let dataTampil = data;


        if (
            role === "siswa" &&
            nisnLogin
        ) {

            dataTampil =
            data.filter(function(siswa) {

                return String(
                    siswa.NISN || ""
                ).trim()
                ===
                nisnLogin;

            });

        }


        console.log(
            "JUMLAH DATA TAMPIL:",
            dataTampil.length
        );


        // ==================================================
        // JIKA SISWA TIDAK DITEMUKAN
        // ==================================================

        if (
            role === "siswa" &&
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
                        ❌ Data siswa dengan NISN
                        <b>${nisnLogin}</b>
                        tidak ditemukan.
                    </td>
                </tr>
            `;

            if (info) {

                info.innerHTML =
                "❌ Data siswa tidak ditemukan.";

            }

            return;

        }


        // ==================================================
        // TAMPILKAN
        // ==================================================

        tabel.innerHTML = "";


        dataTampil.forEach(
        function(siswa, index) {

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


            tr.innerHTML = `

                <td style="
                    text-align:center;
                    padding:10px;
                ">
                    ${index + 1}
                </td>

                <td style="
                    padding:10px;
                    font-weight:bold;
                ">
                    ${nama}
                </td>

                <td style="
                    padding:10px;
                ">
                    ${nisn}
                </td>

                <td style="
                    padding:10px;
                    text-align:center;
                ">

                    <select
                        class="status-absensi"
                        data-nisn="${nisn}"
                        data-nama="${nama}"
                        style="
                        padding:8px;
                        border-radius:6px;
                        border:1px solid #ccc;
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


            tabel.appendChild(tr);

        });


        if (info) {

            if (role === "siswa") {

                info.innerHTML =
                "✅ Menampilkan absensi untuk <b>" +
                (dataTampil[0]?.NAMA || namaSiswa) +
                "</b>";

            }
            else {

                info.innerHTML =
                "✅ Data siswa berhasil dimuat: <b>" +
                dataTampil.length +
                " siswa</b>";

            }

        }


        hitungStatistik();


        console.log(
            "✅ BERHASIL MENAMPILKAN DATA"
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
            "❌ " + error.message;

        }

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


    semua.forEach(
    function(select) {

        if (select.value === "H")
            hadir++;

        if (select.value === "S")
            sakit++;

        if (select.value === "I")
            izin++;

        if (select.value === "A")
            alfa++;

    });


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

});


// ====================================================
// MULAI
// ====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadSiswa
    );

}
else {

    loadSiswa();

}
