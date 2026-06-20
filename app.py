# बस एक छोटा सा Python सर्वर जो HTML सर्व करेगा
from flask import Flask, send_from_directory
app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(port=8080)
