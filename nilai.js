//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// nilai.js Versi 3.0
// Developer : Asep Jamhur
//====================================================

// ===============================
// LOGIN
// ===============================

let nisnLogin = localStorage.getItem("nisn");

// ===============================
// URL GOOGLE APPS SCRIPT
// ===============================

const URL_API = "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

// ===============================
// VARIABEL GLOBAL
// ===============================

let dataNilai = [];
let dataTampil = [];

// ===============================
// CEK LOGIN
// ===============================

if(localStorage.getItem("login")!="true"){

    alert("Silakan login terlebih dahulu.");

    location.href="login.html";

}

// ===============================
// CEK ROLE
// ===============================

if(role!="guru" && role!="siswa"){

    alert("Role tidak dikenali.");

    location.href="login.html";

}

// ===============================
// LOADING
// ===============================

function tampilLoading(){

    const tbody=document.getElementById("tabelNilai");

    if(!tbody) return;

    tbody.innerHTML=`
    <tr>
        <td colspan="15" style="padding:30px;text-align:center;">
            ⏳ Mengambil data dari Google Spreadsheet...
        </td>
    </tr>
    `;

}

// ===============================
// FORMAT ANGKA
// ===============================

function angka(nilai){

    nilai=Number(nilai);

    if(isNaN(nilai)){

        return 0;

    }

    return nilai;

}

tampilLoading();
//====================================================
// BAGIAN 2
// AMBIL DATA DARI GOOGLE SPREADSHEET
//====================================================

async function loadData(){

    try{

        const response = await fetch(URL_API);

        const json = await response.json();

        dataNilai = [];

        json.forEach(function(item){

            let siswa = {

                nama : item["NAMA"] || "",

                nisn : item["NISN"] || "",

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

            };

            dataNilai.push(siswa);

        });

        console.log("Data Spreadsheet :",dataNilai);

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

    // Hitung total dan rata-rata
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

    // Urutkan berdasarkan rata-rata tertinggi
    dataNilai.sort(function(a,b){

        return b.rata - a.rata;

    });

    // Beri ranking
    dataNilai.forEach(function(siswa,index){

        siswa.ranking = index + 1;

    });

    // Tentukan data yang ditampilkan
    if(role==="guru"){

        dataTampil = dataNilai;

    }else{

        dataTampil = dataNilai.filter(function(siswa){

            return siswa.nisn === nisnLogin;

        });

    }

    console.log("Data Tampil :",dataTampil);

    // Tampilkan ke tabel
    renderTabel(dataTampil);

    updateInfo(dataTampil.length);

}
//====================================================
// BAGIAN 4
// TAMPILKAN DATA KE TABEL
//====================================================

function renderTabel(data){

    const tbody=document.getElementById("tabelNilai");

    if(!tbody) return;

    tbody.innerHTML="";

    if(data.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="15" style="text-align:center;padding:25px;color:red;">
                Data nilai tidak ditemukan
            </td>
        </tr>
        `;

        return;

    }

    data.forEach(function(siswa){

        let medal="";

        if(siswa.ranking==1){
            medal="🥇";
        }else if(siswa.ranking==2){
            medal="🥈";
        }else if(siswa.ranking==3){
            medal="🥉";
        }

        let warna="#dc2626";

        if(siswa.predikat=="A"){
            warna="#16a34a";
        }else if(siswa.predikat=="B"){
            warna="#2563eb";
        }else if(siswa.predikat=="C"){
            warna="#ea580c";
        }

        tbody.innerHTML+=`

<tr>

<td align="center">${medal} ${siswa.ranking}</td>

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
style="
font-weight:bold;
color:${warna};
">
${siswa.predikat}
</td>

</tr>

`;

    });

}
//====================================================
// BAGIAN 5
// PENCARIAN
//====================================================

const cari = document.getElementById("cari");

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
// MENAMPILKAN JUMLAH DATA
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
// TOMBOL CETAK
//====================================================

function cetakNilai(){

    window.print();

}

const judul=document.querySelector("h1");

if(judul){

    const tombol=document.createElement("button");

    tombol.innerHTML="🖨️ Cetak Nilai";

    tombol.style.background="#2563eb";
    tombol.style.color="white";
    tombol.style.border="none";
    tombol.style.padding="10px 18px";
    tombol.style.borderRadius="8px";
    tombol.style.cursor="pointer";
    tombol.style.marginBottom="15px";
    tombol.style.fontWeight="bold";

    tombol.onclick=cetakNilai;

    judul.insertAdjacentElement("afterend",tombol);

}

//====================================================
// CSS PRINT
//====================================================

const css=document.createElement("style");

css.innerHTML=`

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
padding:5px;
}

}

`;

document.head.appendChild(css);

//====================================================
// MULAI MEMBACA DATA
//====================================================

loadData();
//====================================================
// BAGIAN 6 (FINAL)
// NAMA LOGIN
//====================================================

const namaLogin=document.getElementById("namaLogin");

if(namaLogin){

    if(role==="guru"){

        namaLogin.innerHTML=
        "👨‍🏫 "+(localStorage.getItem("namaGuru")||"Guru");

    }else{

        namaLogin.innerHTML=
        "👨‍🎓 "+(localStorage.getItem("namaSiswa")||"Siswa");

    }

}

//====================================================
// TOMBOL KEMBALI
//====================================================

const btnKembali=document.createElement("button");

btnKembali.innerHTML="⬅ Kembali";

btnKembali.style.background="#16a34a";
btnKembali.style.color="white";
btnKembali.style.border="none";
btnKembali.style.padding="10px 18px";
btnKembali.style.borderRadius="8px";
btnKembali.style.cursor="pointer";
btnKembali.style.marginLeft="10px";
btnKembali.style.fontWeight="bold";

btnKembali.onclick=function(){

    location.href="index.html";

};

if(judul){

    judul.insertAdjacentElement("afterend",btnKembali);

}

//====================================================
// LOGOUT
//====================================================

function logout(){

    if(confirm("Yakin ingin logout?")){

        localStorage.clear();

        location.href="login.html";

    }

}

//====================================================
// DEBUG
//====================================================

console.log("=================================");
console.log("Portal Digital Kelas 5");
console.log("Versi 3.0");
console.log("Role :",role);
console.log("NISN :",nisnLogin);
console.log("=================================");
