import numpy as np
from PIL import Image
from fastapi import HTTPException


def check_quality(image: Image.Image) -> tuple[str, list[str]]:
    thumbnail = image.convert('L').resize((256, 256))
    pixels = np.asarray(thumbnail, dtype=np.float32)
    brightness = float(pixels.mean())
    if float(pixels.std()) < 2.0:
        raise HTTPException(422, 'The image appears blank or nearly uniform. Upload a detailed synthetic retinal fundus image.')
    laplacian = 4 * pixels[1:-1, 1:-1] - pixels[:-2, 1:-1] - pixels[2:, 1:-1] - pixels[1:-1, :-2] - pixels[1:-1, 2:]
    sharpness = float(laplacian.var())
    messages: list[str] = []
    if brightness < 30:
        messages.append('The image may have insufficient brightness. Consider reviewing the image.')
    elif brightness > 225:
        messages.append('The image may be overexposed. Consider reviewing the image.')
    if sharpness < 18:
        messages.append('The image may have insufficient sharpness. Consider reviewing the image.')
    if messages:
        return 'WARNING', messages
    return 'ACCEPTABLE', ['The uploaded image passed basic technical checks.']
