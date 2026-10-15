
const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
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

// Login form validation
loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (email.value.trim() === "" || password.value === "") {
        message.textContent = "Please enter your email and password.";
        return;
    }

    message.textContent =
        "Form checked! Connect a secure backend to log in.";

    // This demo does not authenticate users.
});

// Forgot password
document.getElementById("forgotPassword").addEventListener("click", function (event) {

    event.preventDefault();

    message.textContent =
        "Connect a password recovery service to reset your password.";
});

// Google login
document.getElementById("googleLogin").addEventListener("click", function () {

    message.textContent =
        "Google login needs to be connected to Google Identity Services.";
});

// Show or hide phone login
document.getElementById("phoneLogin").addEventListener("click", function () {

    const phoneSection = document.getElementById("phoneSection");

    phoneSection.hidden = !phoneSection.hidden;

    if (!phoneSection.hidden) {
        document.getElementById("phone").focus();
    }
});

// Phone number validation
document.getElementById("sendOTP").addEventListener("click", function () {

    const phone = document.getElementById("phone");
    const phoneMessage = document.getElementById("phoneMessage");

    const digits = phone.value.replace(/\D/g, "");

    if (digits.length < 8 || digits.length > 15) {
        phoneMessage.textContent = "Please enter a valid phone number.";
        return;
    }

    phoneMessage.textContent =
        "Phone number accepted. Connect an OTP service to send a code.";
});

// Sign Up
document.getElementById("signup").addEventListener("click", function (event) {

    event.preventDefault();

    message.textContent =
        "Connect your registration page to create an account.";
});

// Language selector demo
document.getElementById("language").addEventListener("change", function () {

    const language = this.value;

    const greetings = {
        en: "Welcome Back!",
        hi: "वापसी पर स्वागत है!",
        ta: "மீண்டும் வரவேற்கிறோம்!",
        te: "తిరిగి స్వాగతం!",
        es: "¡Te damos la bienvenida!"
    };

    document.querySelector("h2").textContent = greetings[language];

});
