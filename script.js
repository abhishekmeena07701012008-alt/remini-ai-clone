const upload = document.getElementById('upload');
const beforeImg = document.getElementById('beforeImg');
const canvas = document.getElementById('canvas');
const filterBtn = document.getElementById('filterBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusText = document.getElementById('status');
const ctx = canvas.getContext('2d');

// 1. फोटो अपलोड हैंडलिंग
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
        statusText.innerText = "फोटो लोड हो गई। अब Enhance पर क्लिक करें।";
    };
});

// 2. प्रोसेसिंग (यहाँ फोन क्रैश नहीं होगा)
filterBtn.addEventListener('click', () => {
    filterBtn.innerText = "Processing...";
    statusText.innerText = "फोटो साफ़ की जा रही है...";

    // कैनवास को ओरिजिनल फोटो के साइज का बनाओ
    canvas.width = beforeImg.naturalWidth;
    canvas.height = beforeImg.naturalHeight;

    // जादू यहाँ है: बिना AI के फोटो को शार्प और क्लियर करना
    // Contrast (1.2), Saturation (1.3), और Brightness (1.05) बढ़ा रहे हैं
    ctx.filter = 'contrast(1.2) saturate(1.3) brightness(1.05)';
    
    // कैनवास पर फिल्टर के साथ फोटो ड्रा कर दो
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);
    
    // फिल्टर रीसेट कर दो (ताकि आगे दिक्कत न हो)
    ctx.filter = 'none'; 

    // UI अपडेट करो
    canvas.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    statusText.innerText = "प्रोसेसिंग पूरी हुई! अब फोटो एकदम साफ़ है।";
});

// 3. डाउनलोड लॉजिक
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'enhanced-photo.jpg';
    // हाई क्वालिटी JPEG में डाउनलोड
    link.href = canvas.toDataURL('image/jpeg', 1.0); 
    link.click();
});
