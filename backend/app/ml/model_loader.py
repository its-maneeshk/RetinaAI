import threading
import numpy as np
import tensorflow as tf
from app.config import settings
from app.ml.create_dummy_model import create_dummy_model


class ModelLoader:
    def __init__(self):
        self.model = None
        self.lock = threading.Lock()
        self.load_error: str | None = None

    def load(self) -> None:
        try:
            if not settings.model_path.is_file():
                if settings.model_type == 'DEMO' and settings.model_path.name == 'dummy_retina_model.keras':
                    create_dummy_model(settings.model_path)
                else:
                    raise ValueError('Configured model artifact is unavailable.')
            candidate = tf.keras.models.load_model(settings.model_path, compile=False, safe_mode=True)
            if tuple(candidate.input_shape) != (None, 224, 224, 3) or tuple(candidate.output_shape) != (None, 5):
                raise ValueError('The model must accept RGB 224 × 224 inputs and return five softmax scores.')
            is_dummy = candidate.name.startswith('retinaai_demo')
            if is_dummy != (settings.model_type == 'DEMO'):
                raise ValueError('Model artifact and MODEL_TYPE do not match. A demo artifact cannot be labeled TRAINED.')
            scores = np.asarray(candidate(np.zeros((1, 224, 224, 3), dtype=np.float32), training=False))[0]
            self.validate_scores(scores)
            self.model = candidate
            self.load_error = None
        except Exception:
            self.model = None
            self.load_error = 'Model unavailable or incompatible. Review the backend model configuration.'

    @staticmethod
    def validate_scores(scores: np.ndarray) -> None:
        if scores.shape != (5,) or not np.isfinite(scores).all() or (scores < 0).any() or (scores > 1).any() or not np.isclose(scores.sum(), 1, atol=0.001):
            raise ValueError('Expected five finite softmax scores summing to one.')

    def predict(self, batch: np.ndarray) -> np.ndarray:
        if self.model is None:
            raise RuntimeError('Model unavailable.')
        with self.lock:
            scores = np.asarray(self.model(batch, training=False), dtype=np.float32)[0]
        self.validate_scores(scores)
        return scores


model_loader = ModelLoader()
