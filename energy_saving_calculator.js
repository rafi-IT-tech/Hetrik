   // Function to fetch data from the API
   function fetchData(query) {
    const url = `https://652a45e54791d884f1fcb765.mockapi.io/barang?q=${query}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.error(error));
  }

  // Function to update the search results
  function updateSearchResults(results) {
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = "";

    results.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card col-md-3 mt-3 ml-5"; // Use col-md-4 for three columns

      card.innerHTML = `
            <img src="${item.avatar}" class="card-img-center" alt="${item.device}"> <!-- Image added here -->

                <div class="card-body">
                    <h5 class="card-title">${item.device}</h5>
                    <p class="card-text">${item.power}</p>
                    <button class="btn btn-primary" onclick="handleSelectCalculate(this)" style="text-align:center">Select calculate</button>
                </div>
            `;
      searchResults.appendChild(card);
    });
  }

  function removeRow(buttonElement) {
    const row = buttonElement.closest("tr"); // Dapatkan elemen <tr> yang berisi data yang akan dihapus
    const device = row.querySelector(".input-device input").value; // Dapatkan nama perangkat dari elemen input
    // const url = `https://652a45e54791d884f1fcb765.mockapi.io/barang?q=${device}`;

    row.remove();
  }

  // Perform search on blur
  function performSearch() {
    const searchInput = document.getElementById("cari");
    const query = searchInput.value;
    if (query.length >= 2) {
      fetchData(query).then((data) => {
        // Filter results by name of the item
        const filteredResults = data.filter((item) =>
          item.device.toLowerCase().includes(query.toLowerCase())
        );
        updateSearchResults(filteredResults);
      });
    } else {
      // Display default three data items
      const defaultResults = [
        {
          device: "Device 1",
          power: "1000",
          avatar:
            "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/550.jpg",
        },
        {
          device: "Device 2",
          power: "1500 ",
          avatar:
            "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/890.jpg",
        },
        {
          device: "Device 3",
          power: "800",
          avatar:
            "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/19.jpg",
        },
      ];
      updateSearchResults(defaultResults);
    }
  }

  performSearch();
  function handleSelectCalculate(buttonElement, results) {
    // Dapatkan elemen yang berisi informasi item
    const cardBody = buttonElement.closest(".card-body");
    const titleElement = cardBody.querySelector(".card-title");
    const powerElement = cardBody.querySelector(".card-text");
    const device = titleElement.textContent;
    const power = powerElement.textContent;

    console.log(device);
    // Lanjutkan dengan pemrosesan seperti sebelumnya
    const duration = prompt(`Enter the duration for ${device} (hours)`);

    console.log("Input " + power);

    if (duration !== null) {
      const selectedItemsTable = document
        .getElementById("selected-items-table")
        .getElementsByTagName("tbody")[0];
      const newRow = selectedItemsTable.insertRow();
      newRow.innerHTML = `
        <td>
            
            
            <div class="input-device">
                    <label>Device</label>
                    <input type="text" value="${device}" readonly required>
                </div>
            </td>
        <td>
            <div class="input-power">
                    <label>Power (Watt)</label>
                    <input type="number" name="power" id="power" value="${power}" required>
                </div>

            </td>
        <td>

            <div class="input-duration">
                    <label>Duration (hours)</label>
                    <input type="number" name="duration" id="duration" value="${duration}" required>
                </div>
          
            
            </td>
        <td><button class="btn btn-danger" onclick="removeRow(this)">X</button></td>
    `;
    }
  }



  function calculatePowerConsumption() {
const rows = document.getElementById("selected-items-table").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
let totalPowerConsumption = 0;

for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const powerInput = row.querySelector(".input-power input");
    const durationInput = row.querySelector(".input-duration input");

    const power = parseFloat(powerInput.value);
    const duration = parseFloat(durationInput.value);

    const consumption = (power / 1000) * duration; // Menghitung konsumsi daya per perangkat dalam kWh
    totalPowerConsumption += consumption;
}

// Update hasil perhitungan pada halaman
const totalConsumptionValue = document.getElementById("totalConsumptionValue");
const savingsValue = document.getElementById("savingsValue");
const savingsText = document.getElementById("savingsResult");

totalConsumptionValue.textContent = totalPowerConsumption.toFixed(2); // Menampilkan total konsumsi daya dengan 2 desimal
const buildingPower = localStorage.getItem("dayaBangunan");

const savings = buildingPower - totalPowerConsumption;

const angkaAfterConver = (buildingPower - totalPowerConsumption).toFixed(2);;

console.log(savings);
// Tambahkan flagging jika penghematan kurang dari 0
if (savings < 0) {
    savingsText.textContent = `Sorry !
                              You must reduce your energy by:  ${angkaAfterConver} kWh`;
    savingsText.style.color = "red";
    // savingsValue.textContent = (buildingPower - totalPowerConsumption).toFixed(2); // Menampilkan penghematan dengan 2 desimal

} else {
    savingsText.textContent = `Congrats !
                              You save energy by: ${angkaAfterConver} kWh `;
    savingsText.style.color = "black";
    // savingsValue.textContent = (buildingPower - totalPowerConsumption).toFixed(2); // Menampilkan penghematan dengan 2 desimal

}



// Kirim data ke API transaksi
const transaksiData = {
    powerBangunan: buildingPower,
    selisih: angkaAfterConver,
};

fetch('https://6525650567cfb1e59ce73564.mockapi.io/transaksi', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaksiData)
})
    .then(response => response.json())
    .then(data => {
        // Proses respons API transaksi di sini jika diperlukan
        console.log('Data transaksi berhasil disimpan:', data);
    })
    .catch(error => {
        console.error('Gagal menyimpan data transaksi:', error);
    });


}




function addNewItem() {
const deviceInput = document.getElementById("device").value;
const powerInput = document.getElementById("power").value;
const durationInput = document.getElementById("duration").value;

// Validasi input jika diperlukan

// Buat objek dengan data yang akan dikirim
const newItem = {
device: deviceInput,
power: powerInput,
duration: durationInput,
};

// Kirim data ke mock API
fetch("https://652a45e54791d884f1fcb765.mockapi.io/barang", {
method: "POST",
headers: {
  "Content-Type": "application/json",
},
body: JSON.stringify(newItem),
})
.then((response) => response.json())
.then((data) => {
  // Lakukan sesuatu dengan respons API jika diperlukan (misalnya, tampilkan item yang ditambahkan)
  console.log("Item berhasil ditambahkan:", data);

  // Clear input form
  document.getElementById("device").value = "";
  document.getElementById("power").value = "";
  document.getElementById("duration").value = "";

  // Tutup modal setelah item ditambahkan
  $('#addItemModal').modal('hide');
})
.catch((error) => {
  console.error("Gagal menambahkan item:", error);
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