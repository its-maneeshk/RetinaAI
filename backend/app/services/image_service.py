from io import BytesIO
from pathlib import Path
import uuid
import warnings
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import HTTPException
from app.config import settings

Image.MAX_IMAGE_PIXELS = settings.max_image_pixels
FORMATS = {'.jpg': 'JPEG', '.jpeg': 'JPEG', '.png': 'PNG', '.webp': 'WEBP'}
MIME_TYPES = {'JPEG': 'image/jpeg', 'PNG': 'image/png', 'WEBP': 'image/webp'}


def decode_image(data: bytes, filename: str, content_type: str | None) -> Image.Image:
    extension = Path(filename).suffix.lower()
    if extension not in FORMATS:
        raise HTTPException(415, 'Upload a JPEG, PNG, or WebP retinal fundus image.')
    if len(data) > settings.max_image_bytes:
        raise HTTPException(413, 'This image exceeds the 10 MB limit.')
    if not data:
        raise HTTPException(422, 'The uploaded file is empty.')
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(BytesIO(data)) as image:
                actual_format = image.format
                if actual_format != FORMATS[extension] or content_type != MIME_TYPES.get(actual_format):
                    raise HTTPException(415, 'The file extension, content type, and decoded image format must match.')
                if getattr(image, 'n_frames', 1) != 1:
                    raise HTTPException(422, 'Animated or multi-frame images are not supported.')
                if min(image.size) < settings.input_size:
                    raise HTTPException(422, 'The image must be at least 224 × 224 pixels.')
                if image.width * image.height > settings.max_image_pixels:
                    raise HTTPException(422, 'The image has too many pixels. Use a photograph under 24 megapixels.')
                image.verify()
            with Image.open(BytesIO(data)) as image:
                oriented = ImageOps.exif_transpose(image)
                oriented.load()
                return oriented.convert('RGB')
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise HTTPException(422, 'The uploaded file could not be processed. Please upload a valid retinal fundus photograph.') from None


def save_private_image(image: Image.Image) -> str:
    settings.upload_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
    filename = f'{uuid.uuid4().hex}.jpg'
    path = settings.upload_dir / filename
    image.save(path, format='JPEG', quality=92, exif=b'')
    path.chmod(0o600)
    return filename


def remove_private_image(filename: str | None) -> None:
    if filename and Path(filename).name == filename:
        (settings.upload_dir / filename).unlink(missing_ok=True)
