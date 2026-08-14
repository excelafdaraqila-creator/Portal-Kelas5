// ============================================================
// PERKEMBANGAN.JS - VERSI FINAL
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ============================================================


// ============================================================
// API GOOGLE APPS SCRIPT
// ============================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// DATA ASPEK PERKEMBANGAN
// ============================================================

const aspek = [

    {
        key: "pemahamanMateri",
        nama: "Pemahaman materi",
        indikator:
            "Memahami konsep dan dapat menjelaskan kembali dengan bahasa sendiri."
    },

    {
        key: "penerapanMateri",
        nama: "Penerapan materi",
        indikator:
            "Mampu menggunakan pengetahuan untuk menyelesaikan masalah/tugas."
    },

    {
        key: "keterampilan",
        nama: "Keterampilan",
        indikator:
            "Mampu melakukan praktik dan menghasilkan pekerjaan sesuai petunjuk."
    },

    {
        key: "ketelitian",
        nama: "Ketelitian",
        indikator:
            "Cermat dalam membaca, menghitung, menulis, dan memeriksa pekerjaan."
    },

    {
        key: "kedisiplinan",
        nama: "Kedisiplinan",
        indikator:
            "Mengikuti aturan dan menyelesaikan tugas sesuai waktu."
    },

    {
        key: "tanggungJawab",
        nama: "Tanggung jawab",
        indikator:
            "Menjaga tugas, perlengkapan, dan menyelesaikan amanah yang diberikan."
    },

    {
        key: "kejujuran",
        nama: "Kejujuran",
        indikator:
            "Berkata dan bertindak jujur dalam belajar maupun berinteraksi."
    },

    {
        key: "kemandirian",
        nama: "Kemandirian",
        indikator:
            "Berusaha menyelesaikan pekerjaan tanpa selalu bergantung pada orang lain."
    },

    {
        key: "percayaDiri",
        nama: "Percaya diri",
        indikator:
            "Berani bertanya, menjawab, tampil, atau menyampaikan pendapat."
    },

    {
        key: "kerjaSama",
        nama: "Kerja sama",
        indikator:
            "Mampu berbagi tugas, mendengarkan, dan bekerja dengan teman."
    },

    {
        key: "sikapMenghargai",
        nama: "Sikap menghargai",
        indikator:
            "Menghormati guru, teman, perbedaan pendapat, dan aturan bersama."
    },

    {
        key: "komunikasi",
        nama: "Komunikasi",
        indikator:
            "Menyampaikan ide/pesan dengan sopan dan mudah dipahami."
    },

    {
        key: "keaktifanBelajar",
        nama: "Keaktifan belajar",
        indikator:
            "Terlibat dalam diskusi, kegiatan, dan proses pembelajaran."
    },

    {
        key: "kreativitas",
        nama: "Kreativitas",
        indikator:
            "Mampu menemukan ide/cara baru dan mengembangkan hasil pekerjaan."
    },

    {
        key: "ketekunan",
        nama: "Ketekunan",
        indikator:
            "Tidak mudah menyerah dan mau memperbaiki kesalahan."
    }

];


// ============================================================
// VARIABEL GLOBAL
// ============================================================

let role = "";

let siswaData = [];

let semuaPerkembangan = [];

let dataPerkembanganSaatIni = null;


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "===================================="
        );

        console.log(
            "PERKEMBANGAN.JS VERSI FINAL AKTIF"
        );

        console.log(
            "===================================="
        );


        // Buat tabel penilaian
        buatTabelAspek();


        // Tentukan role login
        tentukanRole();

    }
);


// ============================================================
// TENTUKAN ROLE
// ============================================================

function tentukanRole() {

    role =
        String(
            localStorage.getItem("role") || ""
        )
        .trim()
        .toLowerCase();


    console.log(
        "ROLE LOGIN:",
        role
    );


    if (role === "guru") {

        modeGuru();

        return;

    }


    if (
        role === "siswa" ||
        role === "student" ||
        role === "murid"
    ) {

        modeSiswa();

        return;

    }


    tampilkanPesan(
        "❌ Login tidak ditemukan. Silakan login kembali."
    );

}


// ============================================================
// MODE GURU
// ============================================================

