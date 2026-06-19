from flask import Flask, render_template, request, send_file
import cv2
import numpy as np
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            # इमेज को प्रोसेस करने का लॉजिक (ओपन सीवी)
            img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
            
            # यहाँ हमारा 'Remini' जैसा कड़क एनहांसमेंट लॉजिक
            lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
            cl = clahe.apply(l)
            img_final = cv2.merge((cl,a,b))
            img_final = cv2.cvtColor(img_final, cv2.COLOR_LAB2BGR)
            
            # सेव करके वापस भेजना
            cv2.imwrite('enhanced.jpg', img_final)
            return send_file('enhanced.jpg', mimetype='image/jpeg')
            
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
