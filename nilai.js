//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// nilai.js VERSI 4.0
// Developer : Asep Jamhur
//====================================================


//====================================================
// KONFIGURASI
//====================================================

// Ganti dengan URL Web App Google Apps Script
const URL_API = "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";
//====================================================
// LOGIN
//====================================================

var role = localStorage.getItem("role") || "";

const nisnLogin = String(localStorage.getItem("nisn") || "").trim();

const namaGuru = localStorage.getItem("namaGuru") || "";

const namaSiswa = localStorage.getItem("namaSiswa") || "";


//====================================================
// CEK LOGIN
//====================================================

if(localStorage.getItem("login")!=="true"){

    alert("Silakan login terlebih dahulu.");

    location.href="login.html";

}


//====================================================
// VARIABEL GLOBAL
//====================================================

let dataNilai = [];

let dataTampil = [];


//====================================================
// FUNGSI KONVERSI ANGKA
//====================================================

function angka(nilai){

    if (nilai === null || nilai === undefined) {
        return 0;
    }

    // Jika angka langsung
    if (typeof nilai === "number") {
        return nilai;
    }

    // Jika berupa teks
    const teks = String(nilai).trim();

    if (teks === "") {
        return 0;
    }

    const hasil = Number(teks);

    return isNaN(hasil) ? 0 : hasil;

}


//====================================================
// DEBUG
//====================================================

console.log("======================================");

console.log("Portal Digital Kelas 5");

console.log("Versi 4.0");

console.log("Role :",role);

console.log("NISN Login :",nisnLogin);

console.log("======================================");
//====================================================
// BAGIAN 2
// AMBIL DATA DARI GOOGLE SPREADSHEET
//====================================================

async function loadData(){

    try{

        const response = await fetch(URL_API + "?action=nilai");

        if(!response.ok){

            throw new Error("Status : " + response.status);

        }

        const json = await response.json();
        console.log(json[0]);

        console.log("Data dari Spreadsheet :",json);

        dataNilai=[];

        json.forEach(function(item){

            dataNilai.push({
console.log(
    "CEK NILAI:",
    item["NAMA"],
    "MTK =", item["MTK"],
    "PKN =", item["PKN"],
    "IPAS =", item["IPAS"]
);
                nama : String(item["NAMA"] || "").trim(),

                nisn : String(item["NISN"] || "").trim(),

                pancasila : angka(item["PKN"]),

                indo : angka(item["B.IND"]),

                mtk : angka(item["MTK"]),

                ipas : angka(item["IPAS"]),

                sunda : angka(item["B. SUNDA"]),

                inggris : angka(item["B. INGGRIS"]),

                kka : angka(item["KKA"]),

                seni : angka(item["SENI RUPA"]),

                pai : angka(item["PAI"]),

                pjok : angka(item["PJOK"])

            });

        });

        console.log("Jumlah Data :",dataNilai.length);

        if(dataNilai.length===0){

            alert("Data nilai masih kosong.");

            return;

        }

        hitungNilai();

    }

    catch(error){

        console.error(error);

        alert("❌ Gagal mengambil data dari Google Spreadsheet.");

    }

}
//====================================================
// BAGIAN 3
// HITUNG TOTAL, RATA-RATA, PREDIKAT DAN RANKING
//====================================================

function hitungNilai(){

    // ==========================
    // HITUNG TOTAL DAN RATA-RATA
    // ==========================

    dataNilai.forEach(function(siswa){

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

        // Predikat

        if(siswa.rata >= 90){

            siswa.predikat = "A";

        }else if(siswa.rata >= 80){

            siswa.predikat = "B";

        }else if(siswa.rata >= 70){

            siswa.predikat = "C";

        }else{

            siswa.predikat = "D";

        }

    });


    // ==========================
    // URUTKAN BERDASARKAN RATA-RATA
    // ==========================

    dataNilai.sort(function(a,b){

        return b.rata - a.rata;

    });


    // ==========================
    // BUAT RANKING
    // ==========================

    dataNilai.forEach(function(siswa,index){

        siswa.ranking = index + 1;

    });


    // ==========================
    // CEK ROLE LOGIN
    // ==========================

    if(role==="guru"){

        dataTampil = dataNilai;

    }else{

        dataTampil = dataNilai.filter(function(siswa){

            return String(siswa.nisn).trim() === String(nisnLogin).trim();

        });

    }


    console.log("Role :",role);

    console.log("NISN Login :",nisnLogin);

    console.log("Jumlah Data Tampil :",dataTampil.length);


    // ==========================
    // TAMPILKAN KE TABEL
    // ==========================

    console.log(dataTampil);

renderTabel(dataTampil);

    updateInfo(dataTampil.length);

}
//====================================================
// BAGIAN 4
// TAMPILKAN DATA KE TABEL
//====================================================

