function postData() {
    const namaBangunan = document.getElementById("namaBangunan").value;
    const dayaListrik = document.getElementById("dropdown").value;
    const data = {
        name: namaBangunan,
        power: dayaListrik
    };

    fetch('https://6525650567cfb1e59ce73564.mockapi.io/building', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data berhasil disimpan:', data);

        localStorage.setItem("dayaBangunan", data.power);

        window.location.href='energy_saving_calculator.html';
        // Anda dapat menambahkan tindakan lain di sini, seperti mengarahkan pengguna ke halaman lain.
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
    });
}


  // Fungsi untuk logout
  function logout() {
    localStorage.clear();
    
    window.location.href = "index.html"; // Ganti dengan halaman login yang sesuai
   
  }
  
  // Tambahkan event listener untuk tombol logout
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault(); // Mencegah tindakan default dari tautan
      logout(); // Panggil fungsi logout
    });
  }