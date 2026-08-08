//====================================================
// PORTAL DIGITAL KELAS 5 SDN CIJEMBER
// absensi.js FINAL
// Developer : Asep Jamhur
//====================================================


//====================================================
// KONFIGURASI API
//====================================================

const URL_API =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";


//====================================================
// LOGIN
//====================================================

const role =
localStorage.getItem("role") || "";

const namaGuru =
localStorage.getItem("namaGuru") || "";

const namaSiswa =
localStorage.getItem("namaSiswa") || "";

const nisnLogin =
String(
    localStorage.getItem("nisn") || ""
).trim();


//====================================================
// CEK LOGIN
//====================================================

if(
    localStorage.getItem("login") !== "true"
){

    alert("Silakan login terlebih dahulu.");

    window.location.href =
        "login.html";
}


//====================================================
// DATA GLOBAL
//====================================================

let dataSiswa = [];

let sedangMenyimpan = false;


//====================================================
// FUNGSI FORMAT TANGGAL
//====================================================

function tanggalHariIni(){

    const d = new Date();

    const tahun =
        d.getFullYear();

    const bulan =
        String(
            d.getMonth() + 1
        ).padStart(2,"0");

    const tanggal =
        String(
            d.getDate()
        ).padStart(2,"0");

    return (
        tahun +
        "-" +
        bulan +
        "-" +
        tanggal
    );
}


//====================================================
// SET TANGGAL
//====================================================

function setTanggal(){

    const input =
        document.getElementById("tanggal");

    if(!input){

        return;

    }

    if(!input.value){

        input.value =
            tanggalHariIni();

    }

}


//====================================================
// TAMPILKAN NAMA LOGIN
//====================================================

function tampilkanLogin(){

    const namaLogin =
        document.getElementById(
            "namaLogin"
        );

    const judulHalaman =
        document.getElementById(
            "judulHalaman"
        );

    const judulNilai =
        document.getElementById(
            "judulNilai"
        );

    const judulAbsensi =
        document.getElementById(
            "judulAbsensi"
        );

    const menuData =
        document.getElementById(
            "menuData"
        );

    const menuBeranda =
        document.getElementById(
            "menuBeranda"
        );

    const btnSimpan =
        document.getElementById(
            "btnSimpan"
        );


    //================================================
    // GURU
    //================================================

    if(role === "guru"){

        if(namaLogin){

            namaLogin.innerHTML =
                "👨‍🏫 " +
                namaGuru;

        }

        if(menuBeranda){

            menuBeranda.href =
                "index.html";

        }

        if(btnSimpan){

            btnSimpan.style.display =
                "inline-block";

        }

        return;

    }


    //================================================
    // SISWA
    //================================================

    if(role === "siswa"){

        if(namaLogin){

            namaLogin.innerHTML =
                "👨‍🎓 " +
                namaSiswa;

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

            menuData.style.display =
                "none";

        }

        if(menuBeranda){

            menuBeranda.href =
                "dashboard-siswa.html";

        }

        if(btnSimpan){

            btnSimpan.style.display =
                "none";

        }

    }

}


//====================================================
// AMBIL DATA SISWA DARI GOOGLE APPS SCRIPT
//====================================================

