//====================================================
// ABSENSI.JS
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// VERSI 6.0 FINAL
//====================================================


//====================================================
// KONFIGURASI API GOOGLE APPS SCRIPT
//====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


//====================================================
// VARIABEL GLOBAL
//====================================================

let daftarSiswa = [];

let dataAbsensi = [];

let sedangMemuat = false;

let sedangMenyimpan = false;


//====================================================
// ELEMENT HTML
//====================================================

const tabelAbsensi =
document.getElementById("tabelAbsensi");

const infoAbsensi =
document.getElementById("infoAbsensi");

const tanggalInput =
document.getElementById("tanggal");

const btnSimpan =
document.getElementById("btnSimpan");

const btnRefresh =
document.getElementById("btnRefresh");

const jmlHadir =
document.getElementById("jmlHadir");

const jmlSakit =
document.getElementById("jmlSakit");

const jmlIzin =
document.getElementById("jmlIzin");

const jmlAlfa =
document.getElementById("jmlAlfa");


//====================================================
// ROLE LOGIN
//====================================================

const role =
localStorage.getItem("role") || "";

const namaGuru =
localStorage.getItem("namaGuru") || "";

const namaSiswa =
localStorage.getItem("namaSiswa") || "";


//====================================================
// SAAT HALAMAN SELESAI DIMUAT
//====================================================

document.addEventListener(
"DOMContentLoaded",
function(){

    mulaiAbsensi();

});


//====================================================
// FUNGSI UTAMA
//====================================================

async function mulaiAbsensi(){

    try{

        // tanggal otomatis
        setTanggalHariIni();

        // reset statistik
        resetStatistik();

        // tampilkan loading
        tampilkanLoading();

        // ambil data siswa
        await loadDataSiswa();

    }

    catch(error){

        console.error(
            "ERROR MULAI ABSENSI:",
            error
        );

        tampilkanError(
            "Gagal memuat data siswa. " +
            error.message
        );

    }

}
