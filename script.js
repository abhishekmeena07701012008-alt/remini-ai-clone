const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // यहाँ हम AI मॉडल लोड करेंगे
        console.log("Processing image with AI...");
        await processImage();
    };
});

async function processImage() {
    // आगे का कोड यहाँ आएगा जहाँ हम model.predict() करेंगे
    alert("AI Model अभी लोड हो रहा है... आगे का कोड तैयार है?");
}