function renderTabel(data){

    const tbody = document.getElementById("tabelNilai");

    if(!tbody) return;

    tbody.innerHTML="";

    if(data.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="15" style="padding:25px;text-align:center;color:red;">
                Data nilai tidak ditemukan.
            </td>
        </tr>
        `;

        return;

    }

    data.forEach(function(siswa){

        let medal="";

        if(siswa.ranking===1){
            medal="🥇";
        }else if(siswa.ranking===2){
            medal="🥈";
        }else if(siswa.ranking===3){
            medal="🥉";
        }

        let warna="#dc2626";

        if(siswa.predikat==="A"){
            warna="#16a34a";
        }else if(siswa.predikat==="B"){
            warna="#2563eb";
        }else if(siswa.predikat==="C"){
            warna="#ea580c";
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

            <td align="center"
                style="font-weight:bold;color:${warna};">
                ${siswa.predikat}
            </td>

        </tr>
        `;

    });

}
//====================================================
// BAGIAN 5
// INFO DATA
//====================================================

function updateInfo(jumlah){

    let info=document.getElementById("infoData");

    if(!info){

        info=document.createElement("p");

        info.id="infoData";

        info.style.margin="10px 0";
        info.style.fontWeight="bold";
        info.style.color="#2563eb";

        const tabel=document.querySelector("table");

        if(tabel){

            tabel.parentNode.insertBefore(info,tabel);

        }

    }

    if(role==="guru"){

        info.innerHTML="Jumlah siswa : <b>"+jumlah+"</b>";

    }else{

        info.innerHTML="Data Nilai Saya";

    }

}

//====================================================
// PENCARIAN
//====================================================

const cari=document.getElementById("cari");

if(cari){

    if(role==="guru"){

        cari.addEventListener("keyup",function(){

            const keyword=this.value.toLowerCase().trim();

            const hasil=dataNilai.filter(function(siswa){

                return siswa.nama.toLowerCase().includes(keyword) ||
                       siswa.nisn.includes(keyword);

            });

            renderTabel(hasil);

            updateInfo(hasil.length);

        });

    }else{

        cari.style.display="none";

    }

}

//====================================================
// TAMPILKAN NAMA LOGIN
//====================================================

const namaLogin=document.getElementById("namaLogin");

if(namaLogin){

    if(role==="guru"){

        namaLogin.innerHTML="👨‍🏫 "+namaGuru;

    }else{

        namaLogin.innerHTML="👨‍🎓 "+namaSiswa;

    }

}

//====================================================
// LOAD DATA
//====================================================

loadData();
//====================================================
// BAGIAN 6
// TOMBOL CETAK
//====================================================

function cetakNilai(){

    window.print();

}

const judul=document.getElementById("judulHalaman");

if(judul){

    const btnCetak=document.createElement("button");

    btnCetak.innerHTML="🖨️ Cetak Nilai";

    btnCetak.style.background="#2563eb";
    btnCetak.style.color="#fff";
    btnCetak.style.border="none";
    btnCetak.style.padding="10px 18px";
    btnCetak.style.borderRadius="8px";
    btnCetak.style.cursor="pointer";
    btnCetak.style.marginRight="10px";
    btnCetak.style.fontWeight="bold";

    btnCetak.onclick=cetakNilai;

    judul.insertAdjacentElement("afterend",btnCetak);

}


//====================================================
// TOMBOL KEMBALI
//====================================================

const btnKembali=document.createElement("button");

btnKembali.innerHTML="⬅ Kembali";

btnKembali.style.background="#16a34a";
btnKembali.style.color="#fff";
btnKembali.style.border="none";
btnKembali.style.padding="10px 18px";
btnKembali.style.borderRadius="8px";
btnKembali.style.cursor="pointer";
btnKembali.style.fontWeight="bold";

btnKembali.onclick=function(){

    if(role==="guru"){

        location.href="index.html";

    }else{

        location.href="dashboard-siswa.html";

    }

};

if(judul){

    judul.insertAdjacentElement("afterend",btnKembali);

}


//====================================================
// CSS PRINT
//====================================================

const css=document.createElement("style");

css.innerHTML=`

@media print{

.sidebar{
display:none;
}

button{
display:none;
}

input{
display:none;
}

body{
margin:10px;
}

.content{
margin:0;
padding:0;
}

table{
width:100%;
border-collapse:collapse;
}

table th,
table td{

border:1px solid #000;
padding:5px;
font-size:12px;

}

}

`;

document.head.appendChild(css);


//====================================================
// LOGOUT
//====================================================

function logout(){

    if(confirm("Yakin ingin logout ?")){

        localStorage.clear();

        location.href="login.html";

    }

}


//====================================================
// DEBUG
//====================================================

console.log("==============================");

console.log("Portal Digital Kelas 5");

console.log("Versi 4.0 FINAL");

console.log("Role :",role);

console.log("Jumlah Data :",dataNilai.length);

console.log("==============================");
