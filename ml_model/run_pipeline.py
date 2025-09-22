import argparse
import os

from tornado import gen
from ultralytics import YOLO
from generator.kolam_rule_generator import KolamRuleBasedGenerator
from PIL import Image
import cv2
import numpy as np
from inference.classifier import load_model, classify_image
import json

# project_root = os.path.dirname(__file__)
# with open(os.path.join(project_root, "dataset/symmetry_mapping.json")) as f:
#     symmetry_mapping = json.load(f)
#
# with open(os.path.join(project_root, "dataset/grid_mapping.json")) as f:
#     grid_mapping = json.load(f)
#
# with open(os.path.join(project_root, "dataset/shape_mapping.json")) as f:
#     shape_mapping = json.load(f)
with open("dataset/symmetry_mapping.json", "r") as f:
    symmetry_mapping = {v: k.strip() for k, v in json.load(f).items()}

with open("dataset/grid_mapping.json", "r") as f:
    grid_mapping = {v: k.strip() for k, v in json.load(f).items()}

with open("dataset/shape_mapping.json", "r") as f:
    shape_mapping = {v: k.strip() for k, v in json.load(f).items()}

# from generator.kolam_rule_generator import load_model_outputs

# Define number of classes for each task
SYM_CLASSES = 25       # number of symmetry classes
GRID_CLASSES = 56      # number of grid classes
SHAPE_CLASSES = 28    # number of shape classes


def simplify_mask(mask, epsilon=3.0):
    """
    Simplify polygon points using cv2.approxPolyDP
    """
    mask_np = np.array(mask, dtype=np.float32)
    if len(mask_np.shape) == 2 and mask_np.shape[0] >= 3:
        approx = cv2.approxPolyDP(mask_np, epsilon, False)
        return [(float(x), float(y)) for x, y in approx[:, 0, :]]
    else:
        return [(float(x), float(y)) for x, y in mask_np]

def process_image(image_path, dot_model, line_model, output_dir, resnet_model):
    print(f"\nProcessing image: {image_path}")

    # ------------------------
    # 1. Run YOLOv8 Dot Detector
    # ------------------------
    print("[1] Running dot detector...")
    dot_results = dot_model(image_path)
    dots = [(x, y) for x, y, w, h in dot_results[0].boxes.xywh.cpu().numpy()]
    print(f"    -> found {len(dots)} dots")

    # ------------------------
    # 2. Run YOLOv8 Line Detector (Segmentation)
    # ------------------------
    print("[2] Running line detector...")
    line_results = line_model(image_path)
    lines = []
    if line_results[0].masks is not None:
        for mask in line_results[0].masks.xy:
            simplified = simplify_mask(mask)
            lines.append(simplified)
    print(f"    -> extracted {len(lines)} line segments")

    # ------------------------
    # 3.5 Run ResNet Classifier
    # ------------------------
    symmetry, grid, shape = classify_image(image_path, resnet_model, SYM_CLASSES, GRID_CLASSES, SHAPE_CLASSES)
    print(f"\n[3.5] Classification results:")
    # Symmetry
    # sym_label = symmetry_mapping.get(str(symmetry), "Unknown")
    # print(f"    Symmetry: {symmetry} → {sym_label}")
    #
    # # Grid
    # grid_label = grid_mapping.get(str(grid), "Unknown")
    # print(f"    Grid: {grid} → {grid_label}")
    #
    # # Shape
    # shape_label = shape_mapping.get(str(shape), "Unknown")
    # print(f"    Shape: {shape} → {shape_label}")

    print(f"    Symmetry: {symmetry} → {symmetry_mapping.get(symmetry, 'Unknown')}")
    print(f"    Grid: {grid} → {grid_mapping.get(grid, 'Unknown')}")
    print(f"    Shape: {shape} → {shape_mapping.get(shape, 'Unknown')}")

    # ------------------------
    # 4. Update generated pattern with class label
    # ------------------------
    class_label = f"sym{symmetry}_grid{grid}_shape{shape}"

    # Fix: define image size
    img = Image.open(image_path)
    w, h = img.size


    gen = KolamRuleBasedGenerator(image_size=(w, h), snap_threshold=20)
    generated = gen.load_model_outputs(dots, lines, class_label=class_label)
    print("\n[4] Generated pattern with classification label:")
    print(generated)

    # ------------------------
    # 5. Save visualization
    # ------------------------
    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.basename(image_path)
    save_path = os.path.join(output_dir, f"generated_{base_name}")
    gen.visualize(dots, lines, save_path=save_path)
    print(f"[✓] Visualization saved at {save_path}")

    # ------------------------
    # 5. Open image using PIL (works on any system)
    # ------------------------
    Image.open(save_path).show()

    import json

    # result_json = {
    #     "image": os.path.basename(image_path),
    #     "dots": dots,
    #     "lines": lines,
    #     "symmetry": symmetry,
    #     "grid": grid,
    #     "shape": shape,
    #     "generated_path": save_path
    # }
    sym_label = symmetry_mapping.get(str(symmetry), "Unknown")
    grid_label = grid_mapping.get(str(grid), "Unknown")
    shape_label = shape_mapping.get(str(shape), "Unknown")
    result_json = {
        "image": image_path,
        "dots": [tuple(map(float, d)) for d in dots],
        "lines": [[tuple(map(float, pt)) for pt in l] for l in lines],

        "classification": {
            "symmetry": {
                "id": int(symmetry),
                # "label": sym_label
            },
            "grid": {
                "id": int(grid),
                # "label": grid_label
            },
            "shape": {
                "id": int(shape),
                # "label": shape_label
            }
        }
    }




    json_path = os.path.join(output_dir, f"result_{os.path.basename(image_path).split('.')[0]}.json")
    with open(json_path, "w") as f:
        json.dump(result_json, f, indent=4)
    print(f"[✓] JSON results saved at {json_path}")


def main():
    image_path = "data/samples/test1.jpg"



    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--image", type=str, help="Path to input image. If omitted, all images in data/samples/ will be processed."
    )
    args = parser.parse_args()

    # Models
    dot_model = YOLO("models/yolov8_dots/best.pt")
    line_model = YOLO("models/yolov8_seg_lines/best.pt")
    resnet_model = load_model(SYM_CLASSES, GRID_CLASSES, SHAPE_CLASSES)
    print(resnet_model)  # Should show your model
    symmetry, grid, shape = classify_image(image_path, resnet_model, SYM_CLASSES, GRID_CLASSES, SHAPE_CLASSES)

    # Output folder
    output_dir = "data/outputs"

    # Process single image or all images
    if args.image:
        process_image(args.image, dot_model, line_model, output_dir, resnet_model)
    else:
        sample_dir = "data/samples"
        for img_file in os.listdir(sample_dir):
            if img_file.lower().endswith((".jpg", ".png", ".jpeg")):
                img_path = os.path.join(sample_dir, img_file)
                process_image(img_path, dot_model, line_model, output_dir)


if __name__ == "__main__":
    main()
