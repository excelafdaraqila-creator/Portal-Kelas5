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
//====================================================
// BAGIAN 2
// TAMPILKAN DATA SISWA
//====================================================

function tampilkanSiswa(){

    const tbody =
        document.getElementById("tabelAbsensi");

    if(!tbody){

        console.error(
            "❌ Elemen tabelAbsensi tidak ditemukan."
        );

        return;

    }


    // Bersihkan tabel

    tbody.innerHTML = "";


    //================================================
    // JIKA DATA KOSONG
    //================================================

    if(dataSiswa.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#666;
                    font-weight:bold;">

                    ⚠️ Data siswa tidak ditemukan.

                </td>
            </tr>
        `;

        updateStatistik();

        return;

    }


    //================================================
    // TAMPILKAN SEMUA SISWA
    //================================================

    dataSiswa.forEach(function(siswa,index){

        const tr =
            document.createElement("tr");


        // Nomor

        const tdNo =
            document.createElement("td");

        tdNo.textContent =
            index + 1;

        tdNo.style.textAlign =
            "center";


        // Nama

        const tdNama =
            document.createElement("td");

        tdNama.textContent =
            siswa.nama;


        // NISN

        const tdNisn =
            document.createElement("td");

        tdNisn.textContent =
            siswa.nisn;

        tdNisn.style.textAlign =
            "center";


        // Status

        const tdStatus =
            document.createElement("td");

        tdStatus.style.textAlign =
            "center";


        const select =
            document.createElement("select");

        select.className =
            "status";


        // Simpan data siswa di select

        select.dataset.nama =
            siswa.nama;

        select.dataset.nisn =
            siswa.nisn;


        //================================================
        // PILIHAN STATUS
        //================================================

        const optionH =
            document.createElement("option");

        optionH.value = "H";

        optionH.textContent =
            "✅ Hadir";

        optionH.selected = true;


        const optionS =
            document.createElement("option");

        optionS.value = "S";

        optionS.textContent =
            "🤒 Sakit";


        const optionI =
            document.createElement("option");

        optionI.value = "I";

        optionI.textContent =
            "📝 Izin";


        const optionA =
            document.createElement("option");

        optionA.value = "A";

        optionA.textContent =
            "❌ Alfa";


        select.appendChild(optionH);

        select.appendChild(optionS);

        select.appendChild(optionI);

        select.appendChild(optionA);


        //================================================
        // EVENT PERUBAHAN STATUS
        //================================================

        select.addEventListener(
            "change",
            function(){

                updateStatistik();

            }
        );


        tdStatus.appendChild(select);


        //================================================
        // GABUNGKAN BARIS
        //================================================

        tr.appendChild(tdNo);

        tr.appendChild(tdNama);

        tr.appendChild(tdNisn);

        tr.appendChild(tdStatus);


        tbody.appendChild(tr);

    });


    //================================================
    // UPDATE STATISTIK
    //================================================

    updateStatistik();


    console.log(
        "✅ Tabel siswa berhasil ditampilkan."
    );

}
//====================================================
// BAGIAN 3
// TANGGAL + STATISTIK ABSENSI
//====================================================


//====================================================
// TANGGAL HARI INI
//====================================================

function setTanggalHariIni(){

    const inputTanggal =
        document.getElementById("tanggal");

    if(!inputTanggal){

        console.warn(
            "⚠️ Input tanggal tidak ditemukan."
        );

        return;

    }


    // Jangan mengganti tanggal yang sudah dipilih

    if(!inputTanggal.value){

        const sekarang = new Date();

        const tahun =
            sekarang.getFullYear();

        const bulan =
            String(
                sekarang.getMonth() + 1
            ).padStart(2,"0");

        const tanggal =
            String(
                sekarang.getDate()
            ).padStart(2,"0");

        inputTanggal.value =
            tahun + "-" + bulan + "-" + tanggal;

    }

}


//====================================================
// UPDATE STATISTIK
//====================================================

function updateStatistik(){

    let hadir = 0;

    let sakit = 0;

    let izin = 0;

    let alfa = 0;


    const semuaStatus =
        document.querySelectorAll(".status");


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


    //================================================
    // TAMPILKAN ANGKA
    //================================================

    const jmlHadir =
        document.getElementById("jmlHadir");

    const jmlSakit =
        document.getElementById("jmlSakit");

    const jmlIzin =
        document.getElementById("jmlIzin");

    const jmlAlfa =
        document.getElementById("jmlAlfa");


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


    //================================================
    // INFORMASI JUMLAH SISWA
    //================================================

    const infoAbsensi =
        document.getElementById("infoAbsensi");


    if(infoAbsensi){

        infoAbsensi.innerHTML =
            "Jumlah Siswa : <b>" +
            semuaStatus.length +
            "</b>" +
            " &nbsp; | &nbsp; " +
            "Hadir : <b>" +
            hadir +
            "</b>" +
            " &nbsp; | &nbsp; " +
            "Sakit : <b>" +
            sakit +
            "</b>" +
            " &nbsp; | &nbsp; " +
            "Izin : <b>" +
            izin +
            "</b>" +
            " &nbsp; | &nbsp; " +
            "Alfa : <b>" +
            alfa +
            "</b>";

    }

}


//====================================================
// JALANKAN SAAT HALAMAN SELESAI DIMUAT
//====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        setTanggalHariIni();

        updateStatistik();

    }
);
//====================================================
// BAGIAN 4
// SIMPAN ABSENSI
//====================================================


//====================================================
// FUNGSI SIMPAN ABSENSI
//====================================================

async function simpanAbsensi(){

    //================================================
    // CEK ROLE
    //================================================

    if(role !== "guru"){

        alert(
            "❌ Hanya guru yang dapat menyimpan absensi."
        );

        return;

    }


    //================================================
    // CEK PROSES SIMPAN
    //================================================

    if(sedangMenyimpan){

        alert(
            "⏳ Absensi sedang diproses..."
        );

        return;

    }


    //================================================
    // AMBIL TANGGAL
    //================================================

    const inputTanggal =
        document.getElementById("tanggal");


    if(!inputTanggal){

        alert(
            "❌ Input tanggal tidak ditemukan."
        );

        return;

    }


    const tanggal =
        inputTanggal.value.trim();


    if(tanggal === ""){

        alert(
            "❌ Silakan pilih tanggal absensi."
        );

        inputTanggal.focus();

        return;

    }


    //================================================
    // AMBIL SEMUA STATUS
    //================================================

    const semuaStatus =
        document.querySelectorAll(".status");


    if(semuaStatus.length === 0){

        alert(
            "❌ Data siswa belum tersedia."
        );

        return;

    }


    //================================================
    // KONFIRMASI
    //================================================

    const yakin = confirm(

        "Simpan absensi untuk " +
        semuaStatus.length +
        " siswa pada tanggal " +
        tanggal +
        "?"

    );


    if(!yakin){

        return;

    }


    //================================================
    // KUNCI TOMBOL
    //================================================

    sedangMenyimpan = true;


    const btnSimpan =
        document.getElementById("btnSimpan");


    const teksLama =
        btnSimpan
        ? btnSimpan.innerHTML
        : "";


    if(btnSimpan){

        btnSimpan.disabled = true;

        btnSimpan.innerHTML =
            "⏳ Menyimpan...";

    }


    try{

        //================================================
        // SIAPKAN DATA
        //================================================

        const dataAbsensi = [];


        semuaStatus.forEach(function(select){

            const nama =
                String(
                    select.dataset.nama || ""
                ).trim();


            const nisn =
                String(
                    select.dataset.nisn || ""
                ).trim();


            const status =
                String(
                    select.value || ""
                ).trim();


            dataAbsensi.push({

                tanggal: tanggal,

                nisn: nisn,

                nama: nama,

                status: status

            });

        });


        console.log(
            "Data yang akan disimpan:",
            dataAbsensi
        );


        //================================================
        // KIRIM KE GOOGLE APPS SCRIPT
        //================================================

        const response =
            await fetch(
                URL_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action:
                            "simpanAbsensi",

                        data:
                            dataAbsensi

                    })
                }
            );


        console.log(
            "Status simpan:",
            response.status
        );


        //================================================
        // BACA RESPONSE
        //================================================

        const hasil =
            await response.json();


        console.log(
            "Response Apps Script:",
            hasil
        );


        //================================================
        // JIKA BERHASIL
        //================================================

        if(hasil.status === true){

            alert(
                "✅ " +
                (hasil.pesan ||
                "Absensi berhasil disimpan.")
            );


            // Refresh statistik

            updateStatistik();


        }

        //================================================
        // JIKA GAGAL
        //================================================

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
            "❌ ERROR SIMPAN ABSENSI:",
            error
        );


        alert(

            "❌ Gagal menyimpan absensi.\n\n" +
            error.message

        );

    }


    finally{

        sedangMenyimpan = false;


        if(btnSimpan){

            btnSimpan.disabled = false;

            btnSimpan.innerHTML =
                teksLama ||
                "💾 Simpan Absensi";

        }

    }

}


//====================================================
// EVENT TOMBOL SIMPAN
//====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const btnSimpan =
            document.getElementById("btnSimpan");


        if(btnSimpan){

            btnSimpan.addEventListener(
                "click",
                function(){

                    simpanAbsensi();

                }
            );

        }

    }
);
//====================================================
// BAGIAN 5
// PENGATURAN HALAMAN + REFRESH + INISIALISASI
//====================================================


//====================================================
// ATUR TAMPILAN BERDASARKAN ROLE
//====================================================

function aturTampilanRole(){

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


    //================================================
    // GURU
    //================================================

    if(role === "guru"){

        if(menuBeranda){

            menuBeranda.href =
                "index.html";

        }


        if(namaLogin){

            namaLogin.innerHTML =
                "👨‍🏫 " +
                namaGuru;

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

        if(menuBeranda){

            menuBeranda.href =
                "dashboard-siswa.html";

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


        if(namaLogin){

            namaLogin.innerHTML =
                "👨‍🎓 " +
                namaSiswa;

        }


        // Siswa tidak boleh menyimpan absensi

        if(btnSimpan){

            btnSimpan.style.display =
                "none";

        }

    }

}


//====================================================
// TOMBOL REFRESH
//====================================================

function pasangTombolRefresh(){

    const btnRefresh =
        document.getElementById("btnRefresh");


    if(!btnRefresh){

        return;

    }


    btnRefresh.addEventListener(
        "click",
        function(){

            btnRefresh.disabled =
                true;

            btnRefresh.innerHTML =
                "⏳ Memuat...";


            loadDataSiswa()
                .finally(function(){

                    btnRefresh.disabled =
                        false;

                    btnRefresh.innerHTML =
                        "🔄 Refresh";

                });

        }
    );

}


//====================================================
// LOGOUT
//====================================================

function logout(){

    const yakin =
        confirm(
            "Yakin ingin logout?"
        );


    if(!yakin){

        return;

    }


    localStorage.removeItem("login");

    localStorage.removeItem("role");

    localStorage.removeItem("namaGuru");

    localStorage.removeItem("namaSiswa");

    localStorage.removeItem("nisn");


    window.location.href =
        "login.html";

}


//====================================================
// INISIALISASI HALAMAN
//====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        console.log(
            "===================================="
        );

        console.log(
            "ABSENSI KELAS 5 DIMULAI"
        );

        console.log(
            "Role:",
            role
        );

        console.log(
            "===================================="
        );


        // Atur guru/siswa

        aturTampilanRole();


        // Pasang tombol refresh

        pasangTombolRefresh();


        // Isi tanggal

        setTanggalHariIni();


        // Ambil data siswa

        loadDataSiswa();

    }
);
//====================================================
// BAGIAN 6
// PENGAMAN AKHIR absensi.js
//====================================================


//====================================================
// CEGAH LOAD DATA BERULANG
//====================================================

let absensiSudahDimuat = false;


// Simpan fungsi loadDataSiswa asli
const loadDataSiswaAsli = loadDataSiswa;


// Ganti dengan fungsi pengaman
loadDataSiswa = async function(){

    // Jika sedang proses, jangan jalankan lagi
    if(absensiSudahDimuat){

        console.log(
            "ℹ️ Data siswa sudah pernah dimuat."
        );

        return;

    }


    try{

        await loadDataSiswaAsli();

        absensiSudahDimuat = true;

        console.log(
            "✅ Data absensi berhasil dimuat."
        );

    }

    catch(error){

        console.error(
            "❌ Gagal memuat data absensi:",
            error
        );

    }

};
