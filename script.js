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
        filterBtn.innerText = "✨ Clean Pips & Smooth Skin";
        downloadBtn.style.display = 'none';
        afterBox.style.display = 'none';
        statusText.innerText = "फोटो लोड हो गई। अब Clean पर क्लिक करें।";
    };
});

// 2. पिंपल हटाना (बिना फोन हैंग किए)
filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "✨ Processing...";
    filterBtn.disabled = true; 
    
    // ब्राउज़र को हैंग होने से बचाने के लिए फोटो को एक सुरक्षित साइज (Max 1080px) पर सेट करेंगे
    const MAX_WIDTH = 1080;
    let width = beforeImg.naturalWidth;
    let height = beforeImg.naturalHeight;

    if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
    }

    canvas.width = width;
    canvas.height = height;

    // ओरिजिनल फोटो को कैनवास पर ड्रा करो
    ctx.drawImage(beforeImg, 0, 0, width, height);
    
    // UI को अपडेट होने का टाइम दो (ताकि बटन Processing दिखाने लगे)
    await new Promise(r => setTimeout(r, 100));

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // प्रोसेसिंग स्पीड बढ़ाने के लिए रेडियस को 3 कर दिया है (ताकि फोन जल्दी काम करे)
    const r = 3; 

    // --- पिक्सेल लूप (अब यह ब्राउज़र को हैंग नहीं करेगा) ---
    for (let y = r; y < height - r; y++) {
        for (let x = r; x < width - r; x++) {
            let i = (y * width + x) * 4;
            let sumR = 0, sumG = 0, sumB = 0;
            
            const origR = data[i];
            const origG = data[i + 1];
            const origB = data[i + 2];
            
            for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                    const ni = ((y + dy) * width + (x + dx)) * 4;
                    const neighborR = data[ni];
                    const neighborG = data[ni + 1];
                    const neighborB = data[ni + 2];
                    
                    const diff = Math.abs(origR - neighborR) + Math.abs(origG - neighborG) + Math.abs(origB - neighborB);
                    
                    if (diff < 80) {
                        sumR += neighborR;
                        sumG += neighborG;
                        sumB += neighborB;
                    } else {
                        sumR += (neighborR + origR) / 2;
                        sumG += (neighborG + origG) / 2;
                        sumB += (neighborB + origB) / 2;
                    }
                }
            }
            
            const neighborsCount = (2 * r + 1) * (2 * r + 1);
            data[i] = sumR / neighborsCount;
            data[i + 1] = sumG / neighborsCount;
            data[i + 2] = sumB / neighborsCount;
        }

        // 🌟 सबसे बड़ा जादू: हर 40 लाइन के बाद ब्राउज़र को "साँस" लेने का मौका दो 🌟
        // इससे 'Page Unresponsive' का एरर कभी नहीं आएगा!
        if (y % 40 === 0) {
            const progress = Math.round((y / height) * 100);
            statusText.innerText = `चेहरा साफ़ हो रहा है: ${progress}%... (कृपया रुकें)`;
            // यह लाइन ब्राउज़र को 0 सेकंड के लिए फ्री करती है ताकि वह हैंग न हो
            await new Promise(res => setTimeout(res, 0)); 
        }
    }
    
    // साफ हुई फोटो कैनवास पर डालो
    ctx.putImageData(imageData, 0, 0);

    // फटने से बचाने के लिए हल्का कंट्रास्ट और शार्पनेस
    ctx.filter = 'contrast(1.05) saturate(1.1)';
    ctx.drawImage(canvas, 0, 0, width, height);
    ctx.filter = 'none';

    // UI अपडेट करो
    afterBox.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    statusText.innerText = "✅ प्रोसेसिंग 100% पूरी हुई! चेहरा साफ़ हो गया है।";
});

// 3. डाउनलोड और पॉप-अप (Toast)
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'Clean_Face_Photo.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95); 
    link.click();

    popup.classList.add("show");
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
});
