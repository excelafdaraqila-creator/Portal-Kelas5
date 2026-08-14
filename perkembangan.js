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
// DATA ASPEK PENILAIAN
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
// HALAMAN SIAP
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("PERKEMBANGAN.JS FINAL AKTIF");
    console.log("=================================");

    buatTabelAspek();

    tentukanRole();

});


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


    console.log("ROLE:", role);


    if (role === "guru") {

        modeGuru();

    }

    else if (
        role === "siswa" ||
        role === "student" ||
        role === "murid"
    ) {

        modeSiswa();

    }

    else {

        tampilkanPesan(
            "❌ Login tidak ditemukan. Silakan login kembali."
        );

    }

}


// ============================================================
// MODE GURU
// ============================================================

async function modeGuru() {

    const select =
        document.getElementById("pilihSiswa");

    if (!select) {
        return;
    }


    select.classList.remove("hidden");


    const namaInput =
        document.getElementById("namaSiswa");

    if (namaInput) {
        namaInput.classList.add("hidden");
    }


    try {

        tampilkanPesan(
            "⏳ Memuat data siswa..."
        );


        await ambilDaftarSiswa();


        await ambilSemuaPerkembangan();


        select.addEventListener(
            "change",
            function () {

                pilihSiswaGuru(
                    this.value
                );

            }
        );


        tampilkanPesan(
            "✅ Data siswa siap digunakan."
        );

    }

    catch (error) {

        console.error(
            "ERROR MODE GURU:",
            error
        );


        tampilkanPesan(
            "❌ Gagal mengambil data siswa."
        );

    }

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
        await fetch(url);


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


    siswaData = data;


    const select =
        document.getElementById(
            "pilihSiswa"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">-- Pilih Siswa --</option>';


    data.forEach(
        function (siswa) {

            const nisn =
                siswa.NISN ??
                siswa.nisn ??
                "";


            const nama =
                siswa.NAMA ??
                siswa.nama ??
                "-";


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(nisn).trim();


            option.textContent =
                String(nama).trim();


            select.appendChild(
                option
            );

        }
    );

}


// ============================================================
// AMBIL SEMUA DATA PERKEMBANGAN
// ============================================================

async function ambilSemuaPerkembangan() {

    const url =
        API_URL +
        "?action=perkembangan&nocache=" +
        Date.now();


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Gagal mengambil perkembangan."
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
// PILIH SISWA GURU
// ============================================================

function pilihSiswaGuru(nisn) {

    nisn =
        String(nisn || "").trim();


    if (!nisn) {

        kosongkanForm();

        return;

    }


    const siswa =
        siswaData.find(
            function (item) {

                const nomor =
                    item.NISN ??
                    item.nisn ??
                    "";


                return String(nomor)
                    .trim() === nisn;

            }
        );


    if (!siswa) {

        console.warn(
            "Siswa tidak ditemukan:",
            nisn
        );

        return;

    }


    const nama =
        siswa.NAMA ??
        siswa.nama ??
        "";


    // --------------------------------------------------------
    // TAMPILKAN NISN
    // --------------------------------------------------------

    const inputNisn =
        document.getElementById(
            "nisnSiswa"
        );


    if (inputNisn) {

        inputNisn.value =
            nisn;

    }


    // --------------------------------------------------------
    // CARI PERKEMBANGAN YANG SUDAH TERSIMPAN
    // --------------------------------------------------------

    const perkembangan =
        semuaPerkembangan.find(
            function (item) {

                const nomor =
                    item.nisn ??
                    item.NISN ??
                    "";


                return String(nomor)
                    .trim() === nisn;

            }
        );


    if (perkembangan) {

        dataPerkembanganSaatIni =
            perkembangan;


        // Pastikan nama tersedia
        if (!perkembangan.nama) {

            perkembangan.nama =
                nama;

        }


        isiForm(
            perkembangan
        );


        tampilkanPesan(
            "📋 Data perkembangan siswa ditemukan dan dimuat."
        );

    }

    else {

        dataPerkembanganSaatIni = {

            nisn: nisn,

            nama: nama

        };


        kosongkanPenilaian();


        // Tetap isi identitas cetak
        isiIdentitasCetak(
            nama,
            nisn
        );


        tampilkanPesan(
            "ℹ️ Belum ada perkembangan untuk siswa ini. Silakan isi penilaian."
        );

    }

}


// ============================================================
// MODE SISWA
// ============================================================

async function modeSiswa() {

    const nisn =
        String(
            localStorage.getItem("nisn") || ""
        ).trim();


    const nama =
        localStorage.getItem(
            "namaSiswa"
        ) || "";


    const pilih =
        document.getElementById(
            "pilihSiswa"
        );


    if (pilih) {

        pilih.classList.add(
            "hidden"
        );

    }


    const inputNama =
        document.getElementById(
            "namaSiswa"
        );


    if (inputNama) {

        inputNama.classList.remove(
            "hidden"
        );


        inputNama.value =
            nama;

    }


    const inputNisn =
        document.getElementById(
            "nisnSiswa"
        );


    if (inputNisn) {

        inputNisn.value =
            nisn;

    }


    // --------------------------------------------------------
    // SISWA TIDAK BOLEH EDIT
    // --------------------------------------------------------

    const btnSimpan =
        document.getElementById(
            "btnSimpan"
        );


    if (btnSimpan) {

        btnSimpan.classList.add(
            "hidden"
        );

    }


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


    [
        "kelebihan",
        "perluDikembangkan",
        "saranTindakLanjut",
        "catatanGuru"
    ]
    .forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (element) {

                element.readOnly =
                    true;

            }

        }
    );


    if (!nisn) {

        tampilkanPesan(
            "❌ NISN tidak ditemukan. Silakan login kembali."
        );

        return;

    }


    await ambilPerkembanganSiswa(
        nisn
    );

}


