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

console.log("ABSENSI.JS AKTIF");
console.log("ROLE:", ABSENSI_ROLE);
console.log("NISN:", ABSENSI_NISN);


// ====================================================
// LOAD SISWA
// ====================================================

async function loadDataAbsensi() {

    const tabel =
    document.getElementById("tabelAbsensi");

    const info =
    document.getElementById("infoAbsensi");


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
                cache:"no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
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
                "Data siswa bukan Array"
            );

        }


        if (data.length === 0) {

            throw new Error(
                "Data siswa kosong"
            );

        }


        // =================================================
        // GURU = SEMUA SISWA
        // SISWA = HANYA DIRINYA
        // =================================================

        let tampil = data;


        if (
            ABSENSI_ROLE === "siswa"
        ) {

            tampil =
            data.filter(function(siswa) {

                return String(
                    siswa.NISN || ""
                ).trim()
                ===
                ABSENSI_NISN;

            });

        }


        if (
            ABSENSI_ROLE === "siswa" &&
            tampil.length === 0
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
                        NISN: ${ABSENSI_NISN}
                    </td>
                </tr>
            `;

            return;

        }


        tabel.innerHTML = "";


        tampil.forEach(function(siswa,index) {

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

                    <td style="text-align:center">
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

            // =================================================
            // SISWA
            // =================================================

            else {

                tr.innerHTML = `

                    <td style="text-align:center">
                        1
                    </td>

                    <td>
                        <b>${nama}</b>
                    </td>

                    <td>
                        ${nisn}
                    </td>

                    <td>
                        <span>
                            Data absensi saya
                        </span>
                    </td>

                `;

            }


            tabel.appendChild(tr);

        });


        if (info) {

            if (
                ABSENSI_ROLE === "guru"
            ) {

                info.innerHTML =
                "✅ " +
                tampil.length +
                " siswa berhasil dimuat.";

            } else {

                info.innerHTML =
                "✅ Absensi " +
                (tampil[0]?.NAMA ||
                ABSENSI_NAMA);

            }

        }


        if (
            ABSENSI_ROLE === "guru"
        ) {

            hitungStatistikAbsensi();

        }


        console.log(
            "✅ BERHASIL:",
            tampil.length
        );

    }


    catch(error) {

        console.error(
            "❌ ERROR ABSENSI:",
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

});


// ====================================================
// JALANKAN
// ====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadDataAbsensi
    );

} else {

    loadDataAbsensi();

}