async function loadDataSiswa(){

    const info =
        document.getElementById(
            "infoAbsensi"
        );

    const tbody =
        document.getElementById(
            "tabelAbsensi"
        );


    if(info){

        info.innerHTML =
            "⏳ Mengambil data siswa...";

    }


    if(tbody){

        tbody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#666;">
                    ⏳ Sedang mengambil
                    data siswa...
                </td>
            </tr>
        `;

    }


    try{

        console.log(
            "================================"
        );

        console.log(
            "ABSENSI - MEMANGGIL API"
        );

        console.log(
            "URL:",
            URL_API
        );

        console.log(
            "Role:",
            role
        );


        //============================================
        // REQUEST GET
        //============================================

        const response =
            await fetch(
                URL_API,
                {
                    method:"GET",
                    cache:"no-store"
                }
            );


        console.log(
            "HTTP STATUS:",
            response.status
        );


        if(!response.ok){

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        //============================================
        // BACA JSON
        //============================================

        const json =
            await response.json();


        console.log(
            "DATA DARI API:",
            json
        );


        console.log(
            "JUMLAH DATA:",
            Array.isArray(json)
                ? json.length
                : "BUKAN ARRAY"
        );


        //============================================
        // VALIDASI
        //============================================

        if(!Array.isArray(json)){

            throw new Error(
                "Data dari Google Apps Script bukan array."
            );

        }


        //============================================
        // JIKA GURU
        //============================================

        if(role === "guru"){

            dataSiswa =
                json;

        }


        //============================================
        // JIKA SISWA
        //============================================

        else{

            dataSiswa =
                json.filter(
                    function(item){

                        return String(
                            item.NISN || ""
                        ).trim()
                        ===
                        nisnLogin;

                    }
                );

        }


        console.log(
            "DATA SISWA SETELAH FILTER:",
            dataSiswa
        );


        //============================================
        // TAMPILKAN
        //============================================

        tampilkanSiswa();


    }

    catch(error){

        console.error(
            "================================"
        );

        console.error(
            "ERROR LOAD DATA SISWA"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        if(info){

            info.innerHTML =
                "❌ Gagal mengambil data siswa.";

        }


        if(tbody){

            tbody.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:red;">
                        ❌ Gagal mengambil
                        data siswa.<br><br>
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
// TAMPILKAN DATA SISWA
//====================================================

function tampilkanSiswa(){

    const tbody =
        document.getElementById(
            "tabelAbsensi"
        );


    if(!tbody){

        console.error(
            "❌ tabelAbsensi tidak ditemukan."
        );

        return;

    }


    tbody.innerHTML = "";


    //================================================
    // TIDAK ADA DATA
    //================================================

    if(dataSiswa.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#666;">
                    ❌ Tidak ada data siswa.
                </td>
            </tr>
        `;

        updateStatistik();

        return;

    }


    //================================================
    // TAMPILKAN SISWA
    //================================================

    dataSiswa.forEach(
        function(siswa,index){

            const nama =
                String(
                    siswa.NAMA || ""
                ).trim();

            const nisn =
                String(
                    siswa.NISN || ""
                ).trim();


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

                            <option value="H"
                                selected>
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

        }
    );


    //================================================
    // EVENT STATUS
    //================================================

    document
        .querySelectorAll(".status")
        .forEach(
            function(select){

                select.addEventListener(
                    "change",
                    updateStatistik
                );

            }
        );


    updateStatistik();


    //================================================
    // INFORMASI
    //================================================

    const info =
        document.getElementById(
            "infoAbsensi"
        );


    if(info){

        info.innerHTML =
            "✅ Data siswa berhasil dimuat. " +
            "Jumlah Siswa : <b>" +
            dataSiswa.length +
            "</b>";

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
        .forEach(
            function(item){

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

            }
        );


    const jmlHadir =
        document.getElementById(
            "jmlHadir"
        );

    const jmlSakit =
        document.getElementById(
            "jmlSakit"
        );

    const jmlIzin =
        document.getElementById(
            "jmlIzin"
        );

    const jmlAlfa =
        document.getElementById(
            "jmlAlfa"
        );


    if(jmlHadir){

        jmlHadir.textContent =
            hadir;

    }

    if(jmlSakit){

        jmlSakit.textContent =
            sakit;

    }

    if(jmlIzin){

        jmlIzin.textContent =
            izin;

    }

    if(jmlAlfa){

        jmlAlfa.textContent =
            alfa;

    }

}


//====================================================
// SIMPAN ABSENSI
//====================================================

async function simpanAbsensi(){

    if(role !== "guru"){

        alert(
            "❌ Hanya guru yang dapat menyimpan absensi."
        );

        return;

    }


    if(sedangMenyimpan){

        return;

    }


    const inputTanggal =
        document.getElementById(
            "tanggal"
        );


    if(!inputTanggal){

        alert(
            "❌ Input tanggal tidak ditemukan."
        );

        return;

    }


    const tanggal =
        inputTanggal.value;


    if(!tanggal){

        alert(
            "❌ Silakan pilih tanggal."
        );

        return;

    }


    const semuaStatus =
        document.querySelectorAll(
            ".status"
        );


    if(semuaStatus.length === 0){

        alert(
            "❌ Data siswa belum tersedia."
        );

        return;

    }


    if(
        !confirm(
            "Simpan absensi " +
            semuaStatus.length +
            " siswa?"
        )
    ){

        return;

    }


    sedangMenyimpan = true;


    const btn =
        document.getElementById(
            "btnSimpan"
        );


    if(btn){

        btn.disabled = true;

        btn.innerHTML =
            "⏳ Menyimpan...";

    }


    try{

        const data = [];


        semuaStatus.forEach(
            function(select){

                data.push({

                    tanggal:
                        tanggal,

                    nisn:
                        String(
                            select.dataset.nisn ||
                            ""
                        ).trim(),

                    nama:
                        String(
                            select.dataset.nama ||
                            ""
                        ).trim(),

                    status:
                        select.value

                });

            }
        );


        console.log(
            "DATA ABSENSI:",
            data
        );


        const response =
            await fetch(
                URL_API,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "simpanAbsensi",

                            data:
                                data

                        })
                }
            );


        const hasil =
            await response.json();


        console.log(
            "HASIL SIMPAN:",
            hasil
        );


        if(hasil.status === true){

            alert(
                "✅ " +
                (
                    hasil.pesan ||
                    "Absensi berhasil disimpan."
                )
            );

        }

        else{

            alert(
                "❌ " +
                (
                    hasil.pesan ||
                    "Absensi gagal disimpan."
                )
            );

        }

    }

    catch(error){

        console.error(
            "ERROR SIMPAN:",
            error
        );

        alert(
            "❌ Gagal menyimpan absensi.\n\n" +
            error.message
        );

    }

    finally{

        sedangMenyimpan = false;


        if(btn){

            btn.disabled = false;

            btn.innerHTML =
                "💾 Simpan Absensi";

        }

    }

}


