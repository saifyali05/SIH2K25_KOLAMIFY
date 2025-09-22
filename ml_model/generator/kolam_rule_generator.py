# generator/kolam_rule_generator.py

import cv2
import numpy as np

class KolamRuleBasedGenerator:
    def __init__(self, image_size=(640, 640), snap_threshold=10):
        """
        Rule-based generator for kolam patterns.
        Args:
            image_size (tuple): (width, height) of the input image
            snap_threshold (int): distance threshold for snapping lines to dots
        """
        self.image_size = image_size
        self.snap_threshold = snap_threshold

    def generate(self, dot_results, line_results, classification=None):
        """
        Generate kolam patterns by applying simple rules.
        Args:
            dot_results: list of (x, y) dot coordinates
            line_results: list of polygons or points for lines
            classification: optional ResNet classification label
        Returns:
            dict: generated pattern info
        """

        snapped_lines = []
        for line in line_results:
            # If line is a polygon (list of points), compute its centroid
            if isinstance(line[0], (list, tuple)):
                xs = [p[0] for p in line]
                ys = [p[1] for p in line]
                line_x = sum(xs) / len(xs)
                line_y = sum(ys) / len(ys)
            else:
                # If line is already a point/tuple
                line_x, line_y = line[0], line[1]

            # Find nearest dot to this line's center
            nearest_dot = min(
                dot_results,
                key=lambda d: (line_x - d[0])**2 + (line_y - d[1])**2
            )
            snapped_lines.append(((line_x, line_y), nearest_dot))

        generated_pattern = {
            "dots": len(dot_results),
            "lines": len(line_results),
            "snapped_lines": snapped_lines,
            "classification": classification,
            "rules_applied": True,
        }
        return generated_pattern

    def load_model_outputs(self, dot_results, line_results, class_label=None):
        """
        Wrapper so run_pipeline.py can call this.
        """
        return self.generate(dot_results, line_results, classification=class_label)

    def visualize(self, dot_results, line_results, save_path="output/generated_kolam.jpg"):
        """
        Visualize the regenerated kolam:
        - Draw dots as circles
        - Draw snapped lines to nearest dots
        """
        w, h = self.image_size
        canvas = np.ones((h, w, 3), dtype=np.uint8) * 255  # white background

        # Draw dots
        for (x, y) in dot_results:
            cv2.circle(canvas, (int(x), int(y)), 5, (0, 0, 255), -1)  # red dot

        # Draw lines
        for line in line_results:
            if isinstance(line[0], (list, tuple)):
                pts = np.array(line, np.int32).reshape((-1, 1, 2))
                cv2.polylines(canvas, [pts], isClosed=False, color=(0, 255, 0), thickness=2)
            else:
                cv2.circle(canvas, (int(line[0]), int(line[1])), 3, (0, 255, 0), -1)

        # Save visualization
        cv2.imwrite(save_path, canvas)
        print(f"[✓] Visualization saved at {save_path}")
