// ==========================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// nilai-api.js
// Versi 3.0
// ==========================================

const URL_API =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

const role = localStorage.getItem("role");
const nisnLogin = localStorage.getItem("nisn");

let semuaData = [];

// ==========================================
// AMBIL DATA DARI GOOGLE SPREADSHEET
// ==========================================

async function loadNilai(){

    try{

        const response = await fetch(URL_API);

        const json = await response.json();

        semuaData = json.map(function(item){

            const siswa = {

                nama : item["NAMA"] || "",
                nisn : item["NISN"] || "",

                pancasila : Number(item["PKN"] || 0),

                indo : Number(item["B.IND"] || 0),

                mtk : Number(item["MTK"] || 0),

                ipas : Number(item["IPAS"] || 0),

                sunda : Number(item["B. SUNDA"] || 0),

                inggris : Number(item["B. INGGRIS"] || 0),

                kka : Number(item["KKA"] || 0),

                seni : Number(item["SENI RUPA"] || 0),

                pai : Number(item["PAI"] || 0),

                pjok : Number(item["PJOK"] || 0)

            };

            siswa.total =
                siswa.pancasila +
                siswa.indo +
                siswa.mtk +
                siswa.ipas +
                siswa.sunda +
                siswa.inggris +
                siswa.kka +
                siswa.seni +
                siswa.pai +
                siswa.pjok;

            siswa.rata =
                Number((siswa.total/10).toFixed(2));

            if(siswa.rata>=90){

                siswa.predikat="A";

            }else if(siswa.rata>=80){

                siswa.predikat="B";

            }else if(siswa.rata>=70){

                siswa.predikat="C";

            }else{

                siswa.predikat="D";

            }

            return siswa;

        });

        semuaData.sort(function(a,b){

            return b.rata-a.rata;

        });

        semuaData.forEach(function(siswa,index){

            siswa.ranking=index+1;

        });

        tampilkanData();

    }

    catch(err){

        console.error(err);

        alert("Gagal mengambil data dari Spreadsheet.");

    }

}
// ==========================================
// MENAMPILKAN DATA
// ==========================================

function tampilkanData(){

    let data = [];

    if(role==="guru"){

        data = semuaData;

    }else{

        data = semuaData.filter(function(s){

            return s.nisn===nisnLogin;

        });

    }

    renderTabel(data);

    updateInfo(data.length);

}

// ==========================================
// RENDER TABEL
// ==========================================

function renderTabel(data){

    const tbody=document.getElementById("tabelNilai");

    if(!tbody) return;

    tbody.innerHTML="";

    data.forEach(function(siswa){

        let medal="";

        if(siswa.ranking==1) medal="🥇";
        else if(siswa.ranking==2) medal="🥈";
        else if(siswa.ranking==3) medal="🥉";

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

<td align="center"><b>${siswa.rata}</b></td>

<td align="center"><b>${siswa.predikat}</b></td>

</tr>

`;

    });

}
// ==========================================
// INFO JUMLAH DATA
// ==========================================

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

// ==========================================
// FITUR PENCARIAN
// ==========================================

const cari=document.getElementById("cari");

if(cari){

    if(role==="guru"){

        cari.addEventListener("keyup",function(){

            const keyword=this.value.toLowerCase().trim();

            const hasil=semuaData.filter(function(s){

                return s.nama.toLowerCase().includes(keyword) ||
                       s.nisn.includes(keyword);

            });

            renderTabel(hasil);

            updateInfo(hasil.length);

        });

    }else{

        cari.style.display="none";

    }

}

// ==========================================
// TOMBOL CETAK
// ==========================================

function cetakNilai(){

    window.print();

}

const judul=document.querySelector("h1");

if(judul){

    const btn=document.createElement("button");

    btn.innerHTML="🖨️ Cetak Nilai";

    btn.className="btn-cetak";

    btn.onclick=cetakNilai;

    judul.insertAdjacentElement("afterend",btn);

}

// ==========================================
// MULAI LOAD DATA
// ==========================================

loadNilai();
