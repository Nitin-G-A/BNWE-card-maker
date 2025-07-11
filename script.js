// Initialization
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("photoUpload").style.display = "none";
    document.getElementById("photoAlbum").style.display = "none";
});

// Auth (Login / Signup)
function toggleSignup() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "block";
}

function toggleLogin() {
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}

function registerUser() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (name && email && password) {
        alert(`Welcome, ${name}! Your account has been created.`);
        toggleLogin();
    } else {
        alert("Please fill all fields.");
    }
}

function authenticateUser() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("photoUpload").style.display = "block";
    document.getElementById("photoAlbum").style.display = "block";
}

// Card Generator
function updateFormFields() {
    const eventType = document.getElementById("eventType").value;
    document.getElementById("weddingNames").style.display = eventType === "wedding" ? "block" : "none";
    document.getElementById("singleNameField").style.display = eventType === "wedding" ? "none" : "block";
}

function generateCard() {
    const eventType = document.getElementById("eventType").value;
    const customMessage = document.getElementById("message").value.trim();
    let cardText = "";

    if (eventType === "birthday") {
        const name = document.getElementById("name").value;
        cardText = `🎂 Happy Birthday, ${name} 🎈\nWishing you a day full of love, joy, and laughter!`;
    } else if (eventType === "wedding") {
        const husband = document.getElementById("husband").value;
        const wife = document.getElementById("wife").value;
        cardText = `💍 Congratulations ${husband} & ${wife}\nWishing you a lifetime of love and happiness together. 💖`;
    } else if (eventType === "naming") {
        const name = document.getElementById("name").value;
        cardText = `👶 Welcome to the world, ${name}\nWishing you a beautiful naming ceremony filled with blessings. ✨`;
    } else if (eventType === "event") {
        const name = document.getElementById("name").value;
        cardText = `🎉 You're invited to the event hosted by ${name}\nGet ready for fun, food, and festivities! 🎊`;
    }

    if (customMessage) {
        cardText += `\n\n${customMessage}`;
    }

    document.getElementById("cardText").innerText = cardText;
}

// Card Download
document.getElementById("downloadBtn").addEventListener("click", downloadCardAsImage);

function downloadCardAsImage() {
    if (typeof html2canvas === 'undefined') {
        alert("html2canvas library not loaded.");
        return;
    }
    const card = document.getElementById("generatedCard");
    html2canvas(card).then(canvas => {
        const link = document.createElement("a");
        link.download = "BWNE_Card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// WhatsApp Sharing
document.getElementById("whatsappShareBtn").addEventListener("click", () => {
    const cardText = document.getElementById("cardText").innerText.trim();
    if (!cardText || cardText.includes("Your card will appear")) {
        alert("Please generate a card before sharing.");
        return;
    }

    const encodedText = encodeURIComponent(cardText);
    const whatsappURL = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappURL, '_blank');
});

// Image Upload (Preview Only)
function uploadPhotos() {
    const input = document.getElementById("photoInput");
    const gallery = document.getElementById("photoGallery");

    for (const file of input.files) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.className = "event-photo";
        img.style.width = "100px";
        img.style.margin = "5px";
        gallery.appendChild(img);
    }
}

// Event Albums DB (Temporary)
const eventPhotoDB = {
    "wedding123": {
        password: "1234",
        photos: [
            "https://media.tenor.com/EII8I501ulIAAAAi/happy-wedding.gif",
            "https://via.placeholder.com/150x100?text=Bride+Groom",
            "https://via.placeholder.com/150x100?text=Wedding+Cake"
        ]
    },
    "birthday456": {
        password: "5678",
        photos: [
            "https://via.placeholder.com/150x100?text=Birthday+Cake",
            "https://via.placeholder.com/150x100?text=Happy+Bday",
            "https://via.placeholder.com/150x100?text=Party+Pic"
        ]
    }
};

// View Event Album by Code
function loadAlbum() {
    const code = document.getElementById("eventCodeInput").value.trim();
    const password = document.getElementById("eventPasswordInput").value.trim();
    const gallery = document.getElementById("codeAlbumGallery");
    gallery.innerHTML = "";

    if (!eventPhotoDB[code] || eventPhotoDB[code].password !== password) {
        gallery.innerHTML = "<p style='color: red;'>Incorrect event code or password.</p>";
        return;
    }

    eventPhotoDB[code].photos.forEach((imgUrl, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.textAlign = "center";

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `Event Photo ${index + 1}`;
        img.className = "event-photo";

        const downloadBtn = document.createElement("a");
        downloadBtn.href = imgUrl;
        downloadBtn.download = `event_photo_${index + 1}`;
        downloadBtn.innerText = "Download";
        downloadBtn.className = "download-btn";

        wrapper.appendChild(img);
        wrapper.appendChild(document.createElement("br"));
        wrapper.appendChild(downloadBtn);
        gallery.appendChild(wrapper);
    });
}

// Photographer Login
const photographerAccounts = {
    "photog123": "securepass"
};

function photographerLogin() {
    const user = document.getElementById("photographerUsername").value;
    const pass = document.getElementById("photographerPassword").value;

    if (photographerAccounts[user] === pass) {
        document.getElementById("photographerLoginPage").style.display = "none";
        document.getElementById("photoUploadPage").style.display = "block";
    } else {
        alert("Invalid photographer credentials!");
    }
}

function uploadEventPhotos() {
    const eventCode = document.getElementById("uploadEventCode").value.trim();
    const password = document.getElementById("uploadEventPassword").value.trim();
    const files = document.getElementById("uploadPhotos").files;

    if (!eventCode || !password || files.length === 0) {
        alert("Please fill all fields and select at least one image.");
        return;
    }

    if (!eventPhotoDB[eventCode]) {
        eventPhotoDB[eventCode] = {
            password: password,
            photos: []
        };
    }

    for (let i = 0; i < files.length; i++) {
        const imgURL = URL.createObjectURL(files[i]);
        if (!eventPhotoDB[eventCode].photos.includes(imgURL)) {
            eventPhotoDB[eventCode].photos.push(imgURL);
        }
    }

    document.getElementById("uploadStatus").innerText = "Photos uploaded successfully!";
    document.getElementById("uploadPhotos").value = "";
}

// Contact Form
function submitContactForm() {
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value;
    const status = document.getElementById("contactStatus");

    if (name && email && subject && message) {
        status.innerText = "Thank you! We'll get back to you shortly.";
        status.style.color = "#00ffcc";
        document.getElementById("contactForm").reset();
    } else {
        status.innerText = "Please fill in all fields.";
        status.style.color = "red";
    }
}
