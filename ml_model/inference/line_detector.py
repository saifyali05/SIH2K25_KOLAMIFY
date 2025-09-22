import numpy as np
from ultralytics import YOLO
from skimage.morphology import skeletonize
import networkx as nx

class LineDetector:
    def __init__(self, weights_path, device='cpu', conf=0.25, min_area=50):
        self.model = YOLO(weights_path)
        self.conf = conf
        self.device = device
        self.min_area = min_area

    def _mask_to_segments(self, mask):
        skel = skeletonize(mask > 0)
        coords = np.transpose(np.nonzero(skel))
        if coords.size == 0:
            return []
        coords_set = set((int(r), int(c)) for r, c in coords)
        G = nx.Graph()
        for r, c in coords_set:
            G.add_node((r, c))
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if dr == 0 and dc == 0:
                        continue
                    nbr = (r + dr, c + dc)
                    if nbr in coords_set:
                        G.add_edge((r, c), nbr)

        segments = []
        for comp in nx.connected_components(G):
            nodes = list(comp)
            if len(nodes) < 2:
                continue
            (r1, c1), (r2, c2) = nodes[0], nodes[-1]
            segments.append(((float(c1), float(r1)), (float(c2), float(r2))))
        return segments

    def predict_on_image(self, img_path, imgsz=640):
        results = self.model.predict(source=img_path,
                                     imgsz=imgsz,
                                     conf=self.conf,
                                     device=self.device,
                                     save=False)
        r = results[0]
        segs = []

        if hasattr(r, "masks") and r.masks is not None:
            mask_arr = r.masks.data.cpu().numpy()  # (n, H, W)
            for m in mask_arr:
                binmask = (m > 0.5).astype("uint8")
                if binmask.sum() < self.min_area:
                    continue
                segs.extend(self._mask_to_segments(binmask))
        return segs
