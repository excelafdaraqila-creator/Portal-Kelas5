// ============================================================
// REKAP-ABSENSI.JS
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ============================================================

// ============================================================
// API GOOGLE APPS SCRIPT
// ============================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// VARIABEL
// ============================================================

let role = "";
let nisnLogin = "";
let namaLogin = "";


// ============================================================
// SAAT HALAMAN SIAP
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("REKAP ABSENSI JS AKTIF");
    console.log("=================================");

    siapkanTahun();

    tentukanLogin();

    pasangEvent();

    tampilkanRekap();

});


// ============================================================
// TENTUKAN LOGIN
// ============================================================

function tentukanLogin() {

    /*
       Sistem mencoba membaca data login
       dari localStorage.

       Dibuat beberapa kemungkinan nama key
       supaya lebih fleksibel dengan sistem
       login Portal Kelas 5.
    */


    // --------------------------------------------------------
    // ROLE
    // --------------------------------------------------------

    role =
        localStorage.getItem("role") ||
        localStorage.getItem("userRole") ||
        localStorage.getItem("ROLE") ||
        "";


    // --------------------------------------------------------
    // NISN
    // --------------------------------------------------------

    nisnLogin =
        localStorage.getItem("nisn") ||
        localStorage.getItem("NISN") ||
        localStorage.getItem("siswaNISN") ||
        localStorage.getItem("userNISN") ||
        "";


    // --------------------------------------------------------
    // NAMA
    // --------------------------------------------------------

    namaLogin =
        localStorage.getItem("nama") ||
        localStorage.getItem("NAMA") ||
        localStorage.getItem("namaSiswa") ||
        localStorage.getItem("userNama") ||
        "";


    role =
        String(role)
        .trim()
        .toLowerCase();


    nisnLogin =
        String(nisnLogin)
        .trim();


    namaLogin =
        String(namaLogin)
        .trim();


    console.log("ROLE LOGIN:", role);

    console.log("NISN LOGIN:", nisnLogin);

    console.log("NAMA LOGIN:", namaLogin);


    // --------------------------------------------------------
    // JIKA ROLE SISWA
    // --------------------------------------------------------

    if (
        role === "siswa" ||
        role === "student" ||
        role === "murid"
    ) {

        document.getElementById(
            "infoSiswa"
        ).style.display = "block";


        document.getElementById(
            "namaSiswa"
        ).textContent =
            namaLogin || "-";


        document.getElementById(
            "nisnSiswa"
        ).textContent =
            nisnLogin || "-";

    }

}


// ============================================================
// TAHUN
// ============================================================

function siapkanTahun() {

    const tahunSelect =
        document.getElementById("tahun");


    if (!tahunSelect) {

        console.error(
            "❌ #tahun tidak ditemukan."
        );

        return;

    }


    const tahunSekarang =
        new Date().getFullYear();


    tahunSelect.innerHTML = "";


    for (
        let tahun = tahunSekarang - 2;
        tahun <= tahunSekarang + 1;
        tahun++
    ) {

        const option =
            document.createElement("option");


        option.value = tahun;

        option.textContent = tahun;


        tahunSelect.appendChild(
            option
        );

    }


    tahunSelect.value =
        tahunSekarang;


    // --------------------------------------------------------
    // BULAN SEKARANG
    // --------------------------------------------------------

    const bulanSelect =
        document.getElementById("bulan");


    if (bulanSelect) {

        bulanSelect.value =
            new Date().getMonth() + 1;

    }

}


// ============================================================
// EVENT
// ============================================================

function pasangEvent() {

    const btnTampilkan =
        document.getElementById(
            "btnTampilkan"
        );


    if (btnTampilkan) {

        btnTampilkan.addEventListener(
            "click",
            function () {

                tampilkanRekap();

            }
        );

    }


    const btnRefresh =
        document.getElementById(
            "btnRefresh"
        );


    if (btnRefresh) {

        btnRefresh.addEventListener(
            "click",
            function () {

                tampilkanRekap();

            }
        );

    }


    const btnPrint =
        document.getElementById(
            "btnPrint"
        );


    if (btnPrint) {

        btnPrint.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }

}


// ============================================================
// TAMPILKAN REKAP
// ============================================================

