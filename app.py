from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from ml_model.generator.kolam_rule_generator import KolamRuleBasedGenerator
from ml_model.inference.classifier import load_model, classify_image
from PIL import Image
import cv2
import numpy as np
import os
import json

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

# Load mappings
with open("ml_model/dataset/symmetry_mapping.json") as f:
    symmetry_mapping = {v: k.strip() for k, v in json.load(f).items()}
with open("ml_model/dataset/grid_mapping.json") as f:
    grid_mapping = {v: k.strip() for k, v in json.load(f).items()}
with open("ml_model/dataset/shape_mapping.json") as f:
    shape_mapping = {v: k.strip() for k, v in json.load(f).items()}

# Constants
SYM_CLASSES = 25
GRID_CLASSES = 56
SHAPE_CLASSES = 28

# Load models once
dot_model = YOLO("ml_model/models/yolov8_dots/best.pt")
line_model = YOLO("ml_model/models/yolov8_seg_lines/best.pt")
resnet_model = load_model(SYM_CLASSES, GRID_CLASSES, SHAPE_CLASSES)

def simplify_mask(mask, epsilon=3.0):
    mask_np = np.array(mask, dtype=np.float32)
    if len(mask_np.shape) == 2 and mask_np.shape[0] >= 3:
        approx = cv2.approxPolyDP(mask_np, epsilon, False)
        return [(float(x), float(y)) for x, y in approx[:, 0, :]]
    return [(float(x), float(y)) for x, y in mask_np]

def process_image(image_path):
    dot_results = dot_model(image_path)
    dots = [(x, y) for x, y, w, h in dot_results[0].boxes.xywh.cpu().numpy()]

    line_results = line_model(image_path)
    lines = [simplify_mask(mask) for mask in line_results[0].masks.xy] if line_results[0].masks else []

    symmetry, grid, shape = classify_image(image_path, resnet_model, SYM_CLASSES, GRID_CLASSES, SHAPE_CLASSES)

    img = Image.open(image_path)
    w, h = img.size
    gen = KolamRuleBasedGenerator(image_size=(w, h), snap_threshold=20)
    class_label = f"sym{symmetry}_grid{grid}_shape{shape}"
    generated = gen.load_model_outputs(dots, lines, class_label=class_label)

    result_json = {
        "dots": dots,
        "lines": lines,
        "classification": {
            "symmetry": {"id": int(symmetry), "label": symmetry_mapping.get(str(symmetry), "Unknown")},
            "grid": {"id": int(grid), "label": grid_mapping.get(str(grid), "Unknown")},
            "shape": {"id": int(shape), "label": shape_mapping.get(str(shape), "Unknown")}
        },
        "generated_pattern": generated
    }
    return result_json

@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    save_path = os.path.join("server", "temp_images", file.filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    file.save(save_path)

    result = process_image(save_path)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)