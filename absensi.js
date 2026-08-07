//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// absensi.js VERSI 1.0
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


//====================================================
// TANGGAL HARI INI
//====================================================

const tanggal = document.getElementById("tanggal");

if(tanggal){

    tanggal.value = new Date().toISOString().split("T")[0];

}


//====================================================
// AMBIL DATA SISWA DARI SHEET NILAI
//====================================================

async function loadDataSiswa(){

    try{

        const response = await fetch(URL_API);

        if(!response.ok){

            throw new Error("Status : " + response.status);

        }

        const json = await response.json();

        console.log("Jumlah siswa :", json.length);

        dataSiswa = json;

        tampilkanSiswa();

    }

    catch(error){

        console.error(error);

        alert("❌ Gagal mengambil data siswa.");

    }

}
//====================================================
// BAGIAN 2
// TAMPILKAN DATA SISWA KE TABEL
//====================================================

function tampilkanSiswa(){

    const tbody = document.getElementById("tabelAbsensi");

    if(!tbody) return;

    tbody.innerHTML = "";

    dataSiswa.forEach(function(siswa,index){

        tbody.innerHTML += `

        <tr>

            <td align="center">${index+1}</td>

            <td>${siswa["NAMA"]}</td>

            <td align="center">${siswa["NISN"]}</td>

            <td>

                <select
                    class="status"
                    data-nama="${siswa["NAMA"]}"
                    data-nisn="${siswa["NISN"]}"
                >

                    <option value="H" selected>✅ Hadir</option>

                    <option value="S">🤒 Sakit</option>

                    <option value="I">📝 Izin</option>

                    <option value="A">❌ Alfa</option>

                </select>

            </td>

        </tr>

        `;

    });

}
//====================================================
// BAGIAN 3
// SIMPAN ABSENSI KE GOOGLE SPREADSHEET
//====================================================

async function simpanAbsensi(){

    const tanggal = document.getElementById("tanggal").value;

    if(tanggal==""){

        alert("Pilih tanggal terlebih dahulu.");

        return;

    }

    const semuaStatus = document.querySelectorAll(".status");

    let data = [];

    semuaStatus.forEach(function(item){

        data.push({

            tanggal : tanggal,

            nama : item.dataset.nama,

            nisn : item.dataset.nisn,

            status : item.value

        });

    });

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

        const hasil = await response.json();

        if(hasil.status){

            alert("✅ Absensi berhasil disimpan.");

        }else{

            alert("❌ Gagal menyimpan absensi.");

        }

    }

    catch(error){

        console.error(error);

        alert("❌ Terjadi kesalahan saat mengirim data.");

    }

}
//====================================================
// BAGIAN 4
// EVENT DAN LOAD DATA
//====================================================

// Tombol Simpan
const btnSimpan = document.getElementById("btnSimpan");

if(btnSimpan){

    btnSimpan.addEventListener("click",function(){

        simpanAbsensi();

    });

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
// LOAD DATA SISWA
//====================================================

loadDataSiswa();


//====================================================
// LOGOUT
//====================================================

function logout(){

    if(confirm("Yakin ingin logout?")){

        localStorage.clear();

        location.href = "login.html";

    }

}


//====================================================
// DEBUG
//====================================================

console.log("==============================");
console.log("ABSENSI KELAS 5");
console.log("Role :", role);
console.log("Nama Guru :", namaGuru);
console.log("Nama Siswa :", namaSiswa);
console.log("==============================");
