// ==========================================
// PixClear AI App - Main Logic Script
// ==========================================

// तुम्हारी खुद की बनाई हुई Hugging Face API URL
const MY_AI_API_URL = "https://abhishekmeena-pixclear.hf.space/run/predict"; 

document.getElementById('enhanceBtn').addEventListener('click', async function() {
    const fileInput = document.getElementById('fileInput');
    const loadingText = document.getElementById('loadingText');
    const resultBox = document.getElementById('resultBox');
    const outputImage = document.getElementById('outputImage');

    // 1. चेक करें कि यूजर ने फोटो सेलेक्ट की है या नहीं
    if (!fileInput.files[0]) {
        alert("पहले कोई फोटो तो चुनो भाई!");
        return;
    }

    const file = fileInput.files[0];
    
    // UI अपडेट: लोडिंग चालू करें और पुराना रिजल्ट छुपाएं
    loadingText.style.display = 'block';
    resultBox.style.display = 'none';

    // 2. फोटो को Base64 फॉर्मेट में बदलें
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async function() {
        // डेटा यूआरएल से केवल प्योर बेस64 स्ट्रिंग अलग करें
        const base64Data = reader.result.split(',')[1]; 

        try {
            // 3. अपनी खुद की फ्री API (Gradio Endpoint) को रिक्वेस्ट भेजें
            const response = await fetch(MY_AI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [`data:image/jpeg;base64,${base64Data}`] // Gradio API का इनपुट फॉर्मेट
                })
            });

            // रिस्पॉन्स डेटा निकालें
            const result = await response.json();
            
            // 4. अगर रिस्पॉन्स में साफ़ की हुई फोटो मिल जाती है
            if (result.data && result.data[0]) {
                outputImage.src = result.data[0]; // स्क्रीन पर फोटो दिखाएं
                loadingText.style.display = 'none'; // लोडिंग बंद
                resultBox.style.display = 'block';  // रिजल्ट बॉक्स शो करें
            } else {
                throw new Error("API से सही डेटा नहीं मिल पाया।");
            }

        } catch (error) {
            // एरर आने पर यूजर को अलर्ट दिखाएं
            alert("प्रोसेसिंग में थोड़ा समय लग रहा है, 10-15 सेकंड रुककर दोबारा ट्राई करें भाई।");
            loadingText.style.display = 'none';
        }
    };
});
