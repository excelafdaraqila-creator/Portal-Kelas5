// ====================================================
// ABSENSI.JS - TES KONEKSI DATA SISWA
// ====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxNtenvfcjjFNTCtpi2B-d7cLHMfZYk0-z8W36YvoULqOc6w5r6QZGzchJ2KQfCK9Gv/exec";

console.log("ABSENSI.JS MULAI");


// ====================================================
// JALANKAN SETELAH HTML SIAP
// ====================================================

function jalankanAbsensi(){

    console.log("FUNGSI ABSENSI BERJALAN");

    const tabel =
        document.getElementById("tabelAbsensi");

    const info =
        document.getElementById("infoAbsensi");


    if(!tabel){

        console.error(
            "ERROR: #tabelAbsensi tidak ditemukan"
        );

        return;
    }


    tabel.innerHTML = `
        <tr>
            <td colspan="4"
            style="
            padding:30px;
            text-align:center;
            color:#2563eb;
            font-weight:bold;
            ">
            🔄 Menghubungkan ke database...
            </td>
        </tr>
    `;


    if(info){

        info.innerHTML =
        "🔄 Mengambil data siswa dari database...";

    }


    const url =
        API_URL +
        "?action=siswa&nocache=" +
        Date.now();


    console.log("URL API:");
    console.log(url);


    fetch(url)

    .then(function(response){

        console.log(
            "STATUS SERVER:",
            response.status
        );

        if(!response.ok){

            throw new Error(
                "Server error: " +
                response.status
            );

        }

        return response.text();

    })

    .then(function(text){

        console.log("DATA DARI SERVER:");
        console.log(text);


        if(!text){

            throw new Error(
                "Server mengirim data kosong."
            );

        }


        let data;


        try{

            data = JSON.parse(text);

        }

        catch(error){

            throw new Error(
                "Data server bukan JSON."
            );

        }


        console.log(
            "DATA JSON:",
            data
        );


        if(!Array.isArray(data)){

            throw new Error(
                "Data siswa bukan Array."
            );

        }


        if(data.length === 0){

            throw new Error(
                "Data siswa kosong."
            );

        }


        // ============================================
        // TAMPILKAN SISWA
        // ============================================

        tabel.innerHTML = "";


        data.forEach(function(siswa,index){

            const nisn =
                siswa.NISN ||
                siswa.nisn ||
                "";

            const nama =
                siswa.NAMA ||
                siswa.nama ||
                "";


            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td style="
                text-align:center;
                padding:10px;
                ">
                ${index + 1}
                </td>

                <td style="
                padding:10px;
                font-weight:bold;
                ">
                ${nama}
                </td>

                <td style="
                padding:10px;
                ">
                ${nisn}
                </td>

                <td style="
                padding:10px;
                ">

                    <select
                    class="status-absensi"
                    data-nisn="${nisn}"
                    data-nama="${nama}"
                    style="
                    padding:8px;
                    border-radius:6px;
                    ">

                        <option value="H">
                        H - Hadir
                        </option>

                        <option value="S">
                        S - Sakit
                        </option>

                        <option value="I">
                        I - Izin
                        </option>

                        <option value="A">
                        A - Alfa
                        </option>

                    </select>

                </td>

            `;


            tabel.appendChild(tr);

        });


        if(info){

            info.innerHTML =
            "✅ Data siswa berhasil dimuat: " +
            data.length +
            " siswa.";

        }


        console.log(
            "BERHASIL MENAMPILKAN " +
            data.length +
            " SISWA"
        );


        hitungStatistik();

    })

    .catch(function(error){

        console.error(
            "ERROR ABSENSI:",
            error
        );


        tabel.innerHTML = `

            <tr>

                <td colspan="4"
                style="
                padding:30px;
                text-align:center;
                color:red;
                font-weight:bold;
                ">

                ❌ Gagal mengambil data siswa

                <br><br>

                ${error.message}

                </td>

            </tr>

        `;


        if(info){

            info.innerHTML =
            "❌ " + error.message;

        }

    });

}


// ====================================================
// STATISTIK
// ====================================================

function hitungStatistik(){

    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );


    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;


    semua.forEach(function(select){

        if(select.value === "H"){
            hadir++;
        }

        if(select.value === "S"){
            sakit++;
        }

        if(select.value === "I"){
            izin++;
        }

        if(select.value === "A"){
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


    if(h) h.innerText = hadir;
    if(s) s.innerText = sakit;
    if(i) i.innerText = izin;
    if(a) a.innerText = alfa;

}


// ====================================================
// PERUBAHAN STATUS
// ====================================================

document.addEventListener(
"change",
function(event){

    if(
        event.target.classList.contains(
            "status-absensi"
        )
    ){

        hitungStatistik();

    }

});


// ====================================================
// TOMBOL REFRESH
// ====================================================

const tombolRefresh =
document.getElementById("btnRefresh");


if(tombolRefresh){

    tombolRefresh.onclick =
    function(){

        location.reload();

    };

}


// ====================================================
// MULAI
// ====================================================

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        jalankanAbsensi
    );

}
else{

    jalankanAbsensi();

}
// ====================================================
// SIMPAN ABSENSI
// ====================================================

if(btnSimpan){

    btnSimpan.addEventListener(
        "click",
        simpanAbsensi
    );

}


// ====================================================
// FUNGSI SIMPAN ABSENSI
// ====================================================

async function simpanAbsensi(){

    // -----------------------------------------------
    // CEGAH KLIK BERULANG
    // -----------------------------------------------

    if(sedangMenyimpan){

        return;

    }


    // -----------------------------------------------
    // CEK TANGGAL
    // -----------------------------------------------

    const tanggal =
        tanggalInput ?
        tanggalInput.value :
        "";


    if(!tanggal){

        alert(
            "⚠️ Silakan pilih tanggal absensi terlebih dahulu."
        );

        return;

    }


    // -----------------------------------------------
    // AMBIL SEMUA STATUS
    // -----------------------------------------------

    const semua =
        document.querySelectorAll(
            ".status-absensi"
        );


    if(semua.length === 0){

        alert(
            "❌ Data siswa belum tersedia."
        );

        return;

    }


    // -----------------------------------------------
    // KONFIRMASI
    // -----------------------------------------------

    const yakin =
        confirm(
            "Simpan absensi untuk " +
            semua.length +
            " siswa pada tanggal " +
            tanggal +
            "?"
        );


    if(!yakin){

        return;

    }


    sedangMenyimpan = true;


    // -----------------------------------------------
    // UBAH TOMBOL
    // -----------------------------------------------

    const teksLama =
        btnSimpan.innerHTML;


    btnSimpan.disabled = true;

    btnSimpan.innerHTML =
        "⏳ Menyimpan...";


    try{

        // -------------------------------------------
        // BENTUK DATA
        // -------------------------------------------

        const data = [];


        semua.forEach(
            function(select){

                data.push({

                    tanggal:
                        tanggal,

                    nisn:
                        select.dataset.nisn || "",

                    nama:
                        select.dataset.nama || "",

                    status:
                        select.value || "H"

                });

            }
        );


        console.log(
            "DATA YANG AKAN DISIMPAN:",
            data
        );


        // -------------------------------------------
        // KIRIM KE GOOGLE APPS SCRIPT
        // -------------------------------------------

        const response =
            await fetch(
                API_URL,
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


        console.log(
            "STATUS SIMPAN:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "RESPONSE SIMPAN:",
            text
        );


        let hasil;


        try{

            hasil =
                JSON.parse(text);

        }

        catch(error){

            throw new Error(
                "Response dari server tidak valid."
            );

        }


        // -------------------------------------------
        // CEK HASIL
        // -------------------------------------------

        if(
            hasil.status !== true
        ){

            throw new Error(
                hasil.pesan ||
                "Absensi gagal disimpan."
            );

        }


        // -------------------------------------------
        // BERHASIL
        // -------------------------------------------

        alert(
            "✅ Absensi berhasil disimpan!\n\n" +
            "Tanggal: " + tanggal +
            "\nJumlah siswa: " +
            data.length
        );


        console.log(
            "ABSENSI BERHASIL DISIMPAN"
        );


    }

    catch(error){

        console.error(
            "ERROR SIMPAN ABSENSI:",
            error
        );


        alert(
            "❌ Gagal menyimpan absensi.\n\n" +
            error.message
        );

    }

    finally{

        sedangMenyimpan = false;

        btnSimpan.disabled = false;

        btnSimpan.innerHTML =
            teksLama;

    }

}
// ====================================================
// FUNGSI SIMPAN ABSENSI
// ====================================================

async function simpanAbsensi() {

    console.log("🟢 simpanAbsensi dijalankan");

    const tanggalElement =
        document.getElementById("tanggal");

    if (!tanggalElement) {
        alert("❌ Kolom tanggal tidak ditemukan.");
        return;
    }

    const tanggal = tanggalElement.value;

    if (!tanggal) {
        alert("⚠️ Silakan pilih tanggal terlebih dahulu.");
        return;
    }

    const siswa =
        document.querySelectorAll(".status-absensi");

    console.log("Jumlah data siswa:", siswa.length);

    if (siswa.length === 0) {
        alert("❌ Data siswa belum ditemukan.");
        return;
    }

    const konfirmasi = confirm(
        "Simpan absensi untuk " +
        siswa.length +
        " siswa pada tanggal " +
        tanggal +
        "?"
    );

    if (!konfirmasi) {
        return;
    }

    const data = [];

    siswa.forEach(function(select) {

        data.push({
            tanggal: tanggal,
            nisn: select.dataset.nisn || "",
            nama: select.dataset.nama || "",
            status: select.value || "H"
        });

    });

    console.log("Data absensi:", data);

    const tombol =
        document.getElementById("btnSimpan");

    if (tombol) {
        tombol.disabled = true;
        tombol.innerHTML = "⏳ Menyimpan...";
    }

    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: "simpanAbsensi",
                    data: data
                })
            }
        );

        const hasilText =
            await response.text();

        console.log(
            "Response Google Apps Script:",
            hasilText
        );

        const hasil =
            JSON.parse(hasilText);

        if (hasil.status !== true) {

            throw new Error(
                hasil.pesan ||
                "Absensi gagal disimpan."
            );

        }

        alert(
            "✅ Absensi berhasil disimpan!\n\n" +
            "Tanggal: " + tanggal +
            "\nJumlah siswa: " + data.length
        );

    } catch (error) {

        console.error(
            "❌ Gagal menyimpan:",
            error
        );

        alert(
            "❌ Gagal menyimpan absensi.\n\n" +
            error.message
        );

    } finally {

        if (tombol) {
            tombol.disabled = false;
            tombol.innerHTML =
                "💾 Simpan Absensi";
        }

    }

}
// ====================================================
// HUBUNGKAN TOMBOL SIMPAN ABSENSI
// ====================================================

document.addEventListener("DOMContentLoaded", function () {

    const tombolSimpan =
        document.getElementById("btnSimpan");

    if (!tombolSimpan) {

        console.error(
            "❌ Tombol btnSimpan tidak ditemukan!"
        );

        return;
    }

    console.log(
        "✅ Tombol Simpan Absensi ditemukan."
    );


    tombolSimpan.onclick = function (event) {

        event.preventDefault();

        console.log(
            "🟢 TOMBOL SIMPAN DIKLIK"
        );

        simpanAbsensi();

    };

});
