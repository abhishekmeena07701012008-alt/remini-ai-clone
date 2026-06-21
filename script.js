<!DOCTYPE html>
<html>
<body>
    <!-- फोटो अपलोड का बटन -->
    <input type="file" id="uploadInput" accept="image/*">
    <br>
    <!-- फोटो यहाँ दिखेगी -->
    <img id="sourceImg" style="display:none; max-width: 300px;">
    <canvas id="mainCanvas" style="display:none; max-width: 300px;"></canvas>
    <br>
    <button id="applyBtn" style="display:none;">फिल्टर लगाओ</button>
    <button id="downloadBtn" style="display:none;">डाउनलोड करो</button>

    <script>
        const input = document.getElementById('uploadInput');
        const img = document.getElementById('sourceImg');
        const canvas = document.getElementById('mainCanvas');
        const applyBtn = document.getElementById('applyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const ctx = canvas.getContext('2d');

        // 1. फोटो अपलोड होते ही लोड करना
        input.onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                img.src = event.target.result;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    img.style.display = 'block';
                    applyBtn.style.display = 'inline-block';
                };
            };
            reader.readAsDataURL(e.target.files[0]);
        };

        // 2. फिल्टर बटन
        applyBtn.onclick = () => {
            // यहाँ तेरा वो कलर वाला गोरापन वाला कोड काम करेगा
            // ... (बाकी logic)
            canvas.style.display = 'block';
            downloadBtn.style.display = 'inline-block';
        };

        // 3. डाउनलोड बटन
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'edited-photo.jpg';
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        };
    </script>
</body>
</html>