async function modeGuru() {

    const select =
        document.getElementById(
            "pilihSiswa"
        );


    // Jika elemen tidak ada, hentikan
    if (!select) {

        console.error(
            "Elemen #pilihSiswa tidak ditemukan."
        );

        return;

    }


    // Dropdown siswa tampil
    select.classList.remove(
        "hidden"
    );


    // Input nama khusus siswa disembunyikan
    const namaInput =
        document.getElementById(
            "namaSiswa"
        );


    if (namaInput) {

        namaInput.classList.add(
            "hidden"
        );

    }


    // Tombol simpan guru tampil
    const btnSimpan =
        document.getElementById(
            "btnSimpan"
        );


    if (btnSimpan) {

        btnSimpan.classList.remove(
            "hidden"
        );

    }


    // Form guru dapat diedit
    aktifkanFormGuru();


    try {

        tampilkanPesan(
            "⏳ Memuat data siswa..."
        );


        await ambilDaftarSiswa();


        tampilkanPesan(
            "⏳ Memuat data perkembangan..."
        );


        await ambilSemuaPerkembangan();


        tampilkanPesan(
            "✅ Data siap digunakan."
        );


        // Event memilih siswa
        select.addEventListener(
            "change",
            function () {

                pilihSiswaGuru(
                    this.value
                );

            }
        );

    }

    catch (error) {

        console.error(
            "ERROR MODE GURU:",
            error
        );


        tampilkanPesan(
            "❌ Gagal memuat data dari server."
        );

    }

}


// ============================================================
// MODE SISWA
// ============================================================

async function modeSiswa() {

    // Ambil NISN dari akun login
    const nisn =
        String(
            localStorage.getItem("nisn") || ""
        )
        .trim();


    // Ambil nama siswa dari akun login
    const nama =
        String(
            localStorage.getItem("namaSiswa") || ""
        )
        .trim();


    console.log(
        "NISN SISWA:",
        nisn
    );


    console.log(
        "NAMA SISWA:",
        nama
    );


    // ========================================================
    // SEMBUNYIKAN DROPDOWN
    // ========================================================

    const pilihSiswa =
        document.getElementById(
            "pilihSiswa"
        );


    if (pilihSiswa) {

        pilihSiswa.classList.add(
            "hidden"
        );

    }


    // ========================================================
    // TAMPILKAN INPUT NAMA
    // ========================================================

    const inputNama =
        document.getElementById(
            "namaSiswa"
        );


    if (inputNama) {

        inputNama.classList.remove(
            "hidden"
        );


        inputNama.value =
            nama || "-";

    }


    // ========================================================
    // ISI NISN
    // ========================================================

    const inputNisn =
        document.getElementById(
            "nisnSiswa"
        );


    if (inputNisn) {

        inputNisn.value =
            nisn;

    }


    // ========================================================
    // SISWA TIDAK BOLEH SIMPAN
    // ========================================================

    const btnSimpan =
        document.getElementById(
            "btnSimpan"
        );


    if (btnSimpan) {

        btnSimpan.classList.add(
            "hidden"
        );

    }


    // ========================================================
    // SISWA HANYA MEMBACA
    // ========================================================

    jadikanModeBacaSaja();


    // ========================================================
    // CEK NISN
    // ========================================================

    if (!nisn) {

        tampilkanPesan(
            "❌ NISN akun siswa tidak ditemukan. Silakan login kembali."
        );

        return;

    }


    // ========================================================
    // AMBIL DATA PERKEMBANGAN SISWA
    // ========================================================

    await ambilPerkembanganSiswa(
        nisn
    );

}


// ============================================================
// MODE BACA SAJA UNTUK SISWA
// ============================================================

function jadikanModeBacaSaja() {

    // Semua dropdown nilai tidak bisa diubah
    document
        .querySelectorAll(
            "#tabelAspek select"
        )
        .forEach(
            function (select) {

                select.disabled =
                    true;

            }
        );


    // Semua catatan menjadi readonly
    const daftarInput = [

        "kelebihan",

        "perluDikembangkan",

        "saranTindakLanjut",

        "catatanGuru"

    ];


    daftarInput.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.readOnly =
                    true;

                element.disabled =
                    false;

            }

        }
    );

}


// ============================================================
// FORM GURU AKTIF
// ============================================================

