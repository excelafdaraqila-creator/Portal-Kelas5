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
