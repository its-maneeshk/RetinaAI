import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Model configuration
    MODEL_PATH = os.getenv('MODEL_PATH', 'model.keras')
    
    # Image processing configuration
    IMAGE_SIZE = (224, 224)  # Adjust based on your model requirements
    MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB max file size
    
    # API configuration
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 5000))
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # CORS configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')