//====================================================
// REFRESH
//====================================================

function refreshAbsensi(){

    const btn =
        document.getElementById(
            "btnRefresh"
        );


    if(btn){

        btn.disabled = true;

        btn.innerHTML =
            "⏳ Memuat...";

    }


    loadDataSiswa()
        .finally(
            function(){

                if(btn){

                    btn.disabled = false;

                    btn.innerHTML =
                        "🔄 Refresh";

                }

            }
        );

}


//====================================================
// LOGOUT
//====================================================

function logout(){

    if(
        !confirm(
            "Yakin ingin logout?"
        )
    ){

        return;

    }


    localStorage.clear();

    window.location.href =
        "login.html";

}


//====================================================
// INISIALISASI
//====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        console.log(
            "================================"
        );

        console.log(
            "ABSENSI KELAS 5 SDN CIJEMBER"
        );

        console.log(
            "absensi.js berhasil dijalankan"
        );

        console.log(
            "Role:",
            role
        );

        console.log(
            "================================"
        );


        setTanggal();

        tampilkanLogin();


        const btnSimpan =
            document.getElementById(
                "btnSimpan"
            );


        if(btnSimpan){

            btnSimpan.addEventListener(
                "click",
                simpanAbsensi
            );

        }


        const btnRefresh =
            document.getElementById(
                "btnRefresh"
            );


        if(btnRefresh){

            btnRefresh.addEventListener(
                "click",
                refreshAbsensi
            );

        }


        //============================================
        // INI YANG AKAN MENGAMBIL 50 SISWA
        //============================================

        loadDataSiswa();

    }
);
