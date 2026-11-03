# Diabetic Retinopathy Detection System

A full-stack web application for detecting diabetic retinopathy using a trained CNN model with 94% accuracy. The system consists of a React frontend and a Flask backend that serves the trained Keras model.

## 🏗️ Project Structure

```
diabetic-retinopathy-detection/
├── frontend/                          # React + TypeScript frontend
│   ├── public/
│   │   └── images/                    # Medical images for UI
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   │   └── Navigation.tsx
│   │   ├── pages/                     # Page components
│   │   │   ├── DetectionTool.tsx      # Main detection interface
│   │   │   ├── ResultsPage.tsx        # Results display
│   │   │   ├── AboutDiabetes.tsx      # Educational content
│   │   │   ├── CausesEffects.tsx      # Medical information
│   │   │   └── DiabetesTypes.tsx      # Diabetes types info
│   │   ├── services/                  # API service layer
│   │   │   └── api.ts                 # Backend communication
│   │   ├── App.tsx                    # Main app component
│   │   ├── main.tsx                   # App entry point
│   │   └── index.css                  # Global styles
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   └── .env.example                   # Environment variables template
├── backend/                           # Flask backend
│   ├── app.py                         # Main Flask application
│   ├── config.py                      # Configuration settings
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                   # Environment variables template
│   └── model.keras                    # Your trained model (place here)
└── README.md                          # This file
```

## 🚀 Features

- **AI-Powered Detection**: Uses your trained CNN model with 94% accuracy
- **Real-time Analysis**: Instant retinal image analysis
- **Multiple Classes**: Supports 5 classification classes:
  - `No_DR` - No Diabetic Retinopathy
  - `Mild` - Mild Diabetic Retinopathy
  - `Moderate` - Moderate Diabetic Retinopathy
  - `Severe` - Severe Diabetic Retinopathy
  - `Proliferate_DR` - Proliferative Diabetic Retinopathy
- **Patient Management**: Optional patient information tracking
- **Educational Content**: Comprehensive diabetes and retinopathy information
- **Responsive Design**: Works on desktop and mobile devices
- **Report Generation**: Downloadable analysis reports

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend

- **Flask** web framework
- **TensorFlow/Keras** for model inference
- **PIL (Pillow)** for image processing
- **Flask-CORS** for cross-origin requests
- **NumPy** for numerical operations

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- Your trained **model.keras** file

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/thakurmrvikas9/Diabetic-Retinopathy-Classification.git
cd diabetic-retinopathy-detection
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env
# Edit .env file with your settings

# Place your trained model
# Copy your model.keras file to the backend directory
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env file with your API URL (default: http://localhost:5001)
```

### 4. Model Placement

Place your trained `model.keras` file in the `backend/` directory. The model should be trained to classify the following classes in order:

- Index 0: `No_DR`
- Index 1: `Moderate`
- Index 2: `Mild`
- Index 3: `Proliferate_DR`
- Index 4: `Severe`

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5001`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration (.env)

```env
MODEL_PATH=model.keras
API_HOST=0.0.0.0
API_PORT=5001
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration (.env)

```env
VITE_API_URL=http://localhost:5001
```

## 📡 API Endpoints

### Health Check

```
GET /health
```

Returns server status and model loading status.

### Predict

```
POST /predict
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "patientInfo": {
    "id": "P001",
    "age": "45",
    "eye": "left"
  }
}
```

### Get Classes

```
GET /classes
```

Returns information about all supported classification classes.

## 🏗️ Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

### Backend Production

For production deployment, consider using:

- **Gunicorn** as WSGI server
- **Nginx** as reverse proxy
- **Docker** for containerization

## 🧪 Model Requirements

Your CNN model should:

- Accept input images of size 224x224x3 (RGB)
- Output predictions for 5 classes in the specified order
- Be saved in Keras format (.keras file)
- Have preprocessing that normalizes pixel values to [0,1]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Medical Disclaimer

This application is for educational and screening purposes only. It should not be used as a substitute for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals for medical decisions.

## 🆘 Troubleshooting

### Common Issues

1. **Model not loading**: Ensure your `model.keras` file is in the backend directory
2. **CORS errors**: Check that CORS_ORIGINS in backend .env matches your frontend URL
3. **Image upload fails**: Verify image is JPEG/PNG and under 10MB
4. **Connection refused**: Ensure backend server is running on correct port

### Support

For issues and questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for error details
4. Ensure all dependencies are correctly installed

## 📊 Performance

- **Model Accuracy**: 94%
- **Supported Image Formats**: JPEG, PNG
- **Maximum Image Size**: 10MB
- **Average Processing Time**: 2-5 seconds
- **Supported Classes**: 5 diabetic retinopathy stages