function aktifkanFormGuru() {

    // Nilai bisa dipilih
    document
        .querySelectorAll(
            "#tabelAspek select"
        )
        .forEach(
            function (select) {

                select.disabled =
                    false;

            }
        );


    // Catatan bisa diedit
    const daftarInput = [

        "kelebihan",

        "perluDikembangkan",

        "saranTindakLanjut",

        "catatanGuru"

    ];


    daftarInput.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.readOnly =
                    false;

                element.disabled =
                    false;

            }

        }
    );

}


// ============================================================
// AMBIL DAFTAR SISWA
// ============================================================

async function ambilDaftarSiswa() {

    const url =
        API_URL +
        "?action=siswa&nocache=" +
        Date.now();


    const response =
        await fetch(
            url
        );


    if (!response.ok) {

        throw new Error(
            "Gagal mengambil data siswa."
        );

    }


    const data =
        await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "Data siswa bukan Array."
        );

    }


    siswaData =
        data;


    const select =
        document.getElementById(
            "pilihSiswa"
        );


    if (!select) {

        return;

    }


    select.innerHTML =
        `
        <option value="">
            -- Pilih Siswa --
        </option>
        `;


    data.forEach(
        function (siswa) {

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


            if (!nisn && !nama) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                nisn;


            option.textContent =
                nama || "-";


            select.appendChild(
                option
            );

        }
    );

}


// ============================================================
// AMBIL SEMUA PERKEMBANGAN
// ============================================================

async function ambilSemuaPerkembangan() {

    const url =
        API_URL +
        "?action=perkembangan&nocache=" +
        Date.now();


    const response =
        await fetch(
            url
        );


    if (!response.ok) {

        throw new Error(
            "Gagal mengambil data perkembangan."
        );

    }


    const data =
        await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "Data perkembangan bukan Array."
        );

    }


    semuaPerkembangan =
        data;


    window.semuaPerkembangan =
        data;


    console.log(
        "JUMLAH DATA PERKEMBANGAN:",
        data.length
    );

}


// ============================================================
// AMBIL PERKEMBANGAN KHUSUS SISWA
// ============================================================

async function ambilPerkembanganSiswa(
    nisn
) {

    try {

        tampilkanPesan(
            "⏳ Mencari perkembangan Anda..."
        );


        const url =
            API_URL +
            "?action=perkembangan" +
            "&nisn=" +
            encodeURIComponent(nisn) +
            "&nocache=" +
            Date.now();


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "Server gagal mengambil data."
            );

        }


        const data =
            await response.json();


        console.log(
            "DATA PERKEMBANGAN SISWA:",
            data
        );


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            dataPerkembanganSaatIni =
                null;


            kosongkanPenilaian();


            tampilkanPesan(
                "📭 Belum ada data perkembangan Anda."
            );


            return;

        }


        dataPerkembanganSaatIni =
            data[0];


        isiForm(
            data[0]
        );


        tampilkanPesan(
            "✅ Data perkembangan Anda berhasil dimuat."
        );

    }

    catch (error) {

        console.error(
            "ERROR AMBIL PERKEMBANGAN SISWA:",
            error
        );


        tampilkanPesan(
            "❌ Gagal mengambil data perkembangan."
        );

    }

}


// ============================================================
// PILIH SISWA GURU
// ============================================================

function pilihSiswaGuru(
    nisn
) {

    nisn =
        String(
            nisn || ""
        ).trim();


    // Jika tidak ada siswa
    if (!nisn) {

        kosongkanForm();

        return;

    }


    // Cari data siswa
    const siswa =
        siswaData.find(
            function (item) {

                const nomor =
                    String(
                        item.NISN ||
                        item.nisn ||
                        ""
                    ).trim();


                return nomor === nisn;

            }
        );


    if (!siswa) {

        tampilkanPesan(
            "❌ Data siswa tidak ditemukan."
        );

        return;

    }


    const nama =
        String(
            siswa.NAMA ||
            siswa.nama ||
            ""
        ).trim();


    // Isi NISN
    const nisnInput =
        document.getElementById(
            "nisnSiswa"
        );


    if (nisnInput) {

        nisnInput.value =
            nisn;

    }


    // Cari perkembangan siswa
    const perkembangan =
        semuaPerkembangan.find(
            function (item) {

                const nomor =
                    String(
                        item.nisn ||
                        item.NISN ||
                        ""
                    ).trim();


                return nomor === nisn;

            }
        );


    if (perkembangan) {

        dataPerkembanganSaatIni =
            perkembangan;


        isiForm(
            perkembangan
        );


        tampilkanPesan(
            "📋 Data perkembangan siswa ditemukan."
        );

    }

    else {

        dataPerkembanganSaatIni =
            null;


        kosongkanPenilaian();


        tampilkanPesan(
            "ℹ️ Belum ada perkembangan untuk " +
            nama +
            ". Silakan isi penilaian."
        );

    }

}


