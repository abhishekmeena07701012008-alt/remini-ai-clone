filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "✨ Processing...";
    filterBtn.disabled = true;

    canvas.width = beforeImg.naturalWidth;
    canvas.height = beforeImg.naturalHeight;
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // --- लॉजिक: स्किन और बैकग्राउंड अलग करना ---
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];

        // स्किन टोन की पहचान (यह एक रफ स्किन टोन रेंज है)
        // अगर पिक्सेल स्किन जैसा है, तो उसे गोरा/स्मूथ करो
        if (r > 95 && g > 40 && b > 20 && r > g && r > b) {
            // स्किन को गोरा करना (ब्राइटनेस बढ़ाना)
            data[i] = Math.min(255, r + 25); 
            data[i + 1] = Math.min(255, g + 25);
            data[i + 2] = Math.min(255, b + 25);
        } else {
            // बैकग्राउंड को थोड़ा वाइब्रेंट करना (बिना चेहरे पर लाइट डाले)
            data[i] = Math.min(255, r * 1.1); 
            data[i + 1] = Math.min(255, g * 1.1);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);

    // दाग-धब्बे हटाने के लिए बहुत हल्का सा स्मूथिंग फिल्टर
    ctx.filter = 'blur(0.5px) contrast(1.05)';
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    afterBox.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    statusText.innerText = "✅ चेहरा क्लीन और बैकग्राउंड ब्राइट हो गया है!";
});
