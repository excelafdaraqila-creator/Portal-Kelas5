//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// nilai.js VERSI 5.0
// Developer : Asep Jamhur
//====================================================


//====================================================
// KONFIGURASI API
//====================================================

const URL_API =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


//====================================================
// DATA LOGIN
//====================================================

const role =
    String(localStorage.getItem("role") || "").trim();

const nisnLogin =
    String(localStorage.getItem("nisn") || "").trim();

const namaGuru =
    String(localStorage.getItem("namaGuru") || "").trim();

const namaSiswa =
    String(localStorage.getItem("namaSiswa") || "").trim();


//====================================================
// CEK LOGIN
//====================================================

if (localStorage.getItem("login") !== "true") {

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}


//====================================================
// VARIABEL GLOBAL
//====================================================

let dataNilai = [];

let dataTampil = [];


//====================================================
// DEBUG
//====================================================

console.log("======================================");
console.log("PORTAL DIGITAL KELAS 5 SDN CIJEMBER");
console.log("nilai.js VERSI 5.0");
console.log("Role :", role);
console.log("NISN Login :", nisnLogin);
console.log("======================================");
//====================================================
// FUNGSI KONVERSI ANGKA
//====================================================

function angka(nilai) {

    if (nilai === null || nilai === undefined) {
        return 0;
    }

    if (typeof nilai === "number") {
        return nilai;
    }

    const teks = String(nilai).trim();

    if (teks === "") {
        return 0;
    }

    const hasil = Number(teks);

    if (Number.isNaN(hasil)) {
        return 0;
    }

    return hasil;
}


//====================================================
// AMBIL DATA NILAI DARI GOOGLE APPS SCRIPT
//====================================================

