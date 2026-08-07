//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// absensi.js VERSI 3.0
// Developer : Asep Jamhur
//====================================================

//====================================================
// KONFIGURASI
//====================================================

// URL Google Apps Script
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

    location.href = "login.html";

}

//====================================================
// VARIABEL GLOBAL
//====================================================

let dataSiswa = [];

let dataAbsensi = [];

let sedangMenyimpan = false;

//====================================================
// TANGGAL HARI INI
//====================================================

const inputTanggal = document.getElementById("tanggal");

if(inputTanggal){

    const hariIni = new Date();

    inputTanggal.value = hariIni.toISOString().split("T")[0];

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
// DEBUG
//====================================================

console.log("================================");

console.log("ABSENSI KELAS 5");

console.log("Versi : 3.0");

console.log("Role :", role);

console.log("NISN :", nisnLogin);

console.log("================================");
//====================================================
// BAGIAN 2
// AMBIL DATA SISWA DARI GOOGLE SPREADSHEET
//====================================================

async function loadDataSiswa(){

    const tbody = document.getElementById("tabelAbsensi");

    if(tbody){

        tbody.innerHTML=`
        <tr>
            <td colspan="4" style="text-align:center;padding:30px;">
                ⏳ Memuat data siswa...
            </td>
        </tr>
        `;

    }

    try{

        const response = await fetch(URL_API);

        if(!response.ok){

            throw new Error("Status : " + response.status);

        }

        const json = await response.json();

        console.log("Data diterima :", json);

        dataSiswa = [];

        json.forEach(function(item){

            dataSiswa.push({

                nama : String(item["NAMA"] || "").trim(),

                nisn : String(item["NISN"] || "").trim()

            });

        });

        console.log("Jumlah siswa :", dataSiswa.length);

        if(role==="siswa"){

            dataSiswa = dataSiswa.filter(function(item){

                return item.nisn === nisnLogin;

            });

        }

        tampilkanSiswa();

    }

    catch(error){

        console.error(error);

        if(tbody){

            tbody.innerHTML=`
            <tr>
                <td colspan="4"
                    style="text-align:center;
                    color:red;
                    padding:30px;">
                    ❌ Gagal mengambil data siswa.
                </td>
            </tr>
            `;

        }

        alert("❌ Gagal mengambil data siswa.");

    }

}
//====================================================
// BAGIAN 3
// TAMPILKAN DATA SISWA
//====================================================

function tampilkanSiswa(){

    const tbody = document.getElementById("tabelAbsensi");

    if(!tbody) return;

    tbody.innerHTML = "";

    if(dataSiswa.length===0){

        tbody.innerHTML = `
        <tr>
            <td colspan="4"
                style="padding:30px;
                text-align:center;
                color:red;">
                Tidak ada data siswa.
            </td>
        </tr>
        `;

        return;

    }

    dataSiswa.forEach(function(siswa,index){

        tbody.innerHTML += `

        <tr>

            <td style="text-align:center;">
                ${index+1}
            </td>

            <td>
                <b>${siswa.nama}</b>
            </td>

            <td style="text-align:center;">
                ${siswa.nisn}
            </td>

            <td style="text-align:center;">

                <select
                    class="status"
                    data-nama="${siswa.nama}"
                    data-nisn="${siswa.nisn}">

                    <option value="H" selected>
                        ✅ Hadir
                    </option>

                    <option value="S">
                        🤒 Sakit
                    </option>

                    <option value="I">
                        📝 Izin
                    </option>

                    <option value="A">
                        ❌ Alfa
                    </option>

                </select>

            </td>

        </tr>

        `;

    });

    // Aktifkan event dropdown
    tambahEventStatus();

    // Hitung statistik
    updateStatistik();

}
//====================================================
// BAGIAN 4
// EVENT STATUS DAN STATISTIK
//====================================================

//======================================
// EVENT PERUBAHAN STATUS
//======================================

function tambahEventStatus(){

    const semuaStatus = document.querySelectorAll(".status");

    semuaStatus.forEach(function(item){

        item.addEventListener("change",function(){

            updateStatistik();

        });

    });

}

//======================================
// HITUNG STATISTIK
//======================================

function updateStatistik(){

    let hadir = 0;
    let sakit = 0;
    let izin  = 0;
    let alfa  = 0;

    const semuaStatus = document.querySelectorAll(".status");

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

    //=========================
    // TAMPILKAN JUMLAH
    //=========================

    const jmlHadir = document.getElementById("jmlHadir");
    const jmlSakit = document.getElementById("jmlSakit");
    const jmlIzin  = document.getElementById("jmlIzin");
    const jmlAlfa  = document.getElementById("jmlAlfa");

    if(jmlHadir) jmlHadir.innerHTML = hadir;
    if(jmlSakit) jmlSakit.innerHTML = sakit;
    if(jmlIzin)  jmlIzin.innerHTML  = izin;
    if(jmlAlfa)  jmlAlfa.innerHTML  = alfa;

    //=========================
    // INFO SISWA
    //=========================

    const info = document.getElementById("infoAbsensi");

    if(info){

        info.innerHTML =
        "Jumlah Siswa : <b>" + semuaStatus.length + "</b>";

    }

    console.log("Hadir :", hadir);
    console.log("Sakit :", sakit);
    console.log("Izin  :", izin);
    console.log("Alfa  :", alfa);

}
//====================================================
// BAGIAN 5
// SIMPAN ABSENSI KE GOOGLE SPREADSHEET
//====================================================

async function simpanAbsensi(){

    if(sedangMenyimpan){

        return;

    }

    const tanggal = document.getElementById("tanggal").value;

    if(tanggal===""){

        alert("Silakan pilih tanggal.");

        return;

    }

    const semuaStatus = document.querySelectorAll(".status");

    if(semuaStatus.length===0){

        alert("Data siswa tidak ditemukan.");

        return;

    }

    let data = [];

    semuaStatus.forEach(function(item){

        data.push({

            tanggal : tanggal,

            nisn : item.dataset.nisn,

            nama : item.dataset.nama,

            status : item.value

        });

    });

    const btn = document.getElementById("btnSimpan");

    sedangMenyimpan = true;

    if(btn){

        btn.disabled = true;

        btn.innerHTML = "⏳ Menyimpan...";

    }

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

            throw new Error("Status : "+response.status);

        }

        const hasil = await response.json();

        if(hasil.status){

            alert("✅ " + hasil.pesan);

        }else{

            alert("❌ " + hasil.pesan);

        }

    }

    catch(error){

        console.error(error);

        alert("❌ Terjadi kesalahan saat mengirim data.");

    }

    finally{

        sedangMenyimpan = false;

        if(btn){

            btn.disabled = false;

            btn.innerHTML = "💾 Simpan Absensi";

        }

    }

}
//====================================================
// BAGIAN 6
// TOMBOL, REFRESH DAN LOAD AWAL
//====================================================

//=====================================
// TOMBOL SIMPAN
//=====================================

const btnSimpan = document.getElementById("btnSimpan");

if(btnSimpan){

    btnSimpan.addEventListener("click",function(){

        simpanAbsensi();

    });

}

//=====================================
// TOMBOL REFRESH
//=====================================

const btnRefresh = document.getElementById("btnRefresh");

if(btnRefresh){

    btnRefresh.addEventListener("click",function(){

        loadDataSiswa();

    });

}

//=====================================
// LOAD DATA PERTAMA KALI
//=====================================

window.addEventListener("DOMContentLoaded",function(){

    console.log("Portal Absensi Siap");

    loadDataSiswa();

});

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

console.log("======================================");

console.log("ABSENSI KELAS 5 SDN CIJEMBER");

console.log("Versi : 3.0 FINAL");

console.log("Role :",role);

console.log("Nama Guru :",namaGuru);

console.log("Nama Siswa :",namaSiswa);

console.log("======================================");