// ============================================================
// BUAT TABEL ASPEK
// ============================================================

function buatTabelAspek() {

    const tbody =
        document.getElementById(
            "tabelAspek"
        );


    const tbodyCetak =
        document.getElementById(
            "tabelCetakAspek"
        );


    if (!tbody) {

        console.error(
            "Elemen #tabelAspek tidak ditemukan."
        );

        return;

    }


    tbody.innerHTML =
        "";


    if (tbodyCetak) {

        tbodyCetak.innerHTML =
            "";

    }


    aspek.forEach(
        function (item, index) {

            // =================================================
            // TABEL FORM
            // =================================================

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML =
                `
                <td>
                    ${index + 1}
                </td>

                <td class="aspek">
                    ${item.nama}
                </td>

                <td class="indikator">
                    ${item.indikator}
                </td>

                <td class="nilai">

                    <select
                        id="nilai_${item.key}"
                    >

                        <option value="">
                            -
                        </option>

                        <option value="4">
                            4
                        </option>

                        <option value="3">
                            3
                        </option>

                        <option value="2">
                            2
                        </option>

                        <option value="1">
                            1
                        </option>

                    </select>

                </td>
                `;


            tbody.appendChild(
                tr
            );


            // =================================================
            // TABEL CETAK
            // =================================================

            if (tbodyCetak) {

                const trCetak =
                    document.createElement(
                        "tr"
                    );


                trCetak.innerHTML =
                    `
                    <td class="center">
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${item.nama}
                        </strong>
                    </td>

                    <td>
                        ${item.indikator}
                    </td>

                    <td
                        class="center"
                        id="cetak_${item.key}_4"
                    ></td>

                    <td
                        class="center"
                        id="cetak_${item.key}_3"
                    ></td>

                    <td
                        class="center"
                        id="cetak_${item.key}_2"
                    ></td>

                    <td
                        class="center"
                        id="cetak_${item.key}_1"
                    ></td>
                    `;


                tbodyCetak.appendChild(
                    trCetak
                );

            }

        }
    );

}


// ============================================================
// ISI FORM DARI DATA
// ============================================================

function isiForm(
    data
) {

    if (!data) {

        data = {};

    }


    // ========================================================
    // NILAI 15 ASPEK
    // ========================================================

    aspek.forEach(
        function (item) {

            const select =
                document.getElementById(
                    "nilai_" +
                    item.key
                );


            if (select) {

                const nilai =
                    data[item.key] == null
                        ? ""
                        : String(
                            data[item.key]
                        );


                select.value =
                    nilai;

            }

        }
    );


    // ========================================================
    // CATATAN
    // ========================================================

    const kelebihan =
        document.getElementById(
            "kelebihan"
        );


    if (kelebihan) {

        kelebihan.value =
            data.kelebihan || "";

    }


    const perlu =
        document.getElementById(
            "perluDikembangkan"
        );


    if (perlu) {

        perlu.value =
            data.perluDikembangkan || "";

    }


    const saran =
        document.getElementById(
            "saranTindakLanjut"
        );


    if (saran) {

        saran.value =
            data.saranTindakLanjut || "";

    }


    const catatan =
        document.getElementById(
            "catatanGuru"
        );


    if (catatan) {

        catatan.value =
            data.catatanGuru || "";

    }


    // Isi area cetak
    isiCetak(
        data
    );

}


// ============================================================
// KOSONGKAN FORM
// ============================================================

function kosongkanForm() {

    const nisn =
        document.getElementById(
            "nisnSiswa"
        );


    if (nisn) {

        nisn.value =
            "";

    }


    kosongkanPenilaian();

}


// ============================================================
// KOSONGKAN PENILAIAN
// ============================================================

