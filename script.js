// 4. फिल्टर बटन (GPU प्रोसेसिंग)
filterBtn.addEventListener('click', async () => {
    filterBtn.innerText = "Processing on GPU... (कृपया प्रतीक्षा करें)";
    filterBtn.disabled = true;
    statusText.innerText = "आपके फोन का GPU काम कर रहा है। इसमें कुछ सेकंड लग सकते हैं...";

    try {
        // --- नया कोड: GPU क्रैश रोकने के लिए फोटो को Resize करना ---
        const MAX_WIDTH = 400; // मोबाइल GPU के लिए सेफ साइज
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        let width = beforeImg.naturalWidth || beforeImg.width;
        let height = beforeImg.naturalHeight || beforeImg.height;

        // अगर फोटो बहुत बड़ी है, तो उसे छोटा करो
        if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
        }

        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(beforeImg, 0, 0, width, height);
        // -------------------------------------------------------------

        // अब ओरिजिनल फोटो की जगह Resize की हुई फोटो (tempCanvas) AI को दो
        const upscaledImgSrc = await upscaler.upscale(tempCanvas);
        
        // साफ़ हुई फोटो को मेन कैनवास पर ड्रा करो
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
        console.error("GPU Error:", error);
        statusText.innerText = "फोटो अभी भी बहुत बड़ी है या GPU क्रैश हो गया।";
        filterBtn.innerText = "Apply AI Filter (Use GPU)";
        filterBtn.disabled = false;
    }
});
