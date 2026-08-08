//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// ABSENSI.JS V6.0
//====================================================

const URL_API =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

const role =
localStorage.getItem("role") || "";

const namaGuru =
localStorage.getItem("namaGuru") || "";

const namaSiswa =
localStorage.getItem("namaSiswa") || "";

const nisnLogin =
String(localStorage.getItem("nisn") || "").trim();

let dataSiswa = [];


//====================================================
// CEK LOGIN
//====================================================

if(localStorage.getItem("login") !== "true"){

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}


//====================================================
// TANGGAL
//====================================================

function tanggalHariIni(){

    const d = new Date();

    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2,"0") +
        "-" +
        String(d.getDate()).padStart(2,"0")
    );

}


//====================================================
// TAMPILKAN LOGIN
//====================================================

function tampilkanLogin(){

    const namaLogin =
        document.getElementById("namaLogin");

    const judulHalaman =
        document.getElementById("judulHalaman");

    const judulNilai =
        document.getElementById("judulNilai");

    const judulAbsensi =
        document.getElementById("judulAbsensi");

    const menuData =
        document.getElementById("menuData");

    const menuBeranda =
        document.getElementById("menuBeranda");

    const btnSimpan =
        document.getElementById("btnSimpan");


    if(role === "guru"){

        if(namaLogin){
            namaLogin.innerHTML =
                "👨‍🏫 " + namaGuru;
        }

        if(menuBeranda){
            menuBeranda.href = "index.html";
        }

        if(btnSimpan){
            btnSimpan.style.display = "inline-block";
        }

    }else{

        if(namaLogin){
            namaLogin.innerHTML =
                "👨‍🎓 " + namaSiswa;
        }

        if(judulHalaman){
            judulHalaman.innerHTML =
                "📅 Absensi Saya";
        }

        if(judulNilai){
            judulNilai.innerHTML =
                "Nilai Saya";
        }

        if(judulAbsensi){
            judulAbsensi.innerHTML =
                "Absensi Saya";
        }

        if(menuData){
            menuData.style.display = "none";
        }

        if(menuBeranda){
            menuBeranda.href =
                "dashboard-siswa.html";
        }

        if(btnSimpan){
            btnSimpan.style.display = "none";
        }

    }

}


//====================================================
// TAMPILKAN PESAN
//====================================================

function pesan(text){

    const info =
        document.getElementById("infoAbsensi");

    if(info){
        info.innerHTML = text;
    }

}


//====================================================
// TAMPILKAN DATA SISWA
//====================================================

