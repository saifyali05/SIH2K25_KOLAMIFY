from ultralytics import YOLO

class DotDetector:
    def __init__(self, weights_path, device='cpu', conf=0.25):
        self.model = YOLO(weights_path)
        self.conf = conf
        self.device = device

    def predict_on_image(self, img_path, imgsz=640):
        results = self.model.predict(source=img_path,
                                     imgsz=imgsz,
                                     conf=self.conf,
                                     device=self.device,
                                     save=False)
        r = results[0]
        dots = []
        if hasattr(r, "boxes") and r.boxes is not None:
            for (x1, y1, x2, y2) in r.boxes.xyxy.cpu().numpy():
                cx = float((x1 + x2) / 2.0)
                cy = float((y1 + y2) / 2.0)
                dots.append((cx, cy))
        return dots