// ============================================================
// AMBIL PERKEMBANGAN SISWA
// ============================================================

async function ambilPerkembanganSiswa(
    nisn
) {

    try {

        const url =
            API_URL +
            "?action=perkembangan" +
            "&nisn=" +
            encodeURIComponent(nisn) +
            "&nocache=" +
            Date.now();


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Gagal mengambil data."
            );

        }


        const data =
            await response.json();


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

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
            "✅ Data perkembangan berhasil dimuat."
        );

    }

    catch (error) {

        console.error(
            "ERROR AMBIL PERKEMBANGAN:",
            error
        );


        tampilkanPesan(
            "❌ Gagal mengambil perkembangan."
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


            tr.innerHTML = `

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


                trCetak.innerHTML = `

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
// ISI FORM DARI DATA TERSIMPAN
// ============================================================

function isiForm(data) {

    if (!data) {
        return;
    }


    // --------------------------------------------------------
    // IDENTITAS
    // --------------------------------------------------------

    const nisn =
        data.nisn ??
        data.NISN ??
        "";


    const nama =
        data.nama ??
        data.NAMA ??
        "";


    const inputNisn =
        document.getElementById(
            "nisnSiswa"
        );


    if (inputNisn) {

        inputNisn.value =
            nisn;

    }


    isiIdentitasCetak(
        nama,
        nisn
    );


    // --------------------------------------------------------
    // NILAI 15 ASPEK
    // --------------------------------------------------------

    aspek.forEach(
        function (item) {

            const select =
                document.getElementById(
                    "nilai_" +
                    item.key
                );


            if (select) {

                select.value =
                    data[item.key] ?? "";

            }

        }
    );


    // --------------------------------------------------------
    // CATATAN
    // --------------------------------------------------------

    const kelebihan =
        document.getElementById(
            "kelebihan"
        );


    if (kelebihan) {

        kelebihan.value =
            data.kelebihan ?? "";

    }


    const perlu =
        document.getElementById(
            "perluDikembangkan"
        );


    if (perlu) {

        perlu.value =
            data.perluDikembangkan ?? "";

    }


    const saran =
        document.getElementById(
            "saranTindakLanjut"
        );


    if (saran) {

        saran.value =
            data.saranTindakLanjut ?? "";

    }


    const catatan =
        document.getElementById(
            "catatanGuru"
        );


    if (catatan) {

        catatan.value =
            data.catatanGuru ?? "";

    }


    // --------------------------------------------------------
    // UPDATE CETAK
    // --------------------------------------------------------

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


    [
        "kelebihan",
        "perluDikembangkan",
        "saranTindakLanjut",
        "catatanGuru"
    ]
    .forEach(
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


    isiCetak({});

}


// ============================================================
// KUMPULKAN DATA FORM
// ============================================================

function kumpulkanDataForm() {

    const data = {

        nisn:
            document
                .getElementById(
                    "nisnSiswa"
                )
                ?.value
                .trim() || "",


        nama:
            ambilNamaSiswa() || "",


        kelebihan:
            document
                .getElementById(
                    "kelebihan"
                )
                ?.value
                .trim() || "",


        perluDikembangkan:
            document
                .getElementById(
                    "perluDikembangkan"
                )
                ?.value
                .trim() || "",


        saranTindakLanjut:
            document
                .getElementById(
                    "saranTindakLanjut"
                )
                ?.value
                .trim() || "",


        catatanGuru:
            document
                .getElementById(
                    "catatanGuru"
                )
                ?.value
                .trim() || ""

    };


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
                    ).trim()
                    : "";

        }
    );


    return data;

}


