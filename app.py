import streamlit as st
import cv2
import numpy as np
from PIL import Image

st.title("📸 Photo Enhancer Pro")
st.write("अपनी फोटो अपलोड करें और उसे HD में बदलें!")

uploaded_file = st.file_uploader("फोटो चुनें...", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # फोटो प्रोसेस करना
    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, 1)
    
    # Remini जैसा शार्पनेस और ब्राइटनेस वाला लॉजिक
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    img_final = cv2.merge((cl,a,b))
    img_final = cv2.cvtColor(img_final, cv2.COLOR_LAB2BGR)
    
    # रिज़ल्ट दिखाना
    st.image(img_final, caption='Enhanced Photo', use_column_width=True)
    
    # डाउनलोड बटन
    result_pil = Image.fromarray(cv2.cvtColor(img_final, cv2.COLOR_BGR2RGB))
    result_pil.save("enhanced_photo.jpg")
    with open("enhanced_photo.jpg", "rb") as file:
        st.download_button("डाउनलोड करें", file, "enhanced_photo.jpg")
