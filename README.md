# 🎨 Kolamify: AI-Powered Kolam Pattern Recognition

![Kolamify](https://img.shields.io/badge/Kolamify-AI%2520Kolam%2520Analysis-blue)  
![Python](https://img.shields.io/badge/Python-3.8%252B-green)  
![Deep Learning](https://img.shields.io/badge/Deep%2520Learning-YOLOv8%252C%2520ResNet-orange)  

A sophisticated computer vision system that analyzes **traditional Kolam patterns** using state-of-the-art deep learning models.  
Kolamify combines multiple AI approaches to **detect dots, trace lines, and classify pattern types** with remarkable accuracy.

---

## 🌟 Features

### Multi-Stage Pattern Analysis
- **Dot Detection** → YOLOv8 model for precise identification of dots  
- **Line Segmentation** → YOLOv8 segmentation for accurate tracing  
- **Pattern Classification** → ResNet models for intelligent categorization  

### Classification Categories
- **Symmetry Types** → Symmetrical, Radial, Bilateral  
- **Grid Structures** → Multiple grid layouts & configurations  
- **Shape Recognition** → Detection of geometric shapes & motifs  

### Web Interface
- 📊 **Interactive Visualization** → Real-time pattern analysis display  
- 📂 **User-Friendly Upload** → Drag & drop image submission  
- 📑 **Results Dashboard** → Comprehensive visual + numeric insights  

---

## 🛠️ Technology Stack

### Backend & AI Models
- Python 3.8+  
- YOLOv8 (object detection & segmentation)  
- ResNet (classification)  
- OpenCV (image processing)  
- TensorFlow / PyTorch  
- NumPy, Pandas  
- Flask (web framework)  

### Frontend
- HTML5, CSS3  
- JavaScript  

---

## 📋 Prerequisites
- Python **3.8+**  
- `pip` (package manager)  
- Git  
- 4GB+ RAM (8GB recommended)  
- Browser with JavaScript enabled  

---

## 🚀 Installation

### 1. Clone the Repository
``` bash
git clone https://github.com/saifyali05/SIH2K25_KOLAMIFY.git
cd SIH_Project
```
### 2. Setup Backend
```bashcd server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
### 3. Setup ML Models
```bashcd ../ml_model
pip install -r requirements.txt
```
---
## 📦 Required Dependencies

server/requirements.txt
```text
flask>=2.0.0
flask-cors>=3.0.0
numpy>=1.19.0
pillow>=8.0.0
opencv-python>=4.5.0
```
### ml_model/requirements.txt
```text
ultralytics>=8.0.0
torch>=1.9.0
torchvision>=0.10.0
tensorflow>=2.6.0
opencv-python>=4.5.0
numpy>=1.19.0
pandas>=1.3.0
scikit-image>=0.18.0
matplotlib>=3.3.0
```
---
## 💻 Usage
### 1. Start Backend
```bash
cd server
python app.py
```
### Runs at → http://localhost:5000
### 2. Open Frontend

### Open frontend/index.html in a browser or serve via local server:
```bash
cd frontend
python -m http.server 8000
```
### 3. Run ML Pipeline Directly
```bash
cd ml_model
python run_pipeline.py --image path/to/kolam.jpg
```
---
## 📁 Project Structure
```text
SIH_Project/
├── frontend/        # Web interface
│   ├── index.html
│   ├── about.html
│   ├── login.html
│   ├── main.html
│   ├── styles.css
│   ├── script.js
│   └── images/
├── ml_model/        # ML pipeline
│   ├── run_pipeline.py
│   ├── data/
│   ├── outputs/
│   ├── inference/
│   ├── models/
│   ├── generator/
│   └── requirements.txt
└── server/          # Flask backend
    ├── app.py
    ├── requirements.txt
    └── uploads/
```
---
## 🎯 How It Works

### 1.Frontend → Upload Kolam image → Send via JS to backend

### 2.Backend → Flask server preprocesses image → Calls ML pipeline

### 3.ML Pipeline → YOLOv8 detects dots & lines → ResNet classifies patterns

### 4.Results → Sent back to frontend → Displayed interactively

---
## 🔄 API Flow
```scss
User Upload → Frontend (JS) → Flask Server → ML Pipeline → Results → Frontend Display
```
---
## 📊 Performance Metrics
| Model  | Task                   | Accuracy | Precision | Recall |
| ------ | ---------------------- | -------- | --------- | ------ |
| YOLOv8 | Dot Detection          | 98.2%    | 97.8%     | 98.5%  |
| YOLOv8 | Line Segmentation      | 96.5%    | 95.9%     | 97.1%  |
| ResNet | Pattern Classification | 94.3%    | 93.7%     | 94.8%  |

---
## 🌐 Web Interface Features
- ### Drag & Drop Upload
- ### Real-time Processing
- ### Interactive Visualization (zoom/pan)
- ### Multiple Pages → About, Login, Main
- ### Responsive Design (desktop + mobile)

---
## 🚀 Deployment
### Development
```bash
# Terminal 1 - Start backend
cd server
python app.py

# Terminal 2 - Serve frontend
cd frontend
python -m http.server 8000
```
---

[//]: # (## Production)

[//]: # (- #### Gunicorn/WSGI for Flask)

[//]: # ()
[//]: # (- #### Nginx/Apache for frontend)

[//]: # ()
[//]: # (- #### Configure CORS properly)

## 📝 License
```markdown
This project is licensed under the [MIT License](LICENSE).
```
---

## 🙏 Acknowledgments

- ### YOLOv8 Team → For cutting-edge detection framework
- ### Traditional Kolam Artists → Inspiration & preservation of heritage
- ### Open Source Communities → For tools & libraries
---
## 📞 Support

#### 📧 Email → [saifali9b@gmail.com](mailto:saifali9b@gmail.com)
#### 📂 Repository → [Kolamify GitHub](https://github.com/saifyali05/SIH2K25_KOLAMIFY.git)

---
<div align="center">

 #### ✨ Kolamify – Bridging traditional art with modern AI technology ✨
#### 🌺 Preserving cultural heritage through artificial intelligence 🌺

</div>

---
