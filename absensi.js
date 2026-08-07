//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// absensi.js VERSI 2.0
// Developer : Asep Jamhur
//====================================================

//====================================================
// KONFIGURASI
//====================================================

const URL_API = "https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

//====================================================
// LOGIN
//====================================================

const role = localStorage.getItem("role") || "";

const namaGuru = localStorage.getItem("namaGuru") || "";

const namaSiswa = localStorage.getItem("namaSiswa") || "";

const nisnLogin = String(localStorage.getItem("nisn") || "").trim();

//====================================================
// CEK LOGIN
//====================================================

if(localStorage.getItem("login") !== "true"){

    alert("Silakan login terlebih dahulu.");

    location.href="login.html";

}

//====================================================
// VARIABEL GLOBAL
//====================================================

let dataSiswa = [];

let dataAbsensi = [];

//====================================================
// TANGGAL HARI INI
//====================================================

const inputTanggal = document.getElementById("tanggal");

if(inputTanggal){

    inputTanggal.value = new Date().toISOString().split("T")[0];

}

//====================================================
// TAMPILKAN NAMA LOGIN
//====================================================

const namaLogin = document.getElementById("namaLogin");

if(namaLogin){

    if(role==="guru"){

        namaLogin.innerHTML = "👨‍🏫 " + namaGuru;

    }else{

        namaLogin.innerHTML = "👨‍🎓 " + namaSiswa;

    }

}

//====================================================
// AMBIL DATA SISWA
//====================================================

async function loadDataSiswa(){

    try{

        const response = await fetch(URL_API);

        if(!response.ok){

            throw new Error("Status : " + response.status);

        }

        const json = await response.json();

        console.log("Jumlah siswa :",json.length);

        if(role==="guru"){

            dataSiswa = json;

        }else{

            dataSiswa = json.filter(function(item){

                return String(item["NISN"]).trim()===nisnLogin;

            });

        }

        tampilkanSiswa();

    }

    catch(error){

        console.error(error);

        alert("❌ Gagal mengambil data siswa.");

    }

}

//====================================================
// DEBUG
//====================================================

console.log("==============================");

console.log("ABSENSI KELAS 5");

console.log("Role :",role);

console.log("Nama Guru :",namaGuru);

console.log("Nama Siswa :",namaSiswa);

console.log("==============================");
//====================================================
// TAMPILKAN DATA SISWA
//====================================================

function tampilkanSiswa(){

    const tbody = document.getElementById("tabelAbsensi");

    if(!tbody) return;

    tbody.innerHTML="";

    if(dataSiswa.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="4" style="padding:30px;text-align:center;">
                Tidak ada data siswa.
            </td>
        </tr>
        `;

        return;

    }

    dataSiswa.forEach(function(siswa,index){

        tbody.innerHTML += `

        <tr>

            <td align="center">

                ${index+1}

            </td>

            <td>

                ${siswa["NAMA"]}

            </td>

            <td align="center">

                ${siswa["NISN"]}

            </td>

            <td align="center">

                <select
                    class="status"
                    data-nama="${siswa["NAMA"]}"
                    data-nisn="${siswa["NISN"]}">

                    <option value="H" selected>✅ Hadir</option>

                    <option value="S">🤒 Sakit</option>

                    <option value="I">📝 Izin</option>

                    <option value="A">❌ Alfa</option>

                </select>

            </td>

        </tr>

        `;

    });

    updateStatistik();

    tambahEventStatus();

}

//====================================================
// EVENT STATUS
//====================================================

function tambahEventStatus(){

    const semuaStatus=document.querySelectorAll(".status");

    semuaStatus.forEach(function(item){

        item.addEventListener("change",function(){

            updateStatistik();

        });

    });

}

//====================================================
// UPDATE STATISTIK
//====================================================

function updateStatistik(){

    let hadir=0;
    let sakit=0;
    let izin=0;
    let alfa=0;

    const semuaStatus=document.querySelectorAll(".status");

    semuaStatus.forEach(function(item){

        switch(item.value){

            case "H":
                hadir++;
                break;

            case "S":
                sakit++;
                break;

            case "I":
                izin++;
                break;

            case "A":
                alfa++;
                break;

        }

    });

    document.getElementById("jmlHadir").innerHTML=hadir;
    document.getElementById("jmlSakit").innerHTML=sakit;
    document.getElementById("jmlIzin").innerHTML=izin;
    document.getElementById("jmlAlfa").innerHTML=alfa;

    const info=document.getElementById("infoAbsensi");

    if(info){

        info.innerHTML=
        "Jumlah Siswa : <b>"+semuaStatus.length+"</b>";

    }

}
//====================================================
// SIMPAN ABSENSI
//====================================================

async function simpanAbsensi(){

    const tanggal = document.getElementById("tanggal").value;

    if(tanggal===""){

        alert("Silakan pilih tanggal terlebih dahulu.");

        return;

    }

    const semuaStatus = document.querySelectorAll(".status");

    if(semuaStatus.length===0){

        alert("Data siswa belum tersedia.");

        return;

    }

    let data = [];

    semuaStatus.forEach(function(item){

        data.push({

            tanggal : tanggal,

            nama : item.dataset.nama,

            nisn : item.dataset.nisn,

            status : item.value

        });

    });

    const btn = document.getElementById("btnSimpan");

    btn.disabled = true;

    btn.innerHTML = "⏳ Menyimpan...";

    try{

        const response = await fetch(URL_API,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action:"simpanAbsensi",

                data:data

            })

        });

        if(!response.ok){

            throw new Error("Status : " + response.status);

        }

        const hasil = await response.json();

        if(hasil.status){

            alert("✅ Absensi berhasil disimpan.");

        }else{

            alert("❌ " + hasil.pesan);

        }

    }

    catch(error){

        console.error(error);

        alert("❌ Gagal mengirim data.\n\n" + error);

    }

    finally{

        btn.disabled = false;

        btn.innerHTML = "💾 Simpan Absensi";

    }

}

//====================================================
// TOMBOL SIMPAN
//====================================================

const btnSimpan = document.getElementById("btnSimpan");

if(btnSimpan){

    btnSimpan.addEventListener("click",function(){

        simpanAbsensi();

    });

}
