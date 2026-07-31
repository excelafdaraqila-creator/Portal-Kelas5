function login(){

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const pesan = document.getElementById("pesan");

    pesan.innerHTML="";

    // =========================
    // LOGIN GURU
    // =========================

    if(username==="guru" && password==="12345"){

        localStorage.setItem("login","true");
        localStorage.setItem("role","guru");
        localStorage.removeItem("namaSiswa");
        localStorage.setItem("namaGuru","Gr. Asep Jamhur, S.Pd., M.M.");

        window.location.href="index.html";
        return;
    }

    // =========================
    // LOGIN SISWA
    // =========================

    let siswa = akunSiswa.find(function(item){

        return item.nisn===username &&
               item.nisn===password;

    });

    if(siswa){

        localStorage.setItem("login","true");
        localStorage.setItem("role","siswa");
        localStorage.removeItem("namaGuru");
        localStorage.setItem("namaSiswa",siswa.nama);
        localStorage.setItem("nisn",siswa.nisn);

        window.location.href="index.html";
        return;
    }

    // =========================

    pesan.innerHTML="❌ Username atau Password salah.";

}

document.addEventListener("keypress",function(e){

    if(e.key==="Enter"){
        login();
    }

});
