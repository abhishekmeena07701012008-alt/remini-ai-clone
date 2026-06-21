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

// 2. पिंपल हटाना और स्किन स्मूथ करना (Smart Smoothing Algorithm)
filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "✨ Cleaning Pips...";
    filterBtn.disabled = true; // दोबारा क्लिक न हो
    statusText.innerText = "AI आपके पिंपल्स हटा रहा है। इसमें १०-२० सेकंड लग सकते हैं...";
    
    // कैनवास सेट करो
    canvas.width = beforeImg.naturalWidth;
    canvas.height = beforeImg.naturalHeight;

    // फोटो के पिक्सेल डेटा को कैनवास पर लाओ
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);
    
    // थोड़ी देर रुको ताकि ब्राउज़र यूआई अपडेट कर सके
    await new Promise(r => setTimeout(r, 100));

    // --- स्मार्ट स्किन स्मूथिंग (Smart Smoothing) लॉजिक ---
    // चूंकि ब्राउज़र है, हमें मैन्युअल रूप से बाईलेटरल फिल्टर (Surface Blur) जैसा करना होगा.
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // स्मूथिंग की ताकत (radius). जितना ज्यादा, उतना ज्यादा साफ. लेकिन ध्यान रहे फोन क्रैश न हो.
    const r = 5; 

    // पिक्सेल-बाय-पिक्सेल प्रोसेसिंग: पिंपल्स (रफनेस) को धुंधला करना.
    for (let y = r; y < height - r; y++) {
        for (let x = r; x < width - r; x++) {
            let i = (y * width + x) * 4;
            
            let sumR = 0, sumG = 0, sumB = 0;
            
            // ओरिजिनल पिक्सेल का रंग
            const origR = data[i];
            const origG = data[i + 1];
            const origB = data[i + 2];
            
            // पिंपल या रफनेस वो होती है जिसका रंग आस-पास के पिक्सल्स से बहुत अलग हो.
            // हम 'Smart Average' लेंगे जो सिर्फ स्किन जैसे पिक्सल्स को मिलाता है.
            
            for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                    const ni = ((y + dy) * width + (x + dx)) * 4;
                    const neighborR = data[ni];
                    const neighborG = data[ni + 1];
                    const neighborB = data[ni + 2];
                    
                    // अगर रंग का अंतर बहुत ज्यादा है (पिंपल है), तो हम उसे स्मूथ नहीं करेंगे.
                    // अगर अंतर कम है (नॉर्मल स्किन है), तो हम उसे एवरेज करेंगे (स्मूथ करेंगे).
                    const diff = Math.abs(origR - neighborR) + Math.abs(origG - neighborG) + Math.abs(origB - neighborB);
                    
                    // यह अंतर का थ्रेशोल्ड है. 80 मोबाइल के लिए सेफ है.
                    if (diff < 80) {
                        sumR += neighborR;
                        sumG += neighborG;
                        sumB += neighborB;
                    } else {
                        // अगर पिंपल है, तो हम बस उस पिक्सेल को आस-पास की स्किन से 'हल्का' सा स्मूथ कर देते हैं.
                        sumR += (neighborR + origR) / 2;
                        sumG += (neighborG + origG) / 2;
                        sumB += (neighborB + origB) / 2;
                    }
                }
            }
            
            // एवरेज (स्मूथ) रंग को वापस डालो
            const neighborsCount = (2 * r + 1) * (2 * r + 1);
            data[i] = sumR / neighborsCount;
            data[i + 1] = sumG / neighborsCount;
            data[i + 2] = sumB / neighborsCount;
        }
    }
    
    // बदला हुआ पिक्सेल डेटा वापस कैनवास पर डालो
    ctx.putImageData(imageData, 0, 0);

    // --- अंतिम टच: फोटो को फटने से बचाने के लिए हल्का शार्प ---
    // (थोड़ा कॉन्ट्रास्ट बढ़ा रहे हैं ताकि आँखें/बाल शार्प रहें)
    ctx.filter = 'contrast(1.1) sharpen(0.5)';
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height); // कैनवास को खुद पर ही शार्प करो
    ctx.filter = 'none'; // फिल्टर हटा दो

    // UI अपडेट करो
    afterBox.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    statusText.innerText = "प्रोसेसिंग पूरी हुई! पिंपल्स साफ हो गए हैं।";
});

// 3. डाउनलोड और पॉप-अप (Toast)
downloadBtn.addEventListener('click', () => {
    // डाउनलोड लॉजिक
    const link = document.createElement('a');
    link.download = 'Pimple_Removed_Photo.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0); // हाई क्वालिटी
    link.click();

    // 'फोपा' (पॉप-अप) दिखाओ
    popup.classList.add("show");
    
    // 3 सेकंड बाद पॉप-अप अपने आप गायब हो जाएगा
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
});
