// =====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// FILE : nilai.js (VERSI 2.0)
// =====================================================

// ===========================
// LOGIN
// ===========================

const role = localStorage.getItem("role");
const nisnLogin = localStorage.getItem("nisn");

const URL_API = "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";
async function ambilNilaiDariSpreadsheet(){

    const response = await fetch(URL_API);

    const data = await response.json();

    console.log(data);

}
ambilNilaiDariSpreadsheet();

// ===========================
// DATA NILAI SISWA
// ===========================

const dataNilai = [

{
    nama:"ABDUL VIQRI HERDYANSAH",
    nisn:"3152535129",
    mtk:90, pancasila:88, ipas:91, indo:89,
    sunda:87, pai:92, seni:90,
    inggris:88, kka:91, pjok:93
},

{
    nama:"ADERA SEPTIA ZAHRA",
    nisn:"3151954375",
    mtk:89, pancasila:90, ipas:88, indo:91,
    sunda:89, pai:90, seni:92,
    inggris:89, kka:90, pjok:91
},

{
    nama:"AFZA JAMALUL ISLAM",
    nisn:"3140833958",
    mtk:86, pancasila:87, ipas:88, indo:89,
    sunda:85, pai:90, seni:88,
    inggris:86, kka:87, pjok:89
},

{
    nama:"AGUNG RUSMAWAN",
    nisn:"3154266101",
    mtk:82, pancasila:84, ipas:83, indo:85,
    sunda:82, pai:86, seni:84,
    inggris:83, kka:85, pjok:87
},

{
    nama:"AHMAD ZAQQI MAULIDA",
    nisn:"3164471222",
    mtk:91, pancasila:90, ipas:92, indo:91,
    sunda:90, pai:93, seni:91,
    inggris:90, kka:92, pjok:94
},

{
    nama:"AINA NURAULIA",
    nisn:"3161011486",
    mtk:88, pancasila:87, ipas:89, indo:90,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"AJKA MAHESA PUTRA",
    nisn:"3168365047",
    mtk:84, pancasila:83, ipas:85, indo:86,
    sunda:84, pai:87, seni:85,
    inggris:84, kka:86, pjok:88
},

{
    nama:"AKIFA NAILA PUTRI",
    nisn:"0133008239",
    mtk:92, pancasila:91, ipas:93, indo:92,
    sunda:90, pai:94, seni:92,
    inggris:91, kka:93, pjok:95
},

{
    nama:"ALFIN ALDIANSYAH PUTRA",
    nisn:"3142958619",
    mtk:85, pancasila:86, ipas:84, indo:87,
    sunda:85, pai:88, seni:86,
    inggris:85, kka:87, pjok:89
},

{
    nama:"ARKHANA KHAIRAFVMALIK AL-FATIH",
    nisn:"3151187060",
    mtk:90, pancasila:89, ipas:91, indo:90,
    sunda:88, pai:92, seni:90,
    inggris:89, kka:91, pjok:93
},

{
    nama:"BALQIS CALLISTA MAHARANI",
    nisn:"3150287804",
    mtk:91, pancasila:90, ipas:92, indo:91,
    sunda:90, pai:93, seni:92,
    inggris:90, kka:91, pjok:94
},

{
    nama:"DELISA LAELATUN NISFA",
    nisn:"3151616056",
    mtk:88, pancasila:89, ipas:87, indo:90,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"EPA",
    nisn:"3156965123",
    mtk:82, pancasila:83, ipas:84, indo:85,
    sunda:82, pai:86, seni:84,
    inggris:83, kka:85, pjok:87
},

{
    nama:"FADIL SYAH PUTRA",
    nisn:"3151454523",
    mtk:90, pancasila:89, ipas:91, indo:90,
    sunda:88, pai:92, seni:90,
    inggris:89, kka:91, pjok:93
},

{
    nama:"FAREL",
    nisn:"3153200838",
    mtk:86, pancasila:87, ipas:85, indo:88,
    sunda:86, pai:89, seni:87,
    inggris:86, kka:88, pjok:90
},

{
    nama:"GILANG SAPUTRA",
    nisn:"3154288538",
    mtk:84, pancasila:85, ipas:86, indo:87,
    sunda:84, pai:88, seni:86,
    inggris:85, kka:87, pjok:89
},

{
    nama:"JULIA PITRIANI ARSETO",
    nisn:"3152240908",
    mtk:92, pancasila:91, ipas:93, indo:92,
    sunda:91, pai:94, seni:92,
    inggris:91, kka:93, pjok:95
},
{
    nama:"KAY HASBINAWLOH",
    nisn:"3160691985",
    mtk:85, pancasila:86, ipas:84, indo:87,
    sunda:85, pai:88, seni:86,
    inggris:85, kka:87, pjok:89
},

{
    nama:"KUSAHRI",
    nisn:"3169282129",
    mtk:83, pancasila:84, ipas:85, indo:86,
    sunda:83, pai:87, seni:85,
    inggris:84, kka:86, pjok:88
},

{
    nama:"LEPANDI",
    nisn:"3154462799",
    mtk:89, pancasila:88, ipas:90, indo:89,
    sunda:87, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"M ALDI FIRDAUS",
    nisn:"3163393824",
    mtk:87, pancasila:88, ipas:86, indo:89,
    sunda:87, pai:90, seni:88,
    inggris:87, kka:89, pjok:91
},

{
    nama:"M SALMAN MAULANA",
    nisn:"3150401111",
    mtk:85, pancasila:86, ipas:84, indo:87,
    sunda:85, pai:88, seni:86,
    inggris:85, kka:87, pjok:89
},

{
    nama:"M. RUDIANA",
    nisn:"3153035527",
    mtk:83, pancasila:84, ipas:82, indo:85,
    sunda:83, pai:86, seni:84,
    inggris:83, kka:85, pjok:87
},

{
    nama:"MAGA YUDISTIRA",
    nisn:"3151146884",
    mtk:90, pancasila:89, ipas:91, indo:90,
    sunda:88, pai:92, seni:90,
    inggris:89, kka:91, pjok:93
},

{
    nama:"MARSA PONIA",
    nisn:"3165829445",
    mtk:91, pancasila:92, ipas:90, indo:93,
    sunda:91, pai:94, seni:92,
    inggris:91, kka:93, pjok:95
},

{
    nama:"MELA AULIA",
    nisn:"3151780335",
    mtk:88, pancasila:89, ipas:87, indo:90,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"MISNA HERDIANSAH",
    nisn:"3152882079",
    mtk:84, pancasila:85, ipas:83, indo:86,
    sunda:84, pai:87, seni:85,
    inggris:84, kka:86, pjok:88
},

{
    nama:"MUHAMAD FAHRI MAULANA",
    nisn:"3150739047",
    mtk:89, pancasila:90, ipas:88, indo:91,
    sunda:89, pai:92, seni:90,
    inggris:89, kka:91, pjok:93
},

{
    nama:"MUHAMAD JASIPA",
    nisn:"3157510733",
    mtk:82, pancasila:83, ipas:81, indo:84,
    sunda:82, pai:85, seni:83,
    inggris:82, kka:84, pjok:86
},

{
    nama:"MUHAMMAD HASRUL",
    nisn:"3154418452",
    mtk:90, pancasila:91, ipas:89, indo:92,
    sunda:90, pai:93, seni:91,
    inggris:90, kka:92, pjok:94
},

{
    nama:"MUHAMMAD PARID RAMDANI",
    nisn:"3156894166",
    mtk:88, pancasila:89, ipas:87, indo:90,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"MUHAMMAD RAMA AFRIANSYAH",
    nisn:"3167492072",
    mtk:84, pancasila:85, ipas:83, indo:86,
    sunda:84, pai:87, seni:85,
    inggris:84, kka:86, pjok:88
},

{
    nama:"MUHAMMAD RIZA SAPUTRA",
    nisn:"3135015339",
    mtk:86, pancasila:87, ipas:85, indo:88,
    sunda:86, pai:89, seni:87,
    inggris:86, kka:88, pjok:90
},

{
    nama:"NABILA PUTRI",
    nisn:"3168877348",
    mtk:92, pancasila:91, ipas:93, indo:92,
    sunda:91, pai:94, seni:92,
    inggris:91, kka:93, pjok:95
},
{
    nama:"NASYA JUWITA",
    nisn:"3164347521",
    mtk:90, pancasila:89, ipas:91, indo:90,
    sunda:89, pai:92, seni:90,
    inggris:89, kka:91, pjok:93
},

{
    nama:"NAZIA NURUL AULIA",
    nisn:"3156610091",
    mtk:89, pancasila:88, ipas:90, indo:89,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"PUTRI WULAN NURAZIZAH",
    nisn:"3160143908",
    mtk:91, pancasila:90, ipas:92, indo:91,
    sunda:90, pai:93, seni:91,
    inggris:90, kka:92, pjok:94
},

{
    nama:"RANGGA SAPUTRA",
    nisn:"3158752394",
    mtk:83, pancasila:84, ipas:82, indo:85,
    sunda:83, pai:86, seni:84,
    inggris:83, kka:85, pjok:87
},

{
    nama:"RIAN",
    nisn:"3158460102",
    mtk:85, pancasila:86, ipas:84, indo:87,
    sunda:85, pai:88, seni:86,
    inggris:85, kka:87, pjok:89
},

{
    nama:"RISKA RAMADANI",
    nisn:"3152755760",
    mtk:93, pancasila:92, ipas:94, indo:93,
    sunda:92, pai:95, seni:93,
    inggris:92, kka:94, pjok:96
},

{
    nama:"RISTI",
    nisn:"3168544018",
    mtk:87, pancasila:88, ipas:86, indo:89,
    sunda:87, pai:90, seni:88,
    inggris:87, kka:89, pjok:91
},

{
    nama:"SAKHIYA DEWILL MAULIDA",
    nisn:"3157506032",
    mtk:90, pancasila:91, ipas:89, indo:92,
    sunda:90, pai:93, seni:91,
    inggris:90, kka:92, pjok:94
},

{
    nama:"SARAH SAPUTRI",
    nisn:"3154911718",
    mtk:88, pancasila:89, ipas:87, indo:90,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"SEKAR AYU",
    nisn:"3144452583",
    mtk:91, pancasila:90, ipas:92, indo:91,
    sunda:90, pai:93, seni:91,
    inggris:90, kka:92, pjok:94
},

{
    nama:"SELI SEPTIWATI",
    nisn:"3152324846",
    mtk:89, pancasila:88, ipas:90, indo:89,
    sunda:88, pai:91, seni:89,
    inggris:88, kka:90, pjok:92
},

{
    nama:"SESTI SANDIARA PUTRI",
    nisn:"3167348589",
    mtk:92, pancasila:91, ipas:93, indo:92,
    sunda:91, pai:94, seni:92,
    inggris:91, kka:93, pjok:95
},

{
    nama:"SITI NABILA",
    nisn:"3156450191",
    mtk:90, pancasila:89, ipas:91, indo:90,
    sunda:89, pai:92, seni:90,
    inggris:89, kka:91, pjok:93
},

{
    nama:"SYAHARA CHAIRUN NISSA",
    nisn:"3165575731",
    mtk:91, pancasila:90, ipas:92, indo:91,
    sunda:90, pai:93, seni:91,
    inggris:90, kka:92, pjok:94
},

{
    nama:"TEDI PIRMANSYAH",
    nisn:"3150285588",
    mtk:84, pancasila:85, ipas:83, indo:86,
    sunda:84, pai:87, seni:85,
    inggris:84, kka:86, pjok:88
},

{
    nama:"ZAKI RABBANI",
    nisn:"3156826288",
    mtk:93, pancasila:92, ipas:94, indo:93,
    sunda:92, pai:95, seni:93,
    inggris:92, kka:94, pjok:96
}

];
// =====================================================
// MENGHITUNG TOTAL, RATA-RATA, PREDIKAT DAN RANKING
// =====================================================

