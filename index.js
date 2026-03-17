let captchaToken = null;

function onSuccess(token) {
    captchaToken = token;

    // Send token to backend for verification
    fetch("https://cloudflarecap-m8be.vercel.app/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            console.log("✅ CAPTCHA verified!");
        } else {
            console.log("❌ CAPTCHA verification failed!");
        }
    })
    .catch(err => console.error("Server error:", err));
}