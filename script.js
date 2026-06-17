// तुम्हारी खुद की बनाई हुई Hugging Face API URL
const MY_AI_API_URL = "https://abhishekmeena-pixclear.hf.space/run/predict"; 

document.getElementById('enhanceBtn').addEventListener('click', async function() {
    const fileInput = document.getElementById('fileInput');
    const loadingText = document.getElementById('loadingText');
    const resultBox = document.getElementById('resultBox');
    const outputImage = document.getElementById('outputImage');

    if (!fileInput.files[0]) {
        alert("पहले कोई फोटो तो चुनो भाई!");
        return;
    }

    const file = fileInput.files[0];
    loadingText.style.display = 'block';
    resultBox.style.display = 'none';

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async function() {
        const base64Image = reader.result; // पूरा डेटा यूआरएल लेंगे (Gradio load के लिए)

        try {
            const response = await fetch(MY_AI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // नए क्लैन्ड मॉडल के लिए इनपुट पैरामीटर्स (इमेज, फेस रिस्टोर वेट, बैकग्राउंड एनहांस)
                    data: [
                        base64Image, // तुम्हारी फोटो
                        0.7,         // fidelity (नेचुरल लुक के लिए)
                        true,        // background_enhance (कपड़े और बैकग्राउंड के लिए)
                        true         // face_upsample (चेहरा साफ करने के लिए)
                    ]
                })
            });

            const result = await response.json();
            
            // यहाँ चेक करेंगे कि रिस्पॉन्स में इमेज कहाँ आई है
            if (result.data && result.data[0]) {
                outputImage.src = result.data[0]; 
                loadingText.style.display = 'none';
                resultBox.style.display = 'block';
            } else {
                throw new Error("मॉडल अभी लोड हो रहा है, थोड़ा रुककर फिर ट्राई करें।");
            }

        } catch (error) {
            alert("सर्वर जाग रहा है भाई! 10-15 सेकंड रुककर दोबारा 'Enhance' बटन दबाओ।");
            loadingText.style.display = 'none';
        }
    };
});
