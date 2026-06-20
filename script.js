const upload = document.getElementById('upload');
const beforeImg = document.getElementById('beforeImg');
const canvas = document.getElementById('canvas');
const filterBtn = document.getElementById('filterBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusText = document.getElementById('status');
const ctx = canvas.getContext('2d');

// 1. फोन का GPU सेट करो (WebGL)
async function setupGPU() {
    await tf.setBackend('webgl');
    console.log("Current Backend:", tf.getBackend()); // console में 'webgl' आना चाहिए
    statusText.innerText = "GPU Ready! फोटो अपलोड करें।";
}
setupGPU();

// 2. AI Upscaler को इनिशियलाइज़ करो
const upscaler = new Upscaler();

// 3. फोटो अपलोड हैंडलिंग
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    beforeImg.src = url;
    beforeImg.style.display = 'block';
    
    beforeImg.onload = () => {
        filterBtn.style.display = 'inline-block';
        downloadBtn.style.display = 'none';
        canvas.style.display = 'none';
        statusText.innerText = "फोटो लोड हो गई। अब फिल्टर लगाएं।";
    };
});

// 4. फिल्टर बटन (GPU प्रोसेसिंग)
filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "Processing on GPU... (कृपया प्रतीक्षा करें)";
    filterBtn.disabled = true;
    statusText.innerText = "आपके फोन का GPU काम कर रहा है। इसमें कुछ सेकंड लग सकते हैं...";

    try {
        // AI मॉडल फोन के GPU पर चलेगा
        const upscaledImgSrc = await upscaler.upscale(beforeImg);
        
        // साफ़ हुई फोटो को कैनवास पर ड्रा करो
        const enhancedImg = new Image();
        enhancedImg.src = upscaledImgSrc;
        
        enhancedImg.onload = () => {
            canvas.width = enhancedImg.width;
            canvas.height = enhancedImg.height;
            ctx.drawImage(enhancedImg, 0, 0);
            
            canvas.style.display = 'block';
            filterBtn.style.display = 'none';
            downloadBtn.style.display = 'inline-block';
            statusText.innerText = "प्रोसेसिंग पूरी हुई! अब आप डाउनलोड कर सकते हैं।";
        };
    } catch (error) {
        console.error(error);
        statusText.innerText = "कुछ गड़बड़ हो गई! फोन का GPU सपोर्ट नहीं कर रहा है।";
        filterBtn.innerText = "Apply AI Filter (Use GPU)";
        filterBtn.disabled = false;
    }
});

// 5. डाउनलोड लॉजिक
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'gpu-enhanced-photo.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});