function kosongkanPenilaian() {

    aspek.forEach(
        function (item) {

            const select =
                document.getElementById(
                    "nilai_" +
                    item.key
                );


            if (select) {

                select.value =
                    "";

            }

        }
    );


    const daftarInput = [

        "kelebihan",

        "perluDikembangkan",

        "saranTindakLanjut",

        "catatanGuru"

    ];


    daftarInput.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );


    isiCetak(
        {}
    );

}


// ============================================================
// SIMPAN DATA
// ============================================================

async function simpanData() {

    // ========================================================
    // HANYA GURU
    // ========================================================

    if (role !== "guru") {

        alert(
            "Hanya guru yang dapat menyimpan perkembangan."
        );

        return;

    }


    // ========================================================
    // AMBIL IDENTITAS
    // ========================================================

    const nisnElement =
        document.getElementById(
            "nisnSiswa"
        );


    const nisn =
        String(
            nisnElement
                ? nisnElement.value
                : ""
        )
        .trim();


    const selectSiswa =
        document.getElementById(
            "pilihSiswa"
        );


    let nama =
        "";


    if (
        selectSiswa &&
        selectSiswa.selectedIndex >= 0
    ) {

        const option =
            selectSiswa.options[
                selectSiswa.selectedIndex
            ];


        if (option) {

            nama =
                String(
                    option.textContent ||
                    ""
                ).trim();

        }

    }


    // ========================================================
    // VALIDASI SISWA
    // ========================================================

    if (!nisn) {

        alert(
            "Silakan pilih siswa terlebih dahulu."
        );

        return;

    }


    if (
        !nama ||
        nama === "-- Pilih Siswa --"
    ) {

        alert(
            "Silakan pilih siswa terlebih dahulu."
        );

        return;

    }


    // ========================================================
    // KUMPULKAN DATA
    // ========================================================

    const data = {

        nisn:
            nisn,

        nama:
            nama

    };


    // ========================================================
    // AMBIL 15 NILAI
    // ========================================================

    for (
        let i = 0;
        i < aspek.length;
        i++
    ) {

        const item =
            aspek[i];


        const selectNilai =
            document.getElementById(
                "nilai_" +
                item.key
            );


        data[item.key] =
            selectNilai
                ? String(
                    selectNilai.value || ""
                )
                : "";

    }


    // ========================================================
    // AMBIL CATATAN
    // ========================================================

    const kelebihan =
        document.getElementById(
            "kelebihan"
        );


    const perlu =
        document.getElementById(
            "perluDikembangkan"
        );


    const saran =
        document.getElementById(
            "saranTindakLanjut"
        );


    const catatan =
        document.getElementById(
            "catatanGuru"
        );


    data.kelebihan =
        kelebihan
            ? kelebihan.value.trim()
            : "";


    data.perluDikembangkan =
        perlu
            ? perlu.value.trim()
            : "";


    data.saranTindakLanjut =
        saran
            ? saran.value.trim()
            : "";


    data.catatanGuru =
        catatan
            ? catatan.value.trim()
            : "";


    // ========================================================
    // CEK 15 NILAI
    // ========================================================

    for (
        let i = 0;
        i < aspek.length;
        i++
    ) {

        const item =
            aspek[i];


        if (
            !data[item.key]
        ) {

            alert(
                "Penilaian \"" +
                item.nama +
                "\" belum diisi."
            );

            return;

        }

    }


    // ========================================================
    // TOMBOL
    // ========================================================

    const btn =
        document.getElementById(
            "btnSimpan"
        );


    if (btn) {

        btn.disabled =
            true;

        btn.textContent =
            "⏳ Menyimpan...";

    }


    tampilkanPesan(
        "⏳ Menyimpan perkembangan siswa..."
    );


    try {

        // ====================================================
        // POST KE APPS SCRIPT
        // ====================================================

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
                                "simpanPerkembangan",

                            data:
                                data

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server tidak merespons dengan benar."
            );

        }


        const hasil =
            await response.json();


        console.log(
            "HASIL SIMPAN:",
            hasil
        );


        if (
            !hasil ||
            !hasil.status
        ) {

            throw new Error(
                hasil && hasil.pesan
                    ? hasil.pesan
                    : "Data gagal disimpan."
            );

        }


        // ====================================================
        // SIMPAN DATA TERAKHIR DI MEMORY
        // ====================================================

        dataPerkembanganSaatIni =
            data;


        // ====================================================
        // UPDATE AREA CETAK
        // ====================================================

        isiCetak(
            data
        );


        // ====================================================
        // AMBIL ULANG DATA DARI SERVER
        // ====================================================

        try {

            await ambilSemuaPerkembangan();

        }

        catch (
            refreshError
        ) {

            console.warn(
                "Data tersimpan tetapi refresh gagal:",
                refreshError
            );

        }


        tampilkanPesan(
            "✅ " +
            (
                hasil.pesan ||
                "Perkembangan siswa berhasil disimpan."
            )
        );


    }

    catch (error) {

        console.error(
            "ERROR SIMPAN:",
            error
        );


        tampilkanPesan(
            "❌ Gagal menyimpan: " +
            error.message
        );

    }

    finally {

        if (btn) {

            btn.disabled =
                false;

            btn.textContent =
                "💾 Simpan Perkembangan";

        }

    }

}