async function tampilkanRekap() {

    const tabel =
        document.getElementById(
            "tabelRekap"
        );


    const pesan =
        document.getElementById(
            "pesan"
        );


    if (!tabel) {

        console.error(
            "❌ #tabelRekap tidak ditemukan."
        );

        return;

    }


    // --------------------------------------------------------
    // RESET
    // --------------------------------------------------------

    tabel.innerHTML = `

        <tr>

            <td
                colspan="9"
                style="
                    padding:30px;
                    text-align:center;
                "
            >

                ⏳ Mengambil data rekap absensi...

            </td>

        </tr>

    `;


    if (pesan) {

        pesan.textContent =
            "⏳ Menghubungkan ke database...";

    }


    // --------------------------------------------------------
    // BULAN
    // --------------------------------------------------------

    const bulanElement =
        document.getElementById(
            "bulan"
        );


    const tahunElement =
        document.getElementById(
            "tahun"
        );


    const bulan =
        bulanElement
            ? bulanElement.value
            : "";


    const tahun =
        tahunElement
            ? tahunElement.value
            : "";


    // --------------------------------------------------------
    // BUAT URL
    // --------------------------------------------------------

    let url =
        API_URL +
        "?action=rekapAbsensi" +
        "&bulan=" +
        encodeURIComponent(bulan) +
        "&tahun=" +
        encodeURIComponent(tahun) +
        "&nocache=" +
        Date.now();


    // ========================================================
    // SISWA
    // ========================================================

    if (
        role === "siswa" ||
        role === "student" ||
        role === "murid"
    ) {

        if (!nisnLogin) {

            tampilkanError(
                "NISN siswa tidak ditemukan. Silakan login kembali."
            );

            return;

        }


        url +=
            "&nisn=" +
            encodeURIComponent(
                nisnLogin
            );

    }


    console.log(
        "URL REKAP:",
        url
    );


    // ========================================================
    // FETCH
    // ========================================================

    try {

        const response =
            await fetch(url);


        console.log(
            "STATUS API:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const text =
            await response.text();


        console.log(
            "RESPONSE API:",
            text
        );


        if (!text) {

            throw new Error(
                "Server mengirim data kosong."
            );

        }


        let data;


        try {

            data =
                JSON.parse(text);

        }

        catch (error) {

            throw new Error(
                "Response server bukan JSON."
            );

        }


        console.log(
            "DATA REKAP:",
            data
        );


        // ====================================================
        // CEK DATA
        // ====================================================

        if (
            !Array.isArray(data)
        ) {

            /*
              Jika Apps Script mengirim
              object error.
            */

            if (
                data &&
                data.status === false
            ) {

                throw new Error(
                    data.pesan ||
                    "API mengembalikan error."
                );

            }


            throw new Error(
                "Data absensi bukan Array."
            );

        }


        // ====================================================
        // TIDAK ADA DATA
        // ====================================================

        if (
            data.length === 0
        ) {

            tabel.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        style="
                            padding:30px;
                            text-align:center;
                        "
                    >

                        📭 Belum ada data kehadiran
                        untuk periode yang dipilih.

                    </td>

                </tr>

            `;


            resetStatistik();


            if (pesan) {

                pesan.textContent =
                    "📭 Belum ada data kehadiran.";

            }


            return;

        }


        // ====================================================
        // JIKA SISWA
        // ====================================================

        if (
            role === "siswa" ||
            role === "student" ||
            role === "murid"
        ) {

            tampilkanDataSiswa(
                data
            );

        }


        // ====================================================
        // JIKA GURU
        // ====================================================

        else {

            tampilkanDataGuru(
                data
            );

        }


    }

    catch (error) {

        console.error(
            "❌ ERROR REKAP:",
            error
        );


        tampilkanError(
            error.message
        );

    }

}


// ============================================================
// TAMPILKAN DATA GURU
// ============================================================

function tampilkanDataGuru(data) {

    const tabel =
        document.getElementById(
            "tabelRekap"
        );


    const pesan =
        document.getElementById(
            "pesan"
        );


    tabel.innerHTML = "";


    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlfa = 0;
    let totalSemua = 0;


    data.forEach(
        function(item, index) {

            const hadir =
                angka(item.hadir);


            const sakit =
                angka(item.sakit);


            const izin =
                angka(item.izin);


            const alfa =
                angka(item.alfa);


            const total =
                angka(item.total);


            const persentase =
                angka(item.persentase);


            totalHadir += hadir;

            totalSakit += sakit;

            totalIzin += izin;

            totalAlfa += alfa;

            totalSemua += total;


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td class="nama">
                    ${escapeHTML(
                        item.nama || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.nisn || "-"
                    )}
                </td>

                <td class="status-hadir">
                    ${hadir}
                </td>

                <td class="status-sakit">
                    ${sakit}
                </td>

                <td class="status-izin">
                    ${izin}
                </td>

                <td class="status-alfa">
                    ${alfa}
                </td>

                <td>
                    ${total}
                </td>

                <td>
                    <strong>
                        ${persentase}%
                    </strong>
                </td>

            `;


            tabel.appendChild(
                tr
            );

        }
    );


    // --------------------------------------------------------
    // STATISTIK GURU
    // --------------------------------------------------------

    setText(
        "totalHadir",
        totalHadir
    );


    setText(
        "totalSakit",
        totalSakit
    );


    setText(
        "totalIzin",
        totalIzin
    );


    setText(
        "totalAlfa",
        totalAlfa
    );


    let persentase =
        0;


    if (
        totalSemua > 0
    ) {

        persentase =
            (
                totalHadir /
                totalSemua *
                100
            ).toFixed(2);

    }


    setText(
        "totalPersentase",
        persentase + "%"
    );


    if (pesan) {

        pesan.textContent =
            "✅ Rekap " +
            data.length +
            " siswa berhasil dimuat.";

    }

}


// ============================================================
// TAMPILKAN DATA SISWA
// ============================================================

function tampilkanDataSiswa(data) {

    const tabel =
        document.getElementById(
            "tabelRekap"
        );


    const pesan =
        document.getElementById(
            "pesan"
        );


    tabel.innerHTML = "";


    // --------------------------------------------------------
    // CARI DATA SISWA YANG LOGIN
    // --------------------------------------------------------

    let siswa = null;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        if (
            String(data[i].nisn).trim() ===
            String(nisnLogin).trim()
        ) {

            siswa =
                data[i];

            break;

        }

    }


    // --------------------------------------------------------
    // KALAU API SUDAH FILTER
    // --------------------------------------------------------

    if (
        !siswa &&
        data.length === 1
    ) {

        siswa =
            data[0];

    }


    // --------------------------------------------------------
    // TIDAK ADA
    // --------------------------------------------------------

    if (!siswa) {

        tabel.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        padding:30px;
                        text-align:center;
                    "
                >

                    📭 Belum ada data kehadiran
                    untuk siswa ini.

                </td>

            </tr>

        `;


        resetStatistik();


        if (pesan) {

            pesan.textContent =
                "📭 Belum ada data kehadiran.";

        }


        return;

    }


    // --------------------------------------------------------
    // DATA
    // --------------------------------------------------------

    const hadir =
        angka(siswa.hadir);


    const sakit =
        angka(siswa.sakit);


    const izin =
        angka(siswa.izin);


    const alfa =
        angka(siswa.alfa);


    const total =
        angka(siswa.total);


    const persentase =
        angka(siswa.persentase);


    // --------------------------------------------------------
    // INFO SISWA
    // --------------------------------------------------------

    const info =
        document.getElementById(
            "infoSiswa"
        );


    if (info) {

        info.style.display =
            "block";

    }


    setText(
        "namaSiswa",
        siswa.nama || namaLogin || "-"
    );


    setText(
        "nisnSiswa",
        siswa.nisn || nisnLogin || "-"
    );


    // --------------------------------------------------------
    // STATISTIK
    // --------------------------------------------------------

    setText(
        "totalHadir",
        hadir
    );


    setText(
        "totalSakit",
        sakit
    );


    setText(
        "totalIzin",
        izin
    );


    setText(
        "totalAlfa",
        alfa
    );


    setText(
        "totalPersentase",
        persentase + "%"
    );


    // --------------------------------------------------------
    // BARIS
    // --------------------------------------------------------

    const tr =
        document.createElement(
            "tr"
        );


    tr.innerHTML = `

        <td>
            1
        </td>

        <td class="nama">
            ${escapeHTML(
                siswa.nama || "-"
            )}
        </td>

        <td>
            ${escapeHTML(
                siswa.nisn || "-"
            )}
        </td>

        <td class="status-hadir">
            ${hadir}
        </td>

        <td class="status-sakit">
            ${sakit}
        </td>

        <td class="status-izin">
            ${izin}
        </td>

        <td class="status-alfa">
            ${alfa}
        </td>

        <td>
            ${total}
        </td>

        <td>
            <strong>
                ${persentase}%
            </strong>
        </td>

    `;


    tabel.appendChild(
        tr
    );


    if (pesan) {

        pesan.textContent =
            "✅ Rekap absensi Anda berhasil dimuat.";

    }

}


// ============================================================
// RESET STATISTIK
// ============================================================

function resetStatistik() {

    setText(
        "totalHadir",
        "0"
    );

    setText(
        "totalSakit",
        "0"
    );

    setText(
        "totalIzin",
        "0"
    );

    setText(
        "totalAlfa",
        "0"
    );

    setText(
        "totalPersentase",
        "0%"
    );

}


// ============================================================
// ERROR
// ============================================================

function tampilkanError(pesanError) {

    const tabel =
        document.getElementById(
            "tabelRekap"
        );


    const pesan =
        document.getElementById(
            "pesan"
        );


    if (tabel) {

        tabel.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        padding:30px;
                        text-align:center;
                        color:#dc2626;
                        font-weight:bold;
                    "
                >

                    ❌ Gagal mengambil data rekap

                    <br><br>

                    ${escapeHTML(
                        pesanError || "Terjadi kesalahan."
                    )}

                </td>

            </tr>

        `;

    }


    resetStatistik();


    if (pesan) {

        pesan.textContent =
            "❌ " +
            (pesanError || "Terjadi kesalahan.");

    }

}


// ============================================================
// HELPER ANGKA
// ============================================================

function angka(value) {

    const hasil =
        Number(value);


    if (
        isNaN(hasil)
    ) {

        return 0;

    }


    return hasil;

}


// ============================================================
// HELPER TEXT
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// KEAMANAN HTML
// ============================================================

function escapeHTML(value) {

    return String(value || "")
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
// SELESAI
// ============================================================

console.log(
    "✅ rekap-absensi.js berhasil dimuat."
);
