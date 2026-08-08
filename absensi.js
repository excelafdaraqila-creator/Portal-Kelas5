// ============================================================
// ABSENSI.JS FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// Developer : Asep Jamhur
// ============================================================

(function () {

    "use strict";

    // ========================================================
    // KONFIGURASI API
    // ========================================================

    const API_URL =
        "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


    // ========================================================
    // DATA LOGIN
    // Dibuat di dalam function agar tidak bentrok dengan
    // variabel role dari file JavaScript lainnya.
    // ========================================================

    const roleLogin =
        String(localStorage.getItem("role") || "")
            .trim()
            .toLowerCase();

    const namaGuruLogin =
        String(localStorage.getItem("namaGuru") || "").trim();

    const namaSiswaLogin =
        String(localStorage.getItem("namaSiswa") || "").trim();

    const nisnLogin =
        String(localStorage.getItem("nisn") || "").trim();


    // ========================================================
    // CEK LOGIN
    // ========================================================

    if (
        localStorage.getItem("login") !== "true"
    ) {

        alert("Silakan login terlebih dahulu.");

        window.location.href = "login.html";

        return;
    }


    // ========================================================
    // VARIABEL
    // ========================================================

    let dataSiswa = [];

    let sedangMenyimpan = false;


    // ========================================================
    // HELPER
    // ========================================================

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ========================================================
    // TANGGAL LOKAL INDONESIA
    // Tidak menggunakan toISOString agar tidak bergeser tanggal
    // ========================================================

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


    // ========================================================
    // ELEMENT
    // ========================================================

    function getElement(id) {

        return document.getElementById(id);

    }


    // ========================================================
    // TAMPILKAN NAMA LOGIN
    // ========================================================

    function tampilkanNamaLogin() {

        const namaLogin =
            getElement("namaLogin");

        if (!namaLogin) {
            return;
        }

        if (roleLogin === "guru") {

            namaLogin.innerHTML =
                "👨‍🏫 " +
                escapeHTML(
                    namaGuruLogin ||
                    "Guru"
                );

        }

        else {

            namaLogin.innerHTML =
                "👨‍🎓 " +
                escapeHTML(
                    namaSiswaLogin ||
                    "Siswa"
                );

        }

    }


    // ========================================================
    // ATUR TANGGAL
    // ========================================================

    function aturTanggal() {

        const tanggal =
            getElement("tanggal");

        if (!tanggal) {
            return;
        }

        if (!tanggal.value) {

            tanggal.value =
                tanggalHariIni();

        }

    }


    // ========================================================
    // ATUR TAMPILAN BERDASARKAN ROLE
    // ========================================================

    function aturRole() {

        const btnSimpan =
            getElement("btnSimpan");


        // ----------------------------------------------------
        // GURU
        // ----------------------------------------------------

        if (roleLogin === "guru") {

            if (btnSimpan) {

                btnSimpan.style.display =
                    "inline-block";

            }

            return;
        }


        // ----------------------------------------------------
        // SISWA
        // ----------------------------------------------------

        if (btnSimpan) {

            btnSimpan.style.display =
                "none";

        }

    }


    // ========================================================
    // LOAD DATA SISWA
    // ========================================================

    async function loadDataSiswa() {

        const tabel =
            getElement("tabelAbsensi");

        const info =
            getElement("infoAbsensi");


        if (!tabel) {

            console.error(
                "Element #tabelAbsensi tidak ditemukan."
            );

            return;
        }


        // ----------------------------------------------------
        // LOADING
        // ----------------------------------------------------

        tabel.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                        padding:30px;
                        text-align:center;
                        color:#2563eb;
                        font-weight:bold;
                    ">
                    ⏳ Sedang memuat data siswa...
                </td>
            </tr>
        `;


        if (info) {

            info.innerHTML =
                "⏳ Mengambil data siswa...";

        }


        try {

            // ------------------------------------------------
            // URL API
            // ------------------------------------------------

            const url =
                API_URL +
                "?action=siswa&nocache=" +
                Date.now();


            console.log(
                "Mengambil data:",
                url
            );


            // ------------------------------------------------
            // FETCH
            // ------------------------------------------------

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Server error: " +
                    response.status
                );

            }


            // ------------------------------------------------
            // BACA TEXT DAHULU
            // ------------------------------------------------

            const text =
                await response.text();


            console.log(
                "Response API:",
                text
            );


            if (!text.trim()) {

                throw new Error(
                    "Server mengirim data kosong."
                );

            }


            // ------------------------------------------------
            // PARSE JSON
            // ------------------------------------------------

            let hasil;

            try {

                hasil =
                    JSON.parse(text);

            }

            catch (error) {

                throw new Error(
                    "Response server bukan JSON yang valid."
                );

            }


            // ------------------------------------------------
            // API ANDA MENGEMBALIKAN ARRAY LANGSUNG
            // ------------------------------------------------

            if (!Array.isArray(hasil)) {

                throw new Error(
                    "Data siswa bukan Array."
                );

            }


            if (hasil.length === 0) {

                throw new Error(
                    "Data siswa kosong."
                );

            }


            // ------------------------------------------------
            // NORMALISASI DATA
            // ------------------------------------------------

            dataSiswa =
                hasil.map(
                    function (item) {

                        return {

                            nisn:
                                String(
                                    item.NISN ||
                                    item.nisn ||
                                    ""
                                ).trim(),

                            nama:
                                String(
                                    item.NAMA ||
                                    item.nama ||
                                    ""
                                ).trim()

                        };

                    }
                )
                .filter(
                    function (item) {

                        return (
                            item.nisn ||
                            item.nama
                        );

                    }
                );


            // =================================================
            // JIKA LOGIN SISWA
            // HANYA TAMPILKAN DIRINYA SENDIRI
            // =================================================

            if (
                roleLogin === "siswa"
            ) {

                const siswaLogin =
                    dataSiswa.filter(
                        function (item) {

                            return (
                                item.nisn ===
                                nisnLogin
                            );

                        }
                    );


                // ---------------------------------------------
                // Jika NISN ditemukan
                // ---------------------------------------------

                if (
                    siswaLogin.length > 0
                ) {

                    dataSiswa =
                        siswaLogin;

                }

                else {

                    // -----------------------------------------
                    // Jika NISN tidak ditemukan
                    // -----------------------------------------

                    tabel.innerHTML = `
                        <tr>
                            <td colspan="4"
                                style="
                                    padding:30px;
                                    text-align:center;
                                    color:#dc2626;
                                    font-weight:bold;
                                ">
                                ❌ Data siswa untuk akun ini tidak ditemukan.
                            </td>
                        </tr>
                    `;


                    if (info) {

                        info.innerHTML =
                            "❌ NISN siswa tidak ditemukan.";

                    }

                    return;

                }

            }


            // =================================================
            // TAMPILKAN DATA
            // =================================================

            tampilkanDataSiswa();


        }

        catch (error) {

            console.error(
                "ERROR LOAD SISWA:",
                error
            );


            tabel.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                            padding:30px;
                            text-align:center;
                            color:#dc2626;
                            font-weight:bold;
                        ">
                        ❌ Gagal mengambil data siswa
                        <br><br>
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;


            if (info) {

                info.innerHTML =
                    "❌ " +
                    escapeHTML(
                        error.message
                    );

            }

        }

    }


    // ========================================================
    // TAMPILKAN SISWA KE TABEL
    // ========================================================

    function tampilkanDataSiswa() {

        const tabel =
            getElement("tabelAbsensi");

        const info =
            getElement("infoAbsensi");


        if (!tabel) {
            return;
        }


        tabel.innerHTML = "";


        dataSiswa.forEach(
            function (siswa, index) {

                const nisn =
                    escapeHTML(
                        siswa.nisn
                    );

                const nama =
                    escapeHTML(
                        siswa.nama
                    );


                const tr =
                    document.createElement("tr");


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
                            text-align:center;
                        "
                    >

                        <select
                            class="status-absensi"
                            data-nisn="${nisn}"
                            data-nama="${nama}"
                            style="
                                padding:8px;
                                border-radius:6px;
                                min-width:130px;
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


                tabel.appendChild(tr);

            }
        );


        // ----------------------------------------------------
        // INFO
        // ----------------------------------------------------

        if (info) {

            if (
                roleLogin === "guru"
            ) {

                info.innerHTML =
                    "✅ Data siswa berhasil dimuat: " +
                    dataSiswa.length +
                    " siswa.";

            }

            else {

                info.innerHTML =
                    "✅ Data absensi Anda berhasil dimuat.";

            }

        }


        hitungStatistik();


        console.log(
            "Jumlah siswa ditampilkan:",
            dataSiswa.length
        );

    }


    // ========================================================
    // HITUNG STATISTIK
    // ========================================================

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
            getElement("jmlHadir");

        const jmlSakit =
            getElement("jmlSakit");

        const jmlIzin =
            getElement("jmlIzin");

        const jmlAlfa =
            getElement("jmlAlfa");


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


    // ========================================================
    // SIMPAN ABSENSI
    // ========================================================

    async function simpanAbsensi() {

        // ----------------------------------------------------
        // CEGAH KLIK BERULANG
        // ----------------------------------------------------

        if (sedangMenyimpan) {

            return;

        }


        // ----------------------------------------------------
        // HANYA GURU YANG BOLEH MENYIMPAN
        // ----------------------------------------------------

        if (
            roleLogin !== "guru"
        ) {

            alert(
                "❌ Hanya guru yang dapat menyimpan absensi."
            );

            return;

        }


        // ----------------------------------------------------
        // TANGGAL
        // ----------------------------------------------------

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
                "⚠️ Silakan pilih tanggal terlebih dahulu."
            );

            return;

        }


        // ----------------------------------------------------
        // AMBIL SEMUA STATUS
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // KONFIRMASI
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // KUNCI TOMBOL
        // ----------------------------------------------------

        sedangMenyimpan = true;


        const btn =
            getElement("btnSimpan");


        const teksLama =
            btn ?
            btn.innerHTML :
            "💾 Simpan Absensi";


        if (btn) {

            btn.disabled = true;

            btn.innerHTML =
                "⏳ Menyimpan...";

        }


        try {

            // ------------------------------------------------
            // BENTUK DATA
            // ------------------------------------------------

            const data = [];


            semua.forEach(
                function (select) {

                    data.push({

                        tanggal:
                            tanggal,

                        nisn:
                            String(
                                select.dataset.nisn ||
                                ""
                            ).trim(),

                        nama:
                            String(
                                select.dataset.nama ||
                                ""
                            ).trim(),

                        status:
                            String(
                                select.value ||
                                "H"
                            ).trim()

                    });

                }
            );


            console.log(
                "DATA ABSENSI YANG DIKIRIM:",
                data
            );


            // ------------------------------------------------
            // POST KE APPS SCRIPT
            // ------------------------------------------------

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


            // ------------------------------------------------
            // BACA RESPONSE
            // ------------------------------------------------

            const text =
                await response.text();


            console.log(
                "RESPONSE APPS SCRIPT:",
                text
            );


            if (!text.trim()) {

                throw new Error(
                    "Server tidak mengirim response."
                );

            }


            let hasil;


            try {

                hasil =
                    JSON.parse(text);

            }

            catch (error) {

                throw new Error(
                    "Response server tidak valid."
                );

            }


            // ------------------------------------------------
            // CEK HASIL
            // ------------------------------------------------

            if (
                hasil.status !== true
            ) {

                throw new Error(
                    hasil.pesan ||
                    "Absensi gagal disimpan."
                );

            }


            // ------------------------------------------------
            // BERHASIL
            // ------------------------------------------------

            alert(
                "✅ ABSENSI BERHASIL DISIMPAN\n\n" +

                "Tanggal: " +
                tanggal +

                "\nJumlah siswa: " +
                (
                    hasil.jumlah ||
                    data.length
                )
            );


            console.log(
                "✅ Absensi berhasil disimpan."
            );


        }

        catch (error) {

            console.error(
                "❌ ERROR SIMPAN ABSENSI:",
                error
            );


            alert(
                "❌ GAGAL MENYIMPAN ABSENSI\n\n" +
                error.message
            );

        }

        finally {

            sedangMenyimpan =
                false;


            if (btn) {

                btn.disabled =
                    false;

                btn.innerHTML =
                    teksLama;

            }

        }

    }


    // ========================================================
    // REFRESH
    // ========================================================

    function refreshData() {

        loadDataSiswa();

    }


    // ========================================================
    // EVENT CHANGE STATUS
    // ========================================================

    document.addEventListener(
        "change",
        function (event) {

            if (
                event.target &&
                event.target.classList &&
                event.target.classList.contains(
                    "status-absensi"
                )
            ) {

                hitungStatistik();

            }

        }
    );


    // ========================================================
    // INISIALISASI
    // ========================================================

    function init() {

        console.log(
            "======================================"
        );

        console.log(
            "ABSENSI KELAS 5 SDN CIJEMBER"
        );

        console.log(
            "ABSENSI.JS FINAL"
        );

        console.log(
            "Role:",
            roleLogin
        );

        console.log(
            "NISN:",
            nisnLogin
        );

        console.log(
            "======================================"
        );


        tampilkanNamaLogin();

        aturTanggal();

        aturRole();


        // ----------------------------------------------------
        // TOMBOL SIMPAN
        // ----------------------------------------------------

        const btnSimpan =
            getElement("btnSimpan");


        if (btnSimpan) {

            btnSimpan.onclick =
                function (event) {

                    event.preventDefault();

                    simpanAbsensi();

                };

        }


        // ----------------------------------------------------
        // TOMBOL REFRESH
        // ----------------------------------------------------

        const btnRefresh =
            getElement("btnRefresh");


        if (btnRefresh) {

            btnRefresh.onclick =
                function (event) {

                    event.preventDefault();

                    refreshData();

                };

        }


        // ----------------------------------------------------
        // LOAD DATA
        // ----------------------------------------------------

        loadDataSiswa();

    }


    // ========================================================
    // JALANKAN
    // ========================================================

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else {

        init();

    }


    // ========================================================
    // LOGOUT
    // ========================================================

    window.logout =
        function () {

            if (
                confirm(
                    "Yakin ingin logout?"
                )
            ) {

                localStorage.clear();

                window.location.href =
                    "login.html";

            }

        };


})();