// ============================================================
// AMBIL NAMA SISWA
// ============================================================

function ambilNamaSiswa() {

    const pilih =
        document.getElementById(
            "pilihSiswa"
        );


    // --------------------------------------------------------
    // MODE GURU
    // --------------------------------------------------------

    if (
        pilih &&
        !pilih.classList.contains("hidden") &&
        pilih.value
    ) {

        const option =
            pilih.options[
                pilih.selectedIndex
            ];


        if (option) {

            return String(
                option.textContent || ""
            ).trim();

        }

    }


    // --------------------------------------------------------
    // MODE SISWA
    // --------------------------------------------------------

    const namaInput =
        document.getElementById(
            "namaSiswa"
        );


    if (
        namaInput &&
        namaInput.value
    ) {

        return String(
            namaInput.value
        ).trim();

    }


    // --------------------------------------------------------
    // DATA SEBELUMNYA
    // --------------------------------------------------------

    if (
        dataPerkembanganSaatIni &&
        dataPerkembanganSaatIni.nama
    ) {

        return String(
            dataPerkembanganSaatIni.nama
        ).trim();

    }


    return "";

}


// ============================================================
// SIMPAN DATA
// ============================================================

async function simpanData() {

    if (role !== "guru") {

        alert(
            "Hanya guru yang dapat menyimpan perkembangan."
        );

        return;

    }


    const data =
        kumpulkanDataForm();


    // ========================================================
    // CEK SISWA
    // ========================================================

    if (!data.nisn) {

        alert(
            "Silakan pilih siswa terlebih dahulu."
        );

        return;

    }


    if (!data.nama) {

        alert(
            "Nama siswa belum ditemukan."
        );

        return;

    }


    // ========================================================
    // CEK 15 PENILAIAN
    // ========================================================

    for (
        let i = 0;
        i < aspek.length;
        i++
    ) {

        const item =
            aspek[i];


        if (!data[item.key]) {

            alert(
                'Penilaian "' +
                item.nama +
                '" belum diisi.'
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
        // KIRIM KE GOOGLE APPS SCRIPT
        // ====================================================

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


        // ====================================================
        // CEK HASIL
        // ====================================================

        if (
            !hasil ||
            hasil.status !== true
        ) {

            throw new Error(
                hasil?.pesan ||
                hasil?.message ||
                "Data gagal disimpan."
            );

        }


        // ====================================================
        // SIMPAN DATA TERAKHIR DI MEMORY
        // ====================================================

        dataPerkembanganSaatIni =
            {
                ...data
            };


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

        catch (refreshError) {

            console.warn(
                "Data berhasil disimpan, tetapi refresh data gagal:",
                refreshError
            );

        }


        // ====================================================
        // PESAN BERHASIL
        // ====================================================

        tampilkanPesan(
            "✅ Perkembangan siswa berhasil disimpan. Sekarang Anda dapat mencetak."
        );


        // ====================================================
        // ALERT SINGKAT
        // ====================================================

        alert(
            "✅ Data perkembangan berhasil disimpan.\n\nSilakan klik tombol Cetak F4."
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


        alert(
            "❌ Data belum berhasil disimpan.\n\n" +
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
// ISI IDENTITAS CETAK
// ============================================================

function isiIdentitasCetak(
    nama,
    nisn
) {

    const cetakNama =
        document.getElementById(
            "cetakNama"
        );


    const cetakNisn =
        document.getElementById(
            "cetakNisn"
        );


    if (cetakNama) {

        cetakNama.textContent =
            nama || "-";

    }


    if (cetakNisn) {

        cetakNisn.textContent =
            nisn || "-";

    }

}


// ============================================================
// ISI AREA CETAK
// ============================================================

function isiCetak(data) {

    if (!data) {
        data = {};
    }


    const nama =
        data.nama ??
        data.NAMA ??
        ambilNamaSiswa() ??
        "";


    const nisn =
        data.nisn ??
        data.NISN ??
        document
            .getElementById("nisnSiswa")
            ?.value ??
        "";


    isiIdentitasCetak(
        nama,
        nisn
    );


    // ========================================================
    // CEK 15 SKOR
    // ========================================================

    aspek.forEach(
        function (item) {

            const nilai =
                String(
                    data[item.key] ?? ""
                ).trim();


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
            data.kelebihan ?? "";

    }


    const cetakPerlu =
        document.getElementById(
            "cetakPerluDikembangkan"
        );


    if (cetakPerlu) {

        cetakPerlu.textContent =
            data.perluDikembangkan ?? "";

    }


    const cetakSaran =
        document.getElementById(
            "cetakSaran"
        );


    if (cetakSaran) {

        cetakSaran.textContent =
            data.saranTindakLanjut ?? "";

    }


    const cetakCatatan =
        document.getElementById(
            "cetakCatatan"
        );


    if (cetakCatatan) {

        cetakCatatan.textContent =
            data.catatanGuru ?? "";

    }

}


// ============================================================
// CETAK PERKEMBANGAN
// ============================================================

function cetakPerkembangan() {

    console.log(
        "================================="
    );

    console.log(
        "PROSES CETAK PERKEMBANGAN"
    );

    console.log(
        "================================="
    );


    // ========================================================
    // PENTING:
    // CETAK MENGAMBIL DATA YANG SEDANG TAMPIL
    // TIDAK PERLU REQUEST KE SERVER LAGI
    // ========================================================

    const data =
        kumpulkanDataForm();


    console.log(
        "DATA CETAK:",
        data
    );


    // ========================================================
    // CEK SISWA
    // ========================================================

    if (!data.nisn && !data.nama) {

        alert(
            "Data siswa belum dipilih."
        );

        return;

    }


    // ========================================================
    // CEK 15 NILAI
    // ========================================================

    const belumDiisi = [];


    aspek.forEach(
        function (item) {

            if (!data[item.key]) {

                belumDiisi.push(
                    item.nama
                );

            }

        }
    );


    // ========================================================
    // JIKA MASIH ADA NILAI KOSONG
    // ========================================================

    if (belumDiisi.length > 0) {

        const lanjut =
            confirm(
                "Masih ada penilaian yang belum diisi:\n\n" +
                belumDiisi.join("\n") +
                "\n\nTetap cetak?"
            );


        if (!lanjut) {

            return;

        }

    }


    // ========================================================
    // MASUKKAN DATA KE AREA CETAK
    // ========================================================

    isiCetak(
        data
    );


    // ========================================================
    // CETAK
    // ========================================================

    setTimeout(
        function () {

            window.print();

        },
        200
    );

}


// ============================================================
// PESAN
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
// DEBUG
// ============================================================

console.log(
    "✅ perkembangan.js FINAL berhasil dimuat."
);
