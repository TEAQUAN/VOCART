 async function fetchArtisanDetails() {
    const artisanNameDisplay = document.getElementById("artisan-name");
    const artisanNameDisplayed = document.getElementById("artisan-name-display");
    const artisanLocationDisplay = document.getElementById("artisan-location");
    const artisanSkillsDisplay = document.getElementById("artisan-skills");
    const profilePic = document.getElementById("profile-pic");
    const logoutBtn = document.getElementById("logout-btn");

    if (!artisanNameDisplay || !artisanLocationDisplay || !artisanSkillsDisplay || !profilePic || !logoutBtn) {
        console.error("❌ Missing elements in HTML. Check your IDs.");
        return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to log in first!");
        window.location.href = "/frontend/pages/login.html";
        return;
    }

    try {
        // Fetch user data
        const response = await fetch("http://localhost:5000/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            },
            cache: "no-store"
        });

        console.log("Response Status:", response.status);

        if (response.status === 401) {
            throw new Error("Session expired. Please log in again.");
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user data.");
        }

        const userData = await response.json();
        console.log("User Data:", userData);

        // Display user data
        artisanNameDisplay.textContent = userData.name || "Artisan"; // Default if missing
        artisanLocationDisplay.textContent = userData.location || "No location provided";
        artisanNameDisplayed.textContent = userData.name;
        artisanSkillsDisplay.textContent = userData.skills && userData.skills.length > 0
            ? userData.skills.join(", ") // Convert array to a comma-separated string
            : "No skills listed"; // Fallback text

        if (userData.profileImage) {
            profilePic.src = userData.profileImage;
        }

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
        localStorage.removeItem("token");
        window.location.href = "/frontend/pages/login.html";
    }

    // Logout functionality
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/frontend/pages/login.html";
    });
};

async function fetchJobRequests() {
    const jobList = document.getElementById("job-list");
    jobList.innerHTML = "<p>Loading job requests...</p>";

    try {
        const response = await fetch("http://localhost:5000/api/jobs", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch job requests.");
        }

        const jobs = await response.json();

        if (jobs.message) {
            jobList.innerHTML = `<p>${jobs.message}</p>`;
            return;
        }

        jobList.innerHTML = "";
        jobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");

            jobCard.innerHTML = `
                <h3>Title:${job.title}</h3>
                <p>DESCRIPTION:${job.description}</p>
                <p>CLIENTS NAME:${job.clientName}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${job.date}</span>
                    <span><i class="fas fa-clock"></i> ${job.time}</span>
                </div>
                <div class="job-actions">
                    <button class="accept-btn">Accept</button>
                    <button class="decline-btn">Decline</button>
                </div>
            `;

            jobList.appendChild(jobCard);
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobList.innerHTML = "<p>Error loading job requests.</p>";
    }
}



// Call the function when the page loads
window.onload = async function () {
    await fetchArtisanDetails(); // Fetch artisan details
    await fetchJobRequests();
};
