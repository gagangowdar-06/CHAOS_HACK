
const form = document.getElementById("registerForm");

const mobile = document.getElementById("mobile");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const verificationCode = document.getElementById("verificationCode");
const agree = document.getElementById("agree");

const formMessage = document.getElementById("formMessage");

function showError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;

    if (input.type === "checkbox") {
        input.setAttribute("aria-invalid", message ? "true" : "false");
    } else {
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }
}

function clearMessage() {
    formMessage.textContent = "";
    formMessage.className = "";
}

// Show or hide passwords
document.querySelectorAll(".show-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        const input = document.getElementById(this.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            this.textContent = "Hide";
        } else {
            input.type = "password";
            this.textContent = "Show";
        }
    });
});

// Demo verification-code button
document.getElementById("sendCode").addEventListener("click", function() {
    const mobileValue = mobile.value.trim();
    const emailValue = email.value.trim();

    if (!mobileValue || !emailValue) {
        document.getElementById("verificationMessage").textContent =
            "Enter your mobile number and email first.";
        return;
    }

    document.getElementById("verificationMessage").textContent =
        "Connect an SMS or email verification service to send your code.";
});

// Registration form validation
form.addEventListener("submit", function(event) {
    event.preventDefault();

    clearMessage();

    let valid = true;

    const mobileDigits = mobile.value.replace(/\D/g, "");
    const emailValue = email.value.trim();
    const code = verificationCode.value.trim();

    // Mobile number
    if (mobileDigits.length < 8 || mobileDigits.length > 15) {
        showError(mobile, "mobileError",
            "Enter a valid mobile number with country code.");
        valid = false;
    } else {
        showError(mobile, "mobileError", "");
    }

    // Email
    if (!emailValue ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        showError(email, "emailError",
            "Enter a valid email address.");
        valid = false;
    } else {
        showError(email, "emailError", "");
    }

    // Password
    if (password.value.length < 8) {
        showError(password, "passwordError",
            "Password must contain at least 8 characters.");
        valid = false;
    } else {
        showError(password, "passwordError", "");
    }

    // Confirm password
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, "confirmError",
            "Passwords do not match.");
        valid = false;
    } else {
        showError(confirmPassword, "confirmError", "");
    }

    // Verification code
    if (!code) {
        showError(verificationCode, "verificationError",
            "Enter the verification code.");
        valid = false;
    } else {
        showError(verificationCode, "verificationError", "");
    }

    // Terms and conditions
    if (!agree.checked) {
        showError(agree, "termsError",
            "Please agree to the Terms and Privacy Policy.");
        valid = false;
    } else {
        showError(agree, "termsError", "");
    }

    if (!valid) {
        const firstInvalid =
            document.querySelector('[aria-invalid="true"]');

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    // A filled code is NOT proof of verification.
    // A backend must verify the actual code before creating an account.
    formMessage.textContent =
        "Your details look valid. Connect the verification service and backend to finish registration.";

    formMessage.className = "error-message";
});

// Clear errors as the user corrects their inputs
[
    [mobile, "mobileError"],
    [email, "emailError"],
    [password, "passwordError"],
    [confirmPassword, "confirmError"],
    [verificationCode, "verificationError"],
    [agree, "termsError"]
].forEach(function(item) {
    item[0].addEventListener("input", function() {
        showError(item[0], item[1], "");
        clearMessage();
    });

    item[0].addEventListener("change", function() {
        showError(item[0], item[1], "");
        clearMessage();
    });
});
