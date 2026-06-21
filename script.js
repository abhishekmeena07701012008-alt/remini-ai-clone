filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "✨ Makeup Applying...";
    filterBtn.disabled = true;

    canvas.width = beforeImg.naturalWidth;
    canvas.height = beforeImg.naturalHeight;
    ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // गोरा करने वाला गणित (बिना ब्राइटनेस के)
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];

        // स्किन टोन पहचानो
        if (r > 90 && g > 60 && b > 40 && (r - b) > 10) {
            // हम 'Brightness' नहीं बढ़ा रहे, बस लाल और पीले को कम करके
            // नीले/सफेद शेड को बढ़ा रहे हैं (यह स्किन को 'Fair' बनाता है)
            data[i] = r * 0.95 + 10;   // रेड कम किया
            data[i + 1] = g * 1.05;    // ग्रीन थोड़ा बढ़ाया (नेचुरल लुक के लिए)
            data[i + 2] = b * 1.15;    // ब्लू बढ़ाया (गोरापन लाने के लिए)
        }
    }
    
    ctx.putImageData(imageData, 0, 0);

    // स्किन स्मूथिंग (पिंपल्स हटाने के लिए)
    // ब्लर बहुत कम किया है ताकि सिर्फ दाग-धब्बे छुपें
    ctx.filter = 'blur(0.8px)';
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    afterBox.style.display = 'block';
    filterBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';
    statusText.innerText = "✅ मेकअप और गोरापन लागू हो गया है!";
});
