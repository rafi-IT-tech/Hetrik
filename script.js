const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

// Show mobile menu
hamburgerBtn.addEventListener("click", () => {
    navbarMenu.classList.toggle("show-menu");
});

// Hide mobile menu
hideMenuBtn.addEventListener("click", () =>  hamburgerBtn.click());

// Show login popup
showPopupBtn.addEventListener("click", () => {
    document.body.classList.toggle("show-popup");
});

// Hide login popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

// Show or hide signup form
signupLoginLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
    });
});

// Login

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const successMessage = document.querySelector(".success-message");
    const errorMessage = document.querySelector(".error-message");

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const email = emailInput.value;
      const password = passwordInput.value;

      // Kirim permintaan ke mock API
      fetch("https://652a45e54791d884f1fcb765.mockapi.io/customer")
        .then((response) => response.json())
        .then((data) => {
     
          // Loop melalui data untuk mencari kecocokan email dan password
          let userFound = false;
          data.forEach(function (user) {
            console.log(user);
            if (user.email === email && user.password === password) {
              userFound = true;
              // Jika kecocokan ditemukan, tampilkan pesan sukses
              // successMessage.style.display = "block";
              // alert(`Selamat Datang ${user.nama} di aplikasi Hetrik`);

              localStorage.setItem("emailLogin", user.email);
              localStorage.setItem("namaCustomer", user.nama);

              localStorage.setItem("passwordLogin", user.password);

            //   localStorage.getItem("lastname");
            window.location.href = "landing_page.html?login=yes";
        
        }
          });

          // Jika tidak ada kecocokan, tampilkan pesan kesalahan
          if (!userFound) {
            errorMessage.style.display = "block";
          }
        });
    });
  });



//   Registrasi
  document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("emails").value;
    const password = document.getElementById("passwords").value;
    
    // console.log(email);
    // Data pendaftaran
    const data = {
        nama: nama,
        email: email,
        password: password
    };
    
    // Kirim data ke API Mock
    fetch("https://652a45e54791d884f1fcb765.mockapi.io/customer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {

        localStorage.setItem("emailLogin", data.email);
              localStorage.setItem("namaCustomer", data.nama);

              localStorage.setItem("passwordLogin", data.password);
        window.location.href = "landing_page.html?login=yes";
    })
    .catch(error => {
        console.error("Terjadi kesalahan: " + error);
    });
});
