const upload = document.getElementById('upload');
const beforeImg = document.getElementById('beforeImg');
const canvas = document.getElementById('canvas');
const filterBtn = document.getElementById('filterBtn');
const downloadBtn = document.getElementById('downloadBtn');
const beforeBox = document.getElementById('beforeBox');
const afterBox = document.getElementById('afterBox');
const popup = document.getElementById('popup');
const ctx = canvas.getContext('2d');

// 1. फोटो अपलोड
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    beforeImg.src = url;
    
    beforeImg.onload = () => {
        beforeBox.style.display = 'block';
        filterBtn.style.display = 'inline-block';
        downloadBtn.style.display = 'none';
        afterBox.style.display = 'none';
    };
});

// 2. मेकअप और ग्लो (Skin Smoothing Hack)
filterBtn.addEventListener('click', () => {
    filterBtn.innerText = "✨ Processing...";
    
    // कैनवास सेट करो
    canvas.width = beforeImg.naturalWidth;
    canvas.height = beforeImg.naturalHeight;

    // स्टेप 1: ओरिजिनल फोटो ड्रा करो (थोड़ा कॉन्ट्रास्ट बढ़ाकर)
    ctx.filter = 'contrast(1.1) saturate(1.2)';
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);

    // स्टेप 2: असली जादू (चेहरा गोरा और सॉफ्ट करने के लिए)
    // हम फोटो के ऊपर उसी फोटो की एक 'धुंधली और चमकीली' लेयर चढ़ाएंगे
    ctx.globalAlpha = 0.4; // 40% ट्रांसपेरेंसी
    ctx.globalCompositeOperation = 'screen'; // इससे स्किन गोरी (लाइट) हो जाती है
    ctx.filter = 'blur(6px) brightness(1.2)'; // ब्लर से दाग-धब्बे छुप जाएंगे
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);

    // सब कुछ रीसेट कर दो
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';

    // UI अपडेट करो
    afterBox.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    filterBtn.innerText = "✨ Apply Makeup & Glow";
});

// 3. डाउनलोड और पॉप-अप (Toast)
downloadBtn.addEventListener('click', () => {
    // डाउनलोड लॉजिक
    const link = document.createElement('a');
    link.download = 'Pro_Enhanced_Photo.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0); 
    link.click();

    // 'फोपा' (पॉप-अप) दिखाओ
    popup.classList.add("show");
    
    // 3 सेकंड बाद पॉप-अप अपने आप गायब हो जाएगा
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
});
