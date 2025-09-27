document.addEventListener("DOMContentLoaded", async function () {
    await fetchArtisans();
});

// Fetch artisans from API
async function fetchArtisans() {
    try {
        const response = await fetch("http://localhost:5000/api/artisans/");
        const artisans = await response.json();

        const artisanList = document.getElementById("artisans-list");
        artisanList.innerHTML = "";

        artisans.forEach(artisan => {
            const profileImage = artisan.profileImage || "/frontend/assets/images/download%20(1).png";
            console.log(`Artisan ID: ${artisan._id}`);
            console.log(`Artisan: ${artisan.name}, Profile Image: ${profileImage}`);
            const rating = artisan.averageRating ? artisan.averageRating.toFixed(1) : "No Rating";

            const card = document.createElement("div");
            card.classList.add("artisan-card");

            card.innerHTML = `
                <img src="${profileImage}" alt="Profile" class="artisan-img">
                <h3>${artisan.name}</h3>
                <p>${artisan.location}</p>
                <p>${artisan.skills}</p>
                <p>⭐ <span id="rating-${artisan._id}">${rating}</span> / 5</p>
                
                <input type="range" min="1" max="5" step="0.1" value="${artisan.averageRating || 1}" 
                    class="rating-slider" data-id="${artisan._id}">

                <button class="book-btn" onclick="openBookingModal('${artisan._id}')">Book Now</button>
            `;
            artisanList.appendChild(card);
        });

        // Add event listeners to rating sliders
        document.querySelectorAll(".rating-slider").forEach(slider => {
            slider.addEventListener("change", async (event) => {
                const artisanId = event.target.getAttribute("data-id");
                const rating = event.target.value;
                await submitRating(artisanId, rating);
            });
        });
    } catch (error) {
        console.error("Error fetching artisans:", error);
    }
}

// Submit rating
async function submitRating(artisanId, rating) {
    try {
        const response = await fetch(`http://localhost:5000/api/artisans/${artisanId}/rate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is set
            },
            body: JSON.stringify({ rating })
        });
        console.log("Submitting rating:", artisanId, rating);

        if (response.ok) {
            const data = await response.json();
            document.getElementById(`rating-${artisanId}`).innerText = data.artisan.rating.toFixed(1);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Open booking modal and set artisan ID
function openBookingModal(artisanId) {
    console.log("Opening booking modal for Artisan ID:", artisanId);
    
    const artisanIdInput = document.getElementById("artisanId");
    
    if (!artisanIdInput) {
        console.error("Error: Hidden input for Artisan ID is missing!");
        return; // Stop execution if input is missing
    }

    artisanIdInput.value = artisanId; // Set artisan ID for booking

    document.getElementById("booking-modal").style.display = "flex"; // Show modal
}


// Close booking modal
function closeBookingModal() {
    document.getElementById("booking-modal").style.display = "none";
}

// Booking form submission
document.getElementById("booking-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const artisanId = document.getElementById("artisanId").value.trim(); // Ensure artisanId is not empty
    console.log("Submitting booking for artisan ID:", artisanId); // Debugging
    if (!artisanId) {
        closeBookingModal(); // Hide modal if artisan ID is missing
        alert("Artisan ID is missing!");
        return;
    }

    const clientName = document.getElementById("clientName").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const location = document.getElementById("location").value;
    const title = document.getElementById("title").value.trim(); // 🔹 Include title
    const budget = document.getElementById("budget").value;
    const description = document.getElementById("description").value;

    console.log("Submitting Data:", {
        artisanId, clientName, date, time, location, budget, description
    });

    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${artisanId}`, { // Pass artisanId in URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Send authentication token
            },
            body: JSON.stringify({
                clientName,
                date,
                time,
                title,
                location,
                budget,
                description
            })
        });

        const result = await response.json();
        console.log("Server Response:", result);

        if (response.ok) {
            alert("Booking successful!");
            closeBookingModal();
        } else {
            alert("Booking failed: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

function filterArtisans(skill) {
    document.getElementById("search-bar").value = skill;
    fetchArtisans(); // Call your function to fetch filtered artisans
}

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/frontend/pages/login.html";
});




