const loginForm = document.getElementById("loginForm");
const password = document.getElementById("password");
const message = document.getElementById("message");

// Show or hide password
document.getElementById("showPassword").addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        this.textContent = "Hide";
    } else {
        password.type = "password";
        this.textContent = "Show";
    }
});

// Prototype login: accept any input and open home.html
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    message.textContent = "Login successful! Opening SUGAMYA...";

    window.location.href = "home.html";
});

// Forgot password demo
document.getElementById("forgotPassword").addEventListener("click", function (event) {
    event.preventDefault();
    message.textContent = "Password recovery is not available in this prototype.";
});

// Google login demo
document.getElementById("googleLogin").addEventListener("click", function () {
    window.location.href = "home.html";
});

// Phone login section
document.getElementById("phoneLogin").addEventListener("click", function () {
    const phoneSection = document.getElementById("phoneSection");

    phoneSection.hidden = !phoneSection.hidden;

    if (!phoneSection.hidden) {
        document.getElementById("phone").focus();
    }
});

// Prototype OTP login: accept any phone number
document.getElementById("sendOTP").addEventListener("click", function () {
    window.location.href = "home.html";
});

// Language selector demo
document.getElementById("language").addEventListener("change", function () {
    const greetings = {
        en: "Welcome Back!",
        hi: "वापसी पर स्वागत है!",
        ta: "மீண்டும் வரவேற்கிறோம்!",
        te: "తిరిగి స్వాగతం!",
        es: "¡Te damos la bienvenida!"
    };

    document.querySelector("h2").textContent = greetings[this.value];
});