// ============================================================
// ISI AREA CETAK
// ============================================================

function isiCetak(
    data
) {

    if (!data) {

        data = {};

    }


    // ========================================================
    // IDENTITAS
    // ========================================================

    const cetakNama =
        document.getElementById(
            "cetakNama"
        );


    if (cetakNama) {

        cetakNama.textContent =
            data.nama || "-";

    }


    const cetakNisn =
        document.getElementById(
            "cetakNisn"
        );


    if (cetakNisn) {

        cetakNisn.textContent =
            data.nisn || "-";

    }


    // ========================================================
    // TANDA CENTANG NILAI
    // ========================================================

    aspek.forEach(
        function (item) {

            const nilai =
                String(
                    data[item.key] || ""
                );


            for (
                let skor = 1;
                skor <= 4;
                skor++
            ) {

                const cell =
                    document.getElementById(
                        "cetak_" +
                        item.key +
                        "_" +
                        skor
                    );


                if (cell) {

                    cell.textContent =
                        nilai ===
                        String(skor)
                            ? "✓"
                            : "";

                }

            }

        }
    );


    // ========================================================
    // CATATAN
    // ========================================================

    const cetakKelebihan =
        document.getElementById(
            "cetakKelebihan"
        );


    if (cetakKelebihan) {

        cetakKelebihan.textContent =
            data.kelebihan || "";

    }


    const cetakPerlu =
        document.getElementById(
            "cetakPerluDikembangkan"
        );


    if (cetakPerlu) {

        cetakPerlu.textContent =
            data.perluDikembangkan || "";

    }


    const cetakSaran =
        document.getElementById(
            "cetakSaran"
        );


    if (cetakSaran) {

        cetakSaran.textContent =
            data.saranTindakLanjut || "";

    }


    const cetakCatatan =
        document.getElementById(
            "cetakCatatan"
        );


    if (cetakCatatan) {

        cetakCatatan.textContent =
            data.catatanGuru || "";

    }

}


// ============================================================
// CETAK PERKEMBANGAN
// ============================================================

