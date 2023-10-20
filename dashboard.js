const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("login");

if (message == "yes") {
  alert(`Selamat Datang kak ${localStorage.getItem("namaCustomer")} di Aplikasi HEtrik`);
}

async function fetchDataDashboard() {
  try {
    

    // Fetch data for Barang (from your API)
    const response = await fetch("https://652a45e54791d884f1fcb765.mockapi.io/barang");
    const data = await response.json();

    const totalBarangElement = document.getElementById("totalBarang");
    totalBarangElement.textContent = data.length;



    
    const dayaBangunanCardElement = document.getElementById("dayaBangunanCard");

    // Mengambil nilai dari localStorage
const dayaBangunanValue = localStorage.getItem("dayaBangunan");

// Menetapkan nilai default ke 0 jika dayaBangunanValue adalah null atau undefined
const defaultDayaBangunanValue = dayaBangunanValue ? parseInt(dayaBangunanValue) : 0;

// Mengatur nilai elemen card sesuai dengan defaultDayaBangunanValue
dayaBangunanCardElement.textContent = defaultDayaBangunanValue;



const totalListrikElement = document.getElementById("totalListrik");

// URL mock API
const apiUrl = "https://6525650567cfb1e59ce73564.mockapi.io/transaksi";

// Mengambil data dari API
fetch(apiUrl)
.then(response => response.json())
.then(data => {
// Menginisialisasi total ke 0
let totalSelisih = 0;

// Menjumlahkan nilai "selisih" dari setiap entri data
data.forEach(entry => {
totalSelisih += parseFloat(entry.selisih);
});

totalListrikElement.textContent = `${totalSelisih} kWh`;

console.log("Total Selisih: " + totalSelisih);
})
.catch(error => {
console.error("Gagal mengambil data dari API: " + error);
});


    const barangData = data.map((barang) => barang.power);

    const barangNama = data.map((barang) => barang.device);
    // Update Pelanggan Chart (you can replace the chart ID)
    const pelangganChart = new Chart(document.getElementById("barangChart"), {
      type: "bar", // Change the chart type to bar
      data: {
        labels: barangNama,
        datasets: [
          {
            label: "Power",
            data: barangData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
    });

   
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch and update data
fetchDataDashboard();


//   // Function to create a carousel item containing multiple cards
function createCarouselItem(cards, active) {
const carouselItem = document.createElement("div");
carouselItem.classList.add("carousel-item");
if (active) {
carouselItem.classList.add("active");
}

const rowDiv = document.createElement("div");
rowDiv.classList.add("row");

cards.forEach((cardData) => {
const { device, power ,avatar,id} = cardData;
// console.log(cardData)
const cardDiv = document.createElement("div");
cardDiv.classList.add("col-md-4"); // 3 cards per row

cardDiv.innerHTML = `
  <div class="card">
    <img src="${avatar}" class="card-img-center" alt="${device}"> <!-- Image added here -->
    <div class="card-body">
      <h5 class="card-title">${device}
        </h5>
      <p class="card-text"> Power ${power} watt 
        <button class="btn btn-primary btn-sm bt-a" data-id="${id}" >Edit</button> <!-- Added Delete button -->
        <button class="btn btn-danger btn-sm bt-b" data-id="${id}" >Delete</button> <!-- Added Delete button -->
        </p>
    </div>
  </div>
`;

rowDiv.appendChild(cardDiv);
});



carouselItem.appendChild(rowDiv);
return carouselItem;
}

document.addEventListener("DOMContentLoaded", function () {
const carouselContent = document.getElementById("carousel-content");
const apiUrl = "https://652a45e54791d884f1fcb765.mockapi.io/barang";
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const deleteModal = document.getElementById("deleteModal");
const deleteForm = document.getElementById("deleteForm");
let itemToDelete; // Untuk menyimpan data barang yang akan dihapus

// Function to fetch data from the API
async function fetchData() {
try {
const response = await fetch(apiUrl);
const data = await response.json();
return data;
} catch (error) {
console.error("Error fetching data:", error);
return [];
}
}

// Function to create a carousel item containing multiple cards
// ...

// Function to populate the carousel with data
async function populateCarousel() {
const data = await fetchData();
carouselContent.innerHTML = "";

// Split the data into groups of 3 for each carousel item
for (let i = 0; i < data.length; i += 3) {
const cardGroup = data.slice(i, i + 3);
const active = i === 0;
const carouselItem = createCarouselItem(cardGroup, active);
carouselContent.appendChild(carouselItem);
}
}

carouselContent.addEventListener("click", function (event) {
// console.log(event.target.classList.contains("btn-danger"))
if (event.target.classList.contains("bt-a")) {
const id = event.target.getAttribute("data-id");
const itemToEdit = id /* Fetch the item to edit based on the ID */;
openEditModal(itemToEdit);
}
});

// Event listener for opening the delete modal
carouselContent.addEventListener("click", function (event) {

if (event.target.classList.contains("bt-b")) {
// console.log(event.target)
const id = event.target.getAttribute("data-id");
const itemToDelete = id/* Fetch the item to delete based on the ID */;
openDeleteModal(itemToDelete);
}
});

// Function to open the edit modal

async function openEditModal(barang) {
const response = await fetch(`https://652a45e54791d884f1fcb765.mockapi.io/barang/${barang}`);
const data = await response.json();

if (response.ok) {
// Set values in the edit form
editModal.querySelector("#deviceEdit").value = data.device;
editModal.querySelector("#powerEdit").value = data.power;
editModal.style.display = "block";

// Handle the form submission to update the data
editForm.onsubmit = async (event) => {
event.preventDefault();
const updatedData = {
  device: editModal.querySelector("#deviceEdit").value,
  power: editModal.querySelector("#powerEdit").value,
};

try {
  const updateResponse = await fetch(
    `https://652a45e54791d884f1fcb765.mockapi.io/barang/${barang}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (updateResponse.ok) {
    // Update the UI here if needed
    alert("Data updated successfully!");
    openEditModal(); // Close the modal
    location.reload();
    // populateCarousel(); // Refresh the carousel
  } else {
    alert("Failed to update data.");
  }
} catch (error) {
  console.error("Error updating data:", error);
  alert("An error occurred while updating data.");
}
};
} else {
alert("Failed to fetch data for editing.");
}
}
// Function to open the delete modal
function openDeleteModal(barang) {
itemToDelete = barang; // Save the item to delete
deleteModal.style.display = "block";

// Handle the form submission to delete the data
deleteForm.onsubmit = async (event) => {
event.preventDefault();
try {
  const response = await fetch(`${apiUrl}/${itemToDelete}`, {
    method: "DELETE",
  });
  if (response.ok) {
    // Update the UI here if needed
    alert("Data deleted successfully!");
    // openDeleteModal(); // Close the modal
    deleteModal.style.display = "none";

    populateCarousel(); // Refresh the carousel
  } else {
    alert("Failed to delete data.");
  }
} catch (error) {
  console.error("Error deleting data:", error);
  alert("An error occurred while deleting data.");
}
};
}

// Call the function to populate the carousel when the document is loaded
populateCarousel();
});



document.addEventListener("DOMContentLoaded", function () {
// ...

// Function to fetch data for Total Listrik Hemat
async function fetchTotalListrikData() {
try {
const response = await fetch("https://6525650567cfb1e59ce73564.mockapi.io/transaksi");
const data = await response.json();

if (response.ok) {
  // Remove the 'waktu' property and use labels like "Transaksi 1," "Transaksi 2," and so on
  const labels = data.map((_, index) => `Kalkulasi ${index + 1}`);
  const totalSavings = data.map(entry => entry.selisih);

  // Create the chart without the 'waktu' property
  const electricitySavingsChart = new Chart(
    document.getElementById("electricitySavingsChart"),
    {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Listrik Hemat",
            data: totalSavings,
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Kalkulasi", // You can customize the label for the x-axis
            },
          },
          y: {
            title: {
              display: true,
              text: "Total Listrik Hemat (kWh)",
            },
          },
        },
      },
    }
  );
} else {
  console.error("Failed to fetch Total Listrik Hemat data.");
}
} catch (error) {
console.error("Error fetching Total Listrik Hemat data:", error);
}
}

// Call the function to fetch and display the Total Listrik Hemat data
fetchTotalListrikData();
});

// Function to close the edit modal
function closeEditModal() {
    editModal.style.display = "none";
  }
  
  // Function to close the delete modal
  function closeDeleteModal() {
    deleteModal.style.display = "none";
  }
  
  // Add event listeners to close modals when the close button or the 'x' button is clicked
  editModal.querySelector(".close").addEventListener("click", closeEditModal);
  deleteModal.querySelector(".close").addEventListener("click", closeDeleteModal);
  

  editModal.querySelector(".close-1").addEventListener("click", closeEditModal);
  deleteModal.querySelector(".close-1").addEventListener("click", closeDeleteModal);
  
  // Also, you can close the modals when the overlay (outside the modal) is clicked
  editModal.addEventListener("click", function (event) {
    if (event.target === editModal) {
      closeEditModal();
    }
  });
  
  deleteModal.addEventListener("click", function (event) {
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });
  

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