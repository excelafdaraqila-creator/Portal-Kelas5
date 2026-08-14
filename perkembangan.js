// ============================================================
// PERKEMBANGAN.JS
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ============================================================


// ============================================================
// API GOOGLE APPS SCRIPT
// ============================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


// ============================================================
// DATA ASPEK
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
// VARIABEL
// ============================================================

let role = "";

let siswaData = [];

let dataPerkembanganSaatIni = null;


// ============================================================
// SAAT HALAMAN SIAP
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "PERKEMBANGAN.JS AKTIF"
        );

        buatTabelAspek();

        tentukanRole();

    }
);


// ============================================================
// TENTUKAN ROLE
// ============================================================

function tentukanRole() {

    role =
        (
            localStorage.getItem("role") ||
            ""
        )
        .trim()
        .toLowerCase();


    console.log(
        "ROLE:",
        role
    );


    if (
        role === "guru"
    ) {

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
        document.getElementById(
            "pilihSiswa"
        );


    if (!select) {
        return;
    }


    select.classList.remove(
        "hidden"
    );


    document
        .getElementById("namaSiswa")
        .classList.add("hidden");


    try {

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

    }

    catch (error) {

        console.error(error);

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
            "Gagal mengambil siswa."
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


    select.innerHTML =
        `<option value="">
            -- Pilih Siswa --
        </option>`;


    data.forEach(
        function (siswa) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                siswa.NISN || siswa.nisn || "";


            option.textContent =
                siswa.NAMA || siswa.nama || "-";


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


    window.semuaPerkembangan =
        data;

}


// ============================================================
// PILIH SISWA GURU
// ============================================================

function pilihSiswaGuru(nisn) {

    if (!nisn) {

        kosongkanForm();

        return;

    }


    const siswa =
        siswaData.find(
            function (item) {

                return String(
                    item.NISN ||
                    item.nisn ||
                    ""
                ).trim()
                ===
                String(nisn).trim();

            }
        );


    if (!siswa) {
        return;
    }


    const nama =
        siswa.NAMA ||
        siswa.nama ||
        "";


    document
        .getElementById("nisnSiswa")
        .value =
        nisn;


    const perkembangan =
        (
            window.semuaPerkembangan ||
            []
        ).find(
            function (item) {

                return String(
                    item.nisn || ""
                ).trim()
                ===
                String(nisn).trim();

            }
        );


    if (perkembangan) {

        isiForm(
            perkembangan
        );

        dataPerkembanganSaatIni =
            perkembangan;

        tampilkanPesan(
            "📋 Data perkembangan siswa ditemukan dan dimuat."
        );

    }

    else {

        kosongkanPenilaian();

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
        localStorage.getItem(
            "nisn"
        ) || "";


    const nama =
        localStorage.getItem(
            "namaSiswa"
        ) || "";


    document
        .getElementById("pilihSiswa")
        .classList.add(
            "hidden"
        );


    const inputNama =
        document.getElementById(
            "namaSiswa"
        );


    inputNama
        .classList.remove(
            "hidden"
        );


    inputNama.value =
        nama;


    document
        .getElementById("nisnSiswa")
        .value =
        nisn;


    // Siswa tidak boleh mengedit
    // perkembangan

    document
        .getElementById("btnSimpan")
        .classList.add(
            "hidden"
        );


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


    document
        .getElementById("kelebihan")
        .readOnly = true;


    document
        .getElementById("perluDikembangkan")
        .readOnly = true;


    document
        .getElementById("saranTindakLanjut")
        .readOnly = true;


    document
        .getElementById("catatanGuru")
        .readOnly = true;


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

async function ambilPerkembanganSiswa(nisn) {

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

        console.error(error);

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


    tbody.innerHTML = "";

    tbodyCetak.innerHTML = "";


    aspek.forEach(
        function (item, index) {

            // =========================
            // FORM GURU / SISWA
            // =========================

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


            // =========================
            // TABEL CETAK
            // =========================

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
                >
                </td>

                <td
                    class="center"
                    id="cetak_${item.key}_3"
                >
                </td>

                <td
                    class="center"
                    id="cetak_${item.key}_2"
                >
                </td>

                <td
                    class="center"
                    id="cetak_${item.key}_1"
                >
                </td>

            `;


            tbodyCetak.appendChild(
                trCetak
            );

        }
    );

}


// ============================================================
// ISI FORM
// ============================================================

function isiForm(data) {

    aspek.forEach(
        function (item) {

            const select =
                document.getElementById(
                    "nilai_" +
                    item.key
                );


            if (select) {

                select.value =
                    data[item.key] || "";

            }

        }
    );


    document
        .getElementById("kelebihan")
        .value =
        data.kelebihan || "";


    document
        .getElementById("perluDikembangkan")
        .value =
        data.perluDikembangkan || "";


    document
        .getElementById("saranTindakLanjut")
        .value =
        data.saranTindakLanjut || "";


    document
        .getElementById("catatanGuru")
        .value =
        data.catatanGuru || "";


    isiCetak(
        data
    );

}


// ============================================================
// KOSONGKAN FORM
// ============================================================

function kosongkanForm() {

    document
        .getElementById("nisnSiswa")
        .value = "";


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


    document
        .getElementById("kelebihan")
        .value = "";


    document
        .getElementById("perluDikembangkan")
        .value = "";


    document
        .getElementById("saranTindakLanjut")
        .value = "";


    document
        .getElementById("catatanGuru")
        .value = "";


    isiCetak({});

}


// ============================================================
// SIMPAN
// ============================================================

async function simpanData() {

    if (role !== "guru") {

        alert(
            "Hanya guru yang dapat menyimpan perkembangan."
        );

        return;

    }


    const nisn =
        document
            .getElementById("nisnSiswa")
            .value.trim();


    const select =
        document.getElementById(
            "pilihSiswa"
        );


    const nama =
        select.options[
            select.selectedIndex
        ]?.text || "";


    if (!nisn) {

        alert(
            "Silakan pilih siswa terlebih dahulu."
        );

        return;

    }


    // ========================================================
    // KUMPULKAN NILAI
    // ========================================================

    const data = {

        nisn: nisn,

        nama: nama

    };


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
            selectNilai.value;

    }


    data.kelebihan =
        document
            .getElementById("kelebihan")
            .value.trim();


    data.perluDikembangkan =
        document
            .getElementById(
                "perluDikembangkan"
            )
            .value.trim();


    data.saranTindakLanjut =
        document
            .getElementById(
                "saranTindakLanjut"
            )
            .value.trim();


    data.catatanGuru =
        document
            .getElementById(
                "catatanGuru"
            )
            .value.trim();


    // ========================================================
    // CEK NILAI
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
                "Penilaian \"" +
                item.nama +
                "\" belum diisi."
            );

            return;

        }

    }


    const btn =
        document.getElementById(
            "btnSimpan"
        );


    btn.disabled = true;

    btn.textContent =
        "⏳ Menyimpan...";


    tampilkanPesan(
        "⏳ Menyimpan perkembangan siswa..."
    );


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

                    body: JSON.stringify({

                        action:
                            "simpanPerkembangan",

                        data:
                            data

                    })

                }
            );


        const hasil =
            await response.json();


        console.log(
            "HASIL SIMPAN:",
            hasil
        );


        if (
            !hasil.status
        ) {

            throw new Error(
                hasil.pesan ||
                "Gagal menyimpan."
            );

        }


        tampilkanPesan(
            "✅ " +
            hasil.pesan
        );


        await ambilSemuaPerkembangan();


        dataPerkembanganSaatIni =
            data;


        isiCetak(
            data
        );

    }

    catch (error) {

        console.error(
            error
        );


        tampilkanPesan(
            "❌ Gagal menyimpan: " +
            error.message
        );

    }

    finally {

        btn.disabled =
            false;

        btn.textContent =
            "💾 Simpan Perkembangan";

    }

}


// ============================================================
// ISI DATA CETAK
// ============================================================

function isiCetak(data) {

    document
        .getElementById("cetakNama")
        .textContent =
        data.nama || "";


    document
        .getElementById("cetakNisn")
        .textContent =
        data.nisn || "";


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


    document
        .getElementById(
            "cetakKelebihan"
        )
        .textContent =
        data.kelebihan || "";


    document
        .getElementById(
            "cetakPerluDikembangkan"
        )
        .textContent =
        data.perluDikembangkan || "";


    document
        .getElementById(
            "cetakSaran"
        )
        .textContent =
        data.saranTindakLanjut || "";


    document
        .getElementById(
            "cetakCatatan"
        )
        .textContent =
        data.catatanGuru || "";

}


// ============================================================
// CETAK F4
// ============================================================

function cetakPerkembangan() {

    /* =====================================================
       AMBIL DATA SISWA DARI HALAMAN
    ===================================================== */

    const pilihSiswa =
        document.getElementById("pilihSiswa");

    const nisnInput =
        document.getElementById("nisnSiswa");

    const namaInput =
        document.getElementById("namaSiswa");


    /* =====================================================
       AMBIL NILAI YANG SEDANG TAMPIL
       Tidak harus sudah disimpan ke Spreadsheet
    ===================================================== */

    let nama = "";

    let nisn = "";


    if (namaInput) {

        nama =
            String(
                namaInput.value || ""
            ).trim();

    }


    if (nisnInput) {

        nisn =
            String(
                nisnInput.value || ""
            ).trim();

    }


    /* =====================================================
       JIKA INPUT NAMA BELUM TERISI,
       COBA AMBIL DARI SELECT SISWA
    ===================================================== */

    if (!nama && pilihSiswa) {

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
                    option.textContent || ""
                ).trim();

        }

    }


    /* =====================================================
       CEK DATA SISWA
    ===================================================== */

    if (!nama && !nisn) {

        alert(
            "Data siswa belum dipilih."
        );

        return;

    }


    /* =====================================================
       TAMPILKAN IDENTITAS KE AREA CETAK
    ===================================================== */

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


    /* =====================================================
       SALIN CATATAN KE AREA CETAK
    ===================================================== */

    const kelebihan =
        document.getElementById(
            "kelebihan"
        );

    const perluDikembangkan =
        document.getElementById(
            "perluDikembangkan"
        );

    const saranTindakLanjut =
        document.getElementById(
            "saranTindakLanjut"
        );

    const catatanGuru =
        document.getElementById(
            "catatanGuru"
        );


    const cetakKelebihan =
        document.getElementById(
            "cetakKelebihan"
        );

    const cetakPerlu =
        document.getElementById(
            "cetakPerluDikembangkan"
        );

    const cetakSaran =
        document.getElementById(
            "cetakSaran"
        );

    const cetakCatatan =
        document.getElementById(
            "cetakCatatan"
        );


    if (cetakKelebihan) {

        cetakKelebihan.textContent =
            kelebihan
                ? kelebihan.value
                : "";

    }


    if (cetakPerlu) {

        cetakPerlu.textContent =
            perluDikembangkan
                ? perluDikembangkan.value
                : "";

    }


    if (cetakSaran) {

        cetakSaran.textContent =
            saranTindakLanjut
                ? saranTindakLanjut.value
                : "";

    }


    if (cetakCatatan) {

        cetakCatatan.textContent =
            catatanGuru
                ? catatanGuru.value
                : "";

    }


    /* =====================================================
       SIAPKAN TABEL PENILAIAN UNTUK CETAK
    ===================================================== */

    const tabelAspek =
        document.getElementById(
            "tabelAspek"
        );

    const tabelCetak =
        document.getElementById(
            "tabelCetakAspek"
        );


    if (
        tabelAspek &&
        tabelCetak
    ) {

        tabelCetak.innerHTML = "";


        const rows =
            tabelAspek.querySelectorAll(
                "tr"
            );


        rows.forEach(function(row) {

            const cells =
                row.querySelectorAll(
                    "td"
                );


            if (
                cells.length < 4
            ) {

                return;

            }


            const nomor =
                cells[0].textContent.trim();

            const aspek =
                cells[1].textContent.trim();

            const indikator =
                cells[2].textContent.trim();


            const select =
                cells[3].querySelector(
                    "select"
                );


            let skor = "";


            if (select) {

                skor =
                    String(
                        select.value || ""
                    ).trim();

            }


            /* ---------------------------------------------
               BUAT BARIS CETAK
            --------------------------------------------- */

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td class="center">
                    ${nomor}
                </td>

                <td>
                    ${aspek}
                </td>

                <td>
                    ${indikator}
                </td>

                <td class="center">
                    ${skor === "4" ? "✓" : ""}
                </td>

                <td class="center">
                    ${skor === "3" ? "✓" : ""}
                </td>

                <td class="center">
                    ${skor === "2" ? "✓" : ""}
                </td>

                <td class="center">
                    ${skor === "1" ? "✓" : ""}
                </td>

            `;


            tabelCetak.appendChild(
                tr
            );

        });

    }


    /* =====================================================
       CETAK
    ===================================================== */

    setTimeout(function() {

        window.print();

    }, 150);

}

// ============================================================
// KUMPULKAN FORM UNTUK CETAK
// ============================================================

function kumpulkanDataForm() {

    const data = {

        nama:
            document
                .getElementById(
                    "namaSiswa"
                )
                .value ||
            document
                .getElementById(
                    "pilihSiswa"
                )
                .options[
                    document
                        .getElementById(
                            "pilihSiswa"
                        )
                        .selectedIndex
                ]?.text ||
            "",

        nisn:
            document
                .getElementById(
                    "nisnSiswa"
                )
                .value,

        kelebihan:
            document
                .getElementById(
                    "kelebihan"
                )
                .value,

        perluDikembangkan:
            document
                .getElementById(
                    "perluDikembangkan"
                )
                .value,

        saranTindakLanjut:
            document
                .getElementById(
                    "saranTindakLanjut"
                )
                .value,

        catatanGuru:
            document
                .getElementById(
                    "catatanGuru"
                )
                .value

    };


    aspek.forEach(
        function (item) {

            data[item.key] =
                document
                    .getElementById(
                        "nilai_" +
                        item.key
                    )
                    .value;

        }
    );


    return data;

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
// SELESAI
// ============================================================

console.log(
    "✅ perkembangan.js berhasil dimuat."
);