dataNilai.forEach((siswa) => {

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

    siswa.rata = Number((siswa.total / 10).toFixed(2));

    if (siswa.rata >= 90) {
        siswa.predikat = "A";
    } else if (siswa.rata >= 80) {
        siswa.predikat = "B";
    } else if (siswa.rata >= 70) {
        siswa.predikat = "C";
    } else {
        siswa.predikat = "D";
    }

});


// ===========================
// HITUNG RANKING
// ===========================

const rankingData = [...dataNilai].sort((a, b) => b.rata - a.rata);

rankingData.forEach((siswa, index) => {
    siswa.ranking = index + 1;
});


// ===========================
// CEK LOGIN
// ===========================

if (!role) {

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}


// ===========================
// AMBIL DATA SESUAI ROLE
// ===========================

let dataTampil = [];

if (role === "guru") {

    dataTampil = rankingData;

} else {

    dataTampil = rankingData.filter(
        siswa => siswa.nisn === nisnLogin
    );

}


// ===========================
// TAMPILKAN NAMA SISWA
// ===========================

const namaLogin = localStorage.getItem("namaSiswa");

if (role === "siswa" && namaLogin) {

    const elemenNama = document.getElementById("namaSiswa");

    if (elemenNama) {

        elemenNama.innerHTML =
            "<strong>Nama :</strong> " + namaLogin;

    }

}
// =====================================================
// FUNGSI MENAMPILKAN DATA KE TABEL
// =====================================================

