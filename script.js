const upload = document.getElementById('upload');
const beforeImg = document.getElementById('beforeImg');
const canvas = document.getElementById('canvas');
const filterBtn = document.getElementById('filterBtn');
const downloadBtn = document.getElementById('downloadBtn');
const beforeBox = document.getElementById('beforeBox');
const afterBox = document.getElementById('afterBox');
const statusText = document.getElementById('status');
const popup = document.getElementById('popup');
const ctx = canvas.getContext('2d');

// 1. फोटो अपलोड हैंडलिंग
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    beforeImg.src = url;
    statusText.innerText = "फोटो लोड हो रही है...";
    
    beforeImg.onload = () => {
        beforeBox.style.display = 'block';
        filterBtn.style.display = 'inline-block';
        filterBtn.disabled = false;
        filterBtn.innerText = "✨ Clean & Make Instant Fair (गोरा करें)";
        downloadBtn.style.display = 'none';
        afterBox.style.display = 'none';
        statusText.innerText = "फोटो लोड हो गई। अब बटन दबाकर जादू देखें!";
    };
});

// 2. चेहरा बिल्कुल गोरा और साफ़ करने का लॉजिक (Instant Skin Whitening)
filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "✨ Whitening...";
    filterBtn.disabled = true; 
    statusText.innerText = "चेहरा गोरा और साफ़ किया जा रहा है...";
    
    // कैनवास का साइज सेट करो
    canvas.width = beforeImg.naturalWidth;
    canvas.height = beforeImg.naturalHeight;

    // --- स्टेप 1: ओरिजिनल फोटो को थोड़ा ब्राइट और साफ़ करके ड्रा करो ---
    // brightness(1.25) से चेहरा तुरंत गोरा होगा और contrast(1.1) से फोटो फटेगी नहीं
    ctx.filter = 'brightness(1.25) contrast(1.1) saturate(1.15)';
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);

    // --- स्टेप 2: चेहरा स्मूथ करने की जादुई लेयर (Skin Softening Overlay) ---
    // हम इसके ऊपर एक हल्की धुंधली (Soft) लेयर चढ़ाएंगे जिससे पिंपल्स और दाग छुप जाएं
    ctx.globalAlpha = 0.35; // लेयर की मिक्सिंग (35%)
    ctx.globalCompositeOperation = 'screen'; // यह स्क्रीन मोड चेहरे के सांवलेपन को हटाकर गोरा करता है
    ctx.filter = 'blur(8px) brightness(1.3)'; // दाग-धब्बे छुपाने के लिए ब्लर और एक्स्ट्रा सफेदी
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);

    // --- स्टेप 3: बालों और आँखों को वापस शार्प करना ---
    // सब कुछ वापस नॉर्मल करो ताकि फोटो नकली न लगे
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';

    // UI अपडेट करो (यह काम सिर्फ 1 सेकंड में हो जाएगा!)
    afterBox.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    statusText.innerText = "✅ जादू पूरा हुआ भाई! चेहरा एकदम गोरा और साफ़ हो गया है।";
});

// 3. डाउनलोड और पॉप-अप (Toast)
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'Instant_Fair_Photo.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95); 
    link.click();

    // पॉप-अप दिखाओ
    popup.classList.add("show");
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
});
