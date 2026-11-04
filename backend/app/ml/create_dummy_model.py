from pathlib import Path
import os
os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')
os.environ.setdefault('TF_NUM_INTRAOP_THREADS', '2')
os.environ.setdefault('TF_NUM_INTEROP_THREADS', '2')
import tensorflow as tf


def create_dummy_model(path: Path | None = None) -> Path:
    destination = path or Path(__file__).with_name('dummy_retina_model.keras')
    tf.keras.utils.set_random_seed(2026)
    inputs = tf.keras.Input(shape=(224, 224, 3), name='rgb_0_to_255')
    features = tf.keras.layers.Rescaling(1.0 / 255.0)(inputs)
    features = tf.keras.layers.Conv2D(6, 3, strides=4, activation='relu', name='untrained_features')(features)
    features = tf.keras.layers.GlobalAveragePooling2D()(features)
    outputs = tf.keras.layers.Dense(5, activation='softmax', name='simulated_scores')(features)
    model = tf.keras.Model(inputs, outputs, name='retinaai_demo_untrained')
    destination.parent.mkdir(parents=True, exist_ok=True)
    model.save(destination)
    return destination


if __name__ == '__main__':
    artifact = create_dummy_model()
    print(f'Created untrained DEMO model: {artifact.name}. Outputs have no clinical meaning.')