async function loadData() {

    const tbody =
        document.getElementById("tabelNilai");

    try {

        // Tampilkan loading
        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="15"
                        style="
                        text-align:center;
                        padding:30px;
                        color:#2563eb;
                        font-weight:bold;
                        ">
                        ⏳ Memuat data nilai...
                    </td>
                </tr>
            `;

        }


        console.log("Mengambil data dari API...");


        const response =
            await fetch(
                URL_API + "?action=nilai&v=" + Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " + response.status
            );

        }


        const json =
            await response.json();


        console.log(
            "Data API diterima:",
            json
        );


        //================================================
        // CEK DATA API
        //================================================

        if (!Array.isArray(json)) {

            throw new Error(
                "Format data API tidak berupa Array."
            );

        }


        if (json.length === 0) {

            if (tbody) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="15"
                            style="
                            text-align:center;
                            padding:30px;
                            color:red;
                            ">
                            Data nilai masih kosong.
                        </td>
                    </tr>
                `;

            }

            return;

        }


        //================================================
        // BERSIHKAN DATA LAMA
        //================================================

        dataNilai = [];


        //================================================
        // MASUKKAN DATA BARU
        //================================================

        json.forEach(function(item) {

            const siswa = {

                nama:
                    String(
                        item["NAMA"] || ""
                    ).trim(),

                nisn:
                    String(
                        item["NISN"] || ""
                    ).trim(),


                // PKN
                pancasila:
                    angka(item["PKN"]),


                // Bahasa Indonesia
                indo:
                    angka(item["B.IND"]),


                // Matematika
                mtk:
                    angka(item["MTK"]),


                // IPAS
                ipas:
                    angka(item["IPAS"]),


                // Bahasa Sunda
                sunda:
                    angka(item["B. SUNDA"]),


                // Bahasa Inggris
                inggris:
                    angka(item["B. INGGRIS"]),


                // KKA
                kka:
                    angka(item["KKA"]),


                // Seni Rupa
                seni:
                    angka(item["SENI RUPA"]),


                // PAI
                pai:
                    angka(item["PAI"]),


                // PJOK
                pjok:
                    angka(item["PJOK"])

            };


            dataNilai.push(siswa);

        });


        console.log(
            "Jumlah data siswa:",
            dataNilai.length
        );


        //================================================
        // CEK DATA SISWA PERTAMA
        //================================================

        console.log(
            "Contoh data siswa:",
            dataNilai[0]
        );


        //================================================
        // HITUNG NILAI
        //================================================

        hitungNilai();


    }
    catch (error) {

        console.error(
            "ERROR LOAD DATA:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="15"
                        style="
                        text-align:center;
                        padding:30px;
                        color:red;
                        ">
                        ❌ Gagal memuat data nilai.
                        <br>
                        Silakan refresh halaman.
                    </td>
                </tr>
            `;

        }

    }

}
//====================================================
// HITUNG NILAI
//====================================================

function hitungNilai() {

    //==================================================
    // HITUNG TOTAL DAN RATA-RATA
    //==================================================

    dataNilai.forEach(function(siswa) {

        siswa.total =

            siswa.mtk +

            siswa.pancasila +

            siswa.ipas +

            siswa.indo +

            siswa.sunda +

            siswa.pai +

            siswa.seni +

            siswa.inggris +

            siswa.kka +

            siswa.pjok;


        // 10 mata pelajaran

        siswa.rata =
            Number(
                (
                    siswa.total / 10
                ).toFixed(2)
            );


        //================================================
        // PREDIKAT
        //================================================

        if (siswa.rata >= 90) {

            siswa.predikat = "A";

        }
        else if (siswa.rata >= 80) {

            siswa.predikat = "B";

        }
        else if (siswa.rata >= 70) {

            siswa.predikat = "C";

        }
        else {

            siswa.predikat = "D";

        }

    });


    //==================================================
    // URUTKAN DARI NILAI TERTINGGI
    //==================================================

    dataNilai.sort(function(a, b) {

        return b.rata - a.rata;

    });


    //==================================================
    // RANKING
    //==================================================

    dataNilai.forEach(function(siswa, index) {

        siswa.ranking =
            index + 1;

    });


    //==================================================
    // FILTER SESUAI ROLE
    //==================================================

    if (role === "guru") {

        dataTampil =
            dataNilai.slice();

    }
    else {

        dataTampil =
            dataNilai.filter(function(siswa) {

                return (
                    String(siswa.nisn).trim()
                    ===
                    String(nisnLogin).trim()
                );

            });

    }


    console.log(
        "Jumlah data tampil:",
        dataTampil.length
    );


    //==================================================
    // TAMPILKAN TABEL
    //==================================================

    renderTabel(dataTampil);


    //==================================================
    // INFO DATA
    //==================================================

    updateInfo(
        dataTampil.length
    );

}


//====================================================
// INFO JUMLAH SISWA
//====================================================

function updateInfo(jumlah) {

    let info =
        document.getElementById("infoData");


    if (!info) {

        info =
            document.createElement("p");

        info.id =
            "infoData";

        info.style.margin =
            "10px 0";

        info.style.fontWeight =
            "bold";

        info.style.color =
            "#2563eb";


        const tabel =
            document.querySelector("table");


        if (tabel) {

            tabel.parentNode.insertBefore(
                info,
                tabel
            );

        }

    }


    if (role === "guru") {

        info.innerHTML =
            "Jumlah siswa : <b>" +
            jumlah +
            "</b>";

    }
    else {

        info.innerHTML =
            "📊 Data Nilai Saya";

    }

}
//====================================================
// RENDER TABEL
//====================================================

function renderTabel(data) {

    const tbody =
        document.getElementById(
            "tabelNilai"
        );


    if (!tbody) {

        console.error(
            "Element #tabelNilai tidak ditemukan."
        );

        return;

    }


    tbody.innerHTML = "";


    //==================================================
    // JIKA TIDAK ADA DATA
    //==================================================

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="15"
                    style="
                    text-align:center;
                    padding:30px;
                    color:red;
                    ">
                    Data nilai tidak ditemukan.
                </td>
            </tr>
        `;

        return;

    }


    //==================================================
    // TAMPILKAN DATA
    //==================================================

    data.forEach(function(siswa) {


        // Medali ranking

        let medal = "";


        if (siswa.ranking === 1) {

            medal = "🥇";

        }
        else if (siswa.ranking === 2) {

            medal = "🥈";

        }
        else if (siswa.ranking === 3) {

            medal = "🥉";

        }


        // Warna predikat

        let warna =
            "#dc2626";


        if (siswa.predikat === "A") {

            warna =
                "#16a34a";

        }
        else if (siswa.predikat === "B") {

            warna =
                "#2563eb";

        }
        else if (siswa.predikat === "C") {

            warna =
                "#ea580c";

        }


        //================================================
        // BARIS TABEL
        //================================================

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td style="text-align:center;">
                ${medal} ${siswa.ranking}
            </td>

            <td>
                ${siswa.nama}
            </td>

            <td>
                ${siswa.nisn}
            </td>

            <td style="text-align:center;">
                ${siswa.mtk}
            </td>

            <td style="text-align:center;">
                ${siswa.pancasila}
            </td>

            <td style="text-align:center;">
                ${siswa.ipas}
            </td>

            <td style="text-align:center;">
                ${siswa.indo}
            </td>

            <td style="text-align:center;">
                ${siswa.sunda}
            </td>

            <td style="text-align:center;">
                ${siswa.pai}
            </td>

            <td style="text-align:center;">
                ${siswa.seni}
            </td>

            <td style="text-align:center;">
                ${siswa.inggris}
            </td>

            <td style="text-align:center;">
                ${siswa.kka}
            </td>

            <td style="text-align:center;">
                ${siswa.pjok}
            </td>

            <td style="text-align:center;">
                <b>${siswa.rata}</b>
            </td>

            <td style="
                text-align:center;
                font-weight:bold;
                color:${warna};
            ">
                ${siswa.predikat}
            </td>

        `;


        tbody.appendChild(tr);

    });

}
//====================================================
// PENCARIAN SISWA
//====================================================

function aktifkanPencarian() {

    const cari =
        document.getElementById("cari");


    if (!cari) {
        return;
    }


    if (role !== "guru") {

        cari.style.display =
            "none";

        return;

    }


    cari.addEventListener(
        "input",
        function() {

            const keyword =
                String(
                    this.value || ""
                )
                .toLowerCase()
                .trim();


            const hasil =
                dataNilai.filter(
                    function(siswa) {

                        return (

                            siswa.nama
                                .toLowerCase()
                                .includes(keyword)

                            ||

                            siswa.nisn
                                .includes(keyword)

                        );

                    }
                );


            renderTabel(hasil);


            updateInfo(
                hasil.length
            );

        }
    );

}


//====================================================
// NAMA LOGIN
//====================================================

function tampilkanNamaLogin() {

    const namaLogin =
        document.getElementById(
            "namaLogin"
        );


    if (!namaLogin) {
        return;
    }


    if (role === "guru") {

        namaLogin.innerHTML =
            "👨‍🏫 " +
            (namaGuru || "Gr. Asep Jamhur, S.Pd., M.M.");

    }
    else {

        namaLogin.innerHTML =
            "👨‍🎓 " +
            namaSiswa;

    }

}


//====================================================
// TOMBOL CETAK
//====================================================

function cetakNilai() {

    window.print();

}


//====================================================
// TOMBOL KEMBALI
//====================================================

function buatTombolNavigasi() {

    const judul =
        document.getElementById(
            "judulHalaman"
        );


    if (!judul) {
        return;
    }


    //================================================
    // TOMBOL KEMBALI
    //================================================

    const btnKembali =
        document.createElement(
            "button"
        );


    btnKembali.innerHTML =
        "⬅ Kembali";


    btnKembali.style.background =
        "#16a34a";

    btnKembali.style.color =
        "#fff";

    btnKembali.style.border =
        "none";

    btnKembali.style.padding =
        "10px 18px";

    btnKembali.style.borderRadius =
        "8px";

    btnKembali.style.cursor =
        "pointer";

    btnKembali.style.fontWeight =
        "bold";

    btnKembali.style.marginRight =
        "10px";


    btnKembali.onclick =
        function() {

            if (role === "guru") {

                window.location.href =
                    "index.html";

            }
            else {

                window.location.href =
                    "dashboard-siswa.html";

            }

        };


    judul.insertAdjacentElement(
        "afterend",
        btnKembali
    );


    //================================================
    // TOMBOL CETAK
    //================================================

    const btnCetak =
        document.createElement(
            "button"
        );


    btnCetak.innerHTML =
        "🖨️ Cetak Nilai";


    btnCetak.style.background =
        "#2563eb";

    btnCetak.style.color =
        "#fff";

    btnCetak.style.border =
        "none";

    btnCetak.style.padding =
        "10px 18px";

    btnCetak.style.borderRadius =
        "8px";

    btnCetak.style.cursor =
        "pointer";

    btnCetak.style.fontWeight =
        "bold";


    btnCetak.onclick =
        cetakNilai;


    btnKembali.insertAdjacentElement(
        "afterend",
        btnCetak
    );

}


//====================================================
// LOGOUT
//====================================================

function logout() {

    if (
        confirm(
            "Yakin ingin logout?"
        )
    ) {

        localStorage.clear();

        window.location.href =
            "login.html";

    }

}
//====================================================
// CSS CETAK
//====================================================

function pasangCSSPrint() {

    const css =
        document.createElement(
            "style"
        );


    css.innerHTML = `

        @media print {

            .sidebar {
                display: none !important;
            }

            button {
                display: none !important;
            }

            input {
                display: none !important;
            }

            #cari {
                display: none !important;
            }

            body {
                margin: 10px;
                background: white !important;
            }

            .content {
                margin: 0 !important;
                padding: 0 !important;
            }

            table {
                width: 100% !important;
                border-collapse: collapse !important;
            }

            table th,
            table td {
                border: 1px solid #000 !important;
                padding: 5px !important;
                font-size: 11px !important;
            }

        }

    `;


    document.head.appendChild(
        css
    );

}


//====================================================
// MULAI APLIKASI
//====================================================

function mulaiAplikasi() {

    console.log(
        "Memulai aplikasi nilai..."
    );


    // Nama login
    tampilkanNamaLogin();


    // Tombol
    buatTombolNavigasi();


    // Pencarian
    aktifkanPencarian();


    // CSS cetak
    pasangCSSPrint();


    // Ambil data
    loadData();

}


//====================================================
// TUNGGU HTML SELESAI DIMUAT
//====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        mulaiAplikasi
    );

}
else {

    mulaiAplikasi();

}


//====================================================
// SELESAI
//====================================================

console.log(
    "nilai.js VERSI 5.0 siap."
);