function cetakPerkembangan() {

    // ========================================================
    // AMBIL IDENTITAS DARI FORM
    // ========================================================

    const pilihSiswa =
        document.getElementById(
            "pilihSiswa"
        );


    const nisnInput =
        document.getElementById(
            "nisnSiswa"
        );


    const namaInput =
        document.getElementById(
            "namaSiswa"
        );


    let nama =
        "";


    let nisn =
        "";


    // ========================================================
    // NISN
    // ========================================================

    if (nisnInput) {

        nisn =
            String(
                nisnInput.value || ""
            ).trim();

    }


    // ========================================================
    // NAMA DARI INPUT SISWA
    // ========================================================

    if (namaInput) {

        nama =
            String(
                namaInput.value || ""
            ).trim();

    }


    // ========================================================
    // NAMA DARI DROPDOWN GURU
    // ========================================================

    if (
        !nama &&
        pilihSiswa &&
        pilihSiswa.selectedIndex >= 0
    ) {

        const option =
            pilihSiswa.options[
                pilihSiswa.selectedIndex
            ];


        if (
            option &&
            option.value
        ) {

            nama =
                String(
                    option.textContent ||
                    ""
                ).trim();

            if (!nisn) {

                nisn =
                    String(
                        option.value ||
                        ""
                    ).trim();

            }

        }

    }


    // ========================================================
    // JIKA ADA DATA YANG SUDAH DISIMPAN
    // ========================================================

    if (
        dataPerkembanganSaatIni
    ) {

        if (!nama) {

            nama =
                dataPerkembanganSaatIni.nama ||
                "";

        }


        if (!nisn) {

            nisn =
                dataPerkembanganSaatIni.nisn ||
                "";

        }

    }


    // ========================================================
    // UNTUK SISWA, AMBIL DARI LOCALSTORAGE
    // ========================================================

    if (
        role === "siswa" ||
        role === "student" ||
        role === "murid"
    ) {

        if (!nisn) {

            nisn =
                String(
                    localStorage.getItem(
                        "nisn"
                    ) || ""
                ).trim();

        }


        if (!nama) {

            nama =
                String(
                    localStorage.getItem(
                        "namaSiswa"
                    ) || ""
                ).trim();

        }

    }


    // ========================================================
    // VALIDASI
    // ========================================================

    if (
        !nama &&
        !nisn
    ) {

        alert(
            "Data siswa belum dipilih."
        );

        return;

    }


    // ========================================================
    // AMBIL DATA FORM TERKINI
    //
    // Ini penting:
    // Guru bisa langsung mencetak walaupun
    // belum menekan tombol Simpan.
    // ========================================================

    const dataCetak =
        kumpulkanDataForm();


    dataCetak.nama =
        nama || dataCetak.nama;


    dataCetak.nisn =
        nisn || dataCetak.nisn;


    // ========================================================
    // UPDATE AREA CETAK
    // ========================================================

    isiCetak(
        dataCetak
    );


    // ========================================================
    // CETAK
    // ========================================================

    setTimeout(
        function () {

            window.print();

        },
        150
    );

}


// ============================================================
// KUMPULKAN DATA FORM
// ============================================================

function kumpulkanDataForm() {

    const data = {

        nama:
            "",

        nisn:
            "",

        kelebihan:
            "",

        perluDikembangkan:
            "",

        saranTindakLanjut:
            "",

        catatanGuru:
            ""

    };


    // ========================================================
    // NAMA
    // ========================================================

    const namaInput =
        document.getElementById(
            "namaSiswa"
        );


    if (
        namaInput &&
        namaInput.value.trim()
    ) {

        data.nama =
            namaInput.value.trim();

    }


    // Jika belum ada, ambil dropdown
    if (!data.nama) {

        const pilihSiswa =
            document.getElementById(
                "pilihSiswa"
            );


        if (
            pilihSiswa &&
            pilihSiswa.selectedIndex >= 0
        ) {

            const option =
                pilihSiswa.options[
                    pilihSiswa.selectedIndex
                ];


            if (
                option &&
                option.value
            ) {

                data.nama =
                    String(
                        option.textContent ||
                        ""
                    ).trim();

            }

        }

    }


    // ========================================================
    // NISN
    // ========================================================

    const nisnInput =
        document.getElementById(
            "nisnSiswa"
        );


    if (nisnInput) {

        data.nisn =
            nisnInput.value.trim();

    }


    // ========================================================
    // CATATAN
    // ========================================================

    const kelebihan =
        document.getElementById(
            "kelebihan"
        );


    if (kelebihan) {

        data.kelebihan =
            kelebihan.value;

    }


    const perlu =
        document.getElementById(
            "perluDikembangkan"
        );


    if (perlu) {

        data.perluDikembangkan =
            perlu.value;

    }


    const saran =
        document.getElementById(
            "saranTindakLanjut"
        );


    if (saran) {

        data.saranTindakLanjut =
            saran.value;

    }


    const catatan =
        document.getElementById(
            "catatanGuru"
        );


    if (catatan) {

        data.catatanGuru =
            catatan.value;

    }


    // ========================================================
    // NILAI ASPEK
    // ========================================================

    aspek.forEach(
        function (item) {

            const select =
                document.getElementById(
                    "nilai_" +
                    item.key
                );


            data[item.key] =
                select
                    ? String(
                        select.value || ""
                    )
                    : "";

        }
    );


    return data;

}


// ============================================================
// TAMPILKAN PESAN
// ============================================================

function tampilkanPesan(
    teks
) {

    const pesan =
        document.getElementById(
            "pesan"
        );


    if (pesan) {

        pesan.textContent =
            teks;

    }

}


// ============================================================
// SELESAI
// ============================================================

console.log(
    "✅ perkembangan.js VERSI FINAL berhasil dimuat."
);
