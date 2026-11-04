import numpy as np
from PIL import Image, ImageOps
from app.config import settings


def preprocess(image: Image.Image) -> np.ndarray:
    resized = ImageOps.fit(image.convert('RGB'), (settings.input_size, settings.input_size), method=Image.Resampling.LANCZOS)
    return np.expand_dims(np.asarray(resized, dtype=np.float32), axis=0)
