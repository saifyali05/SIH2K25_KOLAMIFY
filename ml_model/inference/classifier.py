import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Path to your trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/resnet_class/best_model.pth")


# Multi-task ResNet definition
class MultiTaskResNet(nn.Module):
    def __init__(self, sym_classes, grid_classes, shape_classes):
        super(MultiTaskResNet, self).__init__()
        base_model = models.resnet18(weights=None)  # do not load pretrained
        # Remove original fc
        self.base_model = nn.Sequential(*list(base_model.children())[:-1])
        in_features = base_model.fc.in_features

        # Three heads for multi-task
        self.fc_symmetry = nn.Linear(in_features, sym_classes)
        self.fc_grid = nn.Linear(in_features, grid_classes)
        self.fc_shape = nn.Linear(in_features, shape_classes)

    def forward(self, x):
        x = self.base_model(x)
        x = torch.flatten(x, 1)
        out_sym = self.fc_symmetry(x)
        out_grid = self.fc_grid(x)
        out_shape = self.fc_shape(x)
        return out_sym, out_grid, out_shape


# Function to load model safely
def load_model(sym_classes, grid_classes, shape_classes):
    print(f"Loading model from: {MODEL_PATH}")
    model = MultiTaskResNet(sym_classes, grid_classes, shape_classes)

    state_dict = torch.load(MODEL_PATH, map_location=device)

    # Handle DataParallel key prefix
    new_state_dict = {}
    for k, v in state_dict.items():
        new_key = k.replace('module.', '')  # remove 'module.' if exists
        new_state_dict[new_key] = v

    # Load state dict with strict=False to ignore mismatches
    model.load_state_dict(new_state_dict, strict=False)
    model.to(device)
    model.eval()
    print("Model loaded successfully")
    return model


# Image classification function
def classify_image(img_path, model, sym_classes, grid_classes, shape_classes):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    img = Image.open(img_path).convert("RGB")
    img = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        out_sym, out_grid, out_shape = model(img)
        sym_pred = torch.argmax(out_sym, dim=1).item()
        grid_pred = torch.argmax(out_grid, dim=1).item()
        shape_pred = torch.argmax(out_shape, dim=1).item()

    return sym_pred, grid_pred, shape_pred
