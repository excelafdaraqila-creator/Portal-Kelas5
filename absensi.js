//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// absensi.js VERSI 4.1 STABIL
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

const namaGuru =
    localStorage.getItem("namaGuru") || "";

const namaSiswa =
    localStorage.getItem("namaSiswa") || "";

const nisnLogin =
    String(localStorage.getItem("nisn") || "").trim();


//====================================================
// CEK LOGIN
//====================================================

if(localStorage.getItem("login") !== "true"){

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}


//====================================================
// VARIABEL GLOBAL
//====================================================

let dataSiswa = [];

let sedangMenyimpan = false;


//====================================================
// LOAD DATA SISWA
//====================================================

async function loadDataSiswa(){

    console.log("====================================");
    console.log("MULAI LOAD DATA SISWA");
    console.log("URL API :", URL_API);
    console.log("ROLE :", role);
    console.log("====================================");

    const tbody =
        document.getElementById("tabelAbsensi");

    if(!tbody){

        console.error(
            "❌ Elemen #tabelAbsensi tidak ditemukan."
        );

        return;

    }


    // Tampilkan loading

    tbody.innerHTML = `
        <tr>
            <td colspan="4"
                style="
                padding:30px;
                text-align:center;
                font-weight:bold;
                color:#2563eb;">
                ⏳ Memuat data siswa...
            </td>
        </tr>
    `;


    try{

        console.log("Menghubungkan ke Google Apps Script...");


        const response = await fetch(URL_API, {
            method: "GET",
            cache: "no-store"
        });


        console.log(
            "Status response :",
            response.status
        );


        if(!response.ok){

            throw new Error(
                "HTTP Error " + response.status
            );

        }


        const json = await response.json();


        console.log(
            "JSON dari Apps Script :",
            json
        );


        if(!Array.isArray(json)){

            throw new Error(
                "Data yang diterima bukan array."
            );

        }


        // Kosongkan data lama

        dataSiswa = [];


        // Ambil NAMA dan NISN

        json.forEach(function(item){

            const nama =
                String(item["NAMA"] || "").trim();

            const nisn =
                String(item["NISN"] || "").trim();


            if(nama !== "" || nisn !== ""){

                dataSiswa.push({

                    nama: nama,

                    nisn: nisn

                });

            }

        });


        console.log(
            "Jumlah data siswa :",
            dataSiswa.length
        );


        //================================================
        // FILTER SISWA
        //================================================

        if(role === "siswa"){

            dataSiswa =
                dataSiswa.filter(function(item){

                    return item.nisn === nisnLogin;

                });

        }


        //================================================
        // TAMPILKAN
        //================================================

        tampilkanSiswa();


    }

    catch(error){

        console.error(
            "❌ ERROR LOAD DATA SISWA:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:red;
                    font-weight:bold;">

                    ❌ Gagal mengambil data siswa.

                    <br><br>

                    <small>
                    ${error.message}
                    </small>

                </td>
            </tr>
        `;

    }

}