function tampilkanSiswa(){

    const tbody =
        document.getElementById("tabelAbsensi");

    if(!tbody){
        console.error(
            "Elemen tabelAbsensi tidak ditemukan."
        );
        return;
    }

    tbody.innerHTML = "";


    if(dataSiswa.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;">
                    ❌ Data siswa tidak ditemukan.
                </td>
            </tr>
        `;

        pesan(
            "❌ Tidak ada data siswa."
        );

        return;
    }


    dataSiswa.forEach(function(siswa,index){

        const nama =
            String(siswa.NAMA || "").trim();

        const nisn =
            String(siswa.NISN || "").trim();


        tbody.innerHTML += `

            <tr>

                <td align="center">
                    ${index + 1}
                </td>

                <td>
                    ${nama}
                </td>

                <td align="center">
                    ${nisn}
                </td>

                <td align="center">

                    <select
                        class="status"
                        data-nama="${nama}"
                        data-nisn="${nisn}">

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


    document
        .querySelectorAll(".status")
        .forEach(function(select){

            select.addEventListener(
                "change",
                updateStatistik
            );

        });


    updateStatistik();


    pesan(
        "✅ Data siswa berhasil dimuat. " +
        "Jumlah Siswa : <b>" +
        dataSiswa.length +
        "</b>"
    );

}


//====================================================
// LOAD DATA SISWA
//====================================================

async function loadDataSiswa(){

    console.log(
        "================================"
    );

    console.log(
        "LOAD DATA SISWA DIMULAI"
    );

    console.log(
        "URL API:",
        URL_API
    );

    console.log(
        "ROLE:",
        role
    );


    pesan(
        "⏳ Mengambil data siswa dari server..."
    );


    const tbody =
        document.getElementById("tabelAbsensi");

    if(tbody){

        tbody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;">
                    ⏳ Mengambil data siswa...
                </td>
            </tr>
        `;

    }


    try{

        const response =
            await fetch(
                URL_API + "?t=" + Date.now(),
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        console.log(
            "STATUS API:",
            response.status
        );


        if(!response.ok){

            throw new Error(
                "HTTP " + response.status
            );

        }


        const json =
            await response.json();


        console.log(
            "HASIL API:",
            json
        );


        if(!Array.isArray(json)){

            throw new Error(
                "Data API bukan array."
            );

        }


        console.log(
            "JUMLAH DATA API:",
            json.length
        );


        //============================================
        // GURU
        //============================================

        if(role === "guru"){

            dataSiswa = json;

        }


        //============================================
        // SISWA
        //============================================

        else{

            dataSiswa =
                json.filter(function(item){

                    return String(
                        item.NISN || ""
                    ).trim() === nisnLogin;

                });

        }


        console.log(
            "DATA YANG DITAMPILKAN:",
            dataSiswa
        );


        tampilkanSiswa();

    }


    catch(error){

        console.error(
            "ERROR ABSENSI:",
            error
        );


        pesan(
            "❌ Gagal mengambil data siswa.<br>" +
            "<small>" +
            error.message +
            "</small>"
        );


        if(tbody){

            tbody.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:red;">

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

}


//====================================================
// STATISTIK
//====================================================

function updateStatistik(){

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;


    document
        .querySelectorAll(".status")
        .forEach(function(item){

            if(item.value === "H"){
                hadir++;
            }

            if(item.value === "S"){
                sakit++;
            }

            if(item.value === "I"){
                izin++;
            }

            if(item.value === "A"){
                alfa++;
            }

        });


    const h =
        document.getElementById("jmlHadir");

    const s =
        document.getElementById("jmlSakit");

    const i =
        document.getElementById("jmlIzin");

    const a =
        document.getElementById("jmlAlfa");


    if(h){
        h.innerHTML = hadir;
    }

    if(s){
        s.innerHTML = sakit;
    }

    if(i){
        i.innerHTML = izin;
    }

    if(a){
        a.innerHTML = alfa;
    }

}


//====================================================
// SIMPAN ABSENSI
//====================================================

async function simpanAbsensi(){

    if(role !== "guru"){

        alert(
            "Hanya guru yang dapat menyimpan absensi."
        );

        return;

    }


    const tanggalElement =
        document.getElementById("tanggal");


    if(!tanggalElement){

        alert(
            "Input tanggal tidak ditemukan."
        );

        return;

    }


    const tanggal =
        tanggalElement.value;


    const status =
        document.querySelectorAll(".status");


    if(status.length === 0){

        alert(
            "Data siswa belum tersedia."
        );

        return;

    }


    const data = [];


    status.forEach(function(item){

        data.push({

            tanggal: tanggal,

            nisn:
                item.dataset.nisn,

            nama:
                item.dataset.nama,

            status:
                item.value

        });

    });


    try{

        const response =
            await fetch(
                URL_API,
                {
                    method: "POST",

                    headers:{
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action:
                            "simpanAbsensi",

                        data:
                            data

                    })

                }
            );


        const hasil =
            await response.json();


        if(hasil.status){

            alert(
                "✅ Absensi berhasil disimpan."
            );

        }else{

            alert(
                "❌ " +
                (hasil.pesan ||
                "Gagal menyimpan absensi.")
            );

        }

    }

    catch(error){

        console.error(error);

        alert(
            "❌ Terjadi kesalahan:\n" +
            error.message
        );

    }

}


//====================================================
// LOGOUT
//====================================================

function logout(){

    if(confirm("Yakin ingin logout?")){

        localStorage.clear();

        window.location.href =
            "login.html";

    }

}


//====================================================
// INISIALISASI
//====================================================

function mulaiAbsensi(){

    console.log(
        "ABSENSI.JS V6.0 AKTIF"
    );


    // tanggal

    const tanggal =
        document.getElementById("tanggal");

    if(tanggal){

        tanggal.value =
            tanggalHariIni();

    }


    tampilkanLogin();


    // tombol simpan

    const btnSimpan =
        document.getElementById("btnSimpan");

    if(btnSimpan){

        btnSimpan.addEventListener(
            "click",
            simpanAbsensi
        );

    }


    // tombol refresh

    const btnRefresh =
        document.getElementById("btnRefresh");

    if(btnRefresh){

        btnRefresh.addEventListener(
            "click",
            loadDataSiswa
        );

    }


    // AMBIL DATA

    loadDataSiswa();

}


//====================================================
// JALANKAN
//====================================================

if(
    document.readyState === "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        mulaiAbsensi
    );

}else{

    mulaiAbsensi();

}