function renderTabel(data) {

    const tbody = document.getElementById("tabelNilai");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="15" style="text-align:center;color:red;">
                    Data nilai tidak ditemukan
                </td>
            </tr>
        `;

        return;

    }

    data.forEach((siswa) => {

        let medal = "";

        if (siswa.ranking === 1) {
            medal = "🥇";
        } else if (siswa.ranking === 2) {
            medal = "🥈";
        } else if (siswa.ranking === 3) {
            medal = "🥉";
        }

        let warnaPredikat = "";

        switch (siswa.predikat) {

            case "A":
                warnaPredikat = "#16a34a";
                break;

            case "B":
                warnaPredikat = "#2563eb";
                break;

            case "C":
                warnaPredikat = "#ea580c";
                break;

            default:
                warnaPredikat = "#dc2626";
        }

        tbody.innerHTML += `

<tr>

<td style="text-align:center;">
${medal} ${siswa.ranking}
</td>

<td>${siswa.nama}</td>

<td>${siswa.nisn}</td>

<td align="center">${siswa.mtk}</td>

<td align="center">${siswa.pancasila}</td>

<td align="center">${siswa.ipas}</td>

<td align="center">${siswa.indo}</td>

<td align="center">${siswa.sunda}</td>

<td align="center">${siswa.pai}</td>

<td align="center">${siswa.seni}</td>

<td align="center">${siswa.inggris}</td>

<td align="center">${siswa.kka}</td>

<td align="center">${siswa.pjok}</td>

<td align="center">
<b>${siswa.rata}</b>
</td>

<td
align="center"
style="
font-weight:bold;
color:${warnaPredikat};
">
${siswa.predikat}
</td>

</tr>

`;

    });

}

// =====================================================
// TAMPILKAN DATA SAAT HALAMAN DIBUKA
// =====================================================

renderTabel(dataTampil);
// =====================================================
// FITUR PENCARIAN (KHUSUS GURU)
// =====================================================

const cari = document.getElementById("cari");

if (cari && role === "guru") {

    cari.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase().trim();

        const hasil = rankingData.filter((siswa) => {

            return (
                siswa.nama.toLowerCase().includes(keyword) ||
                siswa.nisn.includes(keyword)
            );

        });

        renderTabel(hasil);

        updateInfo(hasil.length);

    });

} else if (cari) {

    // Siswa tidak perlu fitur pencarian
    cari.style.display = "none";

}


// =====================================================
// MENAMPILKAN JUMLAH DATA
// =====================================================

function updateInfo(jumlah) {

    let info = document.getElementById("infoData");

    if (!info) {

        info = document.createElement("p");

        info.id = "infoData";

        info.style.margin = "10px 0";
        info.style.fontWeight = "bold";
        info.style.color = "#2563eb";

        const tabel = document.querySelector("table");

        if (tabel) {
            tabel.parentNode.insertBefore(info, tabel);
        }

    }

    if (role === "guru") {
        info.innerHTML = "Jumlah siswa : <b>" + jumlah + "</b>";
    } else {
        info.innerHTML = "Data nilai siswa";
    }

}


// =====================================================
// TAMPILKAN INFO PERTAMA KALI
// =====================================================

updateInfo(dataTampil.length);


// =====================================================
// DEBUG (BOLEH DIHAPUS NANTI)
// =====================================================

console.log("Role :", role);
console.log("NISN Login :", nisnLogin);
console.log("Jumlah Data :", dataTampil.length);
console.table(dataTampil);
// =====================================================
// FITUR CETAK NILAI
// =====================================================

function cetakNilai() {

    window.print();

}


// =====================================================
// MEMBUAT TOMBOL CETAK OTOMATIS
// =====================================================

const judulHalaman = document.querySelector("h1");

if (judulHalaman) {

    const tombol = document.createElement("button");

    tombol.innerHTML = "🖨️ Cetak Nilai";

    tombol.style.background = "#2563eb";
    tombol.style.color = "white";
    tombol.style.border = "none";
    tombol.style.padding = "10px 18px";
    tombol.style.borderRadius = "8px";
    tombol.style.cursor = "pointer";
    tombol.style.marginBottom = "15px";
    tombol.style.fontSize = "15px";
    tombol.style.fontWeight = "bold";

    tombol.onclick = cetakNilai;

    judulHalaman.insertAdjacentElement("afterend", tombol);

}


// =====================================================
// CSS KHUSUS SAAT DICETAK
// =====================================================

const stylePrint = document.createElement("style");

stylePrint.innerHTML = `

@media print{

button{
display:none;
}

input{
display:none;
}

body{
margin:15px;
font-size:12px;
}

table{
width:100%;
border-collapse:collapse;
}

table th,
table td{
border:1px solid #000;
padding:6px;
}

h1{
text-align:center;
}

}

`;

document.head.appendChild(stylePrint);


// =====================================================
// PESAN JIKA BELUM LOGIN
// =====================================================

if (!localStorage.getItem("login")) {

    alert("Silakan login terlebih dahulu.");

    location.href = "login.html";

}


// =====================================================
// TOMBOL KEMBALI KE DASHBOARD
// =====================================================

const btnKembali = document.createElement("button");

btnKembali.innerHTML = "⬅ Kembali";

btnKembali.style.marginLeft = "10px";
btnKembali.style.background = "#16a34a";
btnKembali.style.color = "#fff";
btnKembali.style.border = "none";
btnKembali.style.padding = "10px 18px";
btnKembali.style.borderRadius = "8px";
btnKembali.style.cursor = "pointer";
btnKembali.style.fontWeight = "bold";

btnKembali.onclick = function(){

    if(role==="guru"){
        location.href="dashboard-guru.html";
    }else{
        location.href="dashboard-siswa.html";
    }

};

if (judulHalaman) {

    judulHalaman.insertAdjacentElement("afterend", btnKembali);

}


// =====================================================
// INFORMASI VERSI
// =====================================================

console.log("========================================");
console.log("Portal Digital Kelas 5 SDN Cijember");
console.log("Versi : 2.0");
console.log("Developer : Asep Jamhur");
console.log("========================================");
