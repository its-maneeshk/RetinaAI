import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, XCircle, AlertTriangle, Download, Share2, Calendar, User } from 'lucide-react';

interface PredictionResult {
  class: string;
  confidence: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'proliferative';
  recommendation: string;
  description: string;
}

interface PatientInfo {
  id: string;
  age: string;
  eye: 'left' | 'right' | '';
}

interface LocationState {
  result: PredictionResult;
  patientInfo: PatientInfo;
  imagePreview: string;
  fileName: string;
}

const severityColors = {
  none: 'text-green-600 bg-green-50 border-green-200',
  mild: 'text-blue-600 bg-blue-50 border-blue-200',
  moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  severe: 'text-orange-600 bg-orange-50 border-orange-200',
  proliferative: 'text-red-600 bg-red-50 border-red-200'
};

const severityIcons = {
  none: CheckCircle,
  mild: Eye,
  moderate: AlertTriangle,
  severe: AlertTriangle,
  proliferative: XCircle
};

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Redirect if no state is provided
  if (!state || !state.result) {
    navigate('/');
    return null;
  }

  const { result, patientInfo, imagePreview, fileName } = state;
  const SeverityIcon = severityIcons[result.severity];
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const handleDownloadReport = () => {
    // Create a simple text report
    const reportContent = `
DIABETIC RETINOPATHY ANALYSIS REPORT
=====================================

Analysis Date: ${currentDate}
Analysis Time: ${currentTime}

PATIENT INFORMATION:
${patientInfo.id ? `Patient ID: ${patientInfo.id}` : ''}
${patientInfo.age ? `Age: ${patientInfo.age} years` : ''}
${patientInfo.eye ? `Eye: ${patientInfo.eye === 'left' ? 'Left' : 'Right'}` : ''}

IMAGE INFORMATION:
File Name: ${fileName}

ANALYSIS RESULTS:
Classification: ${result.class}
Confidence Level: ${result.confidence}%
Severity: ${result.severity.toUpperCase()}

DESCRIPTION:
${result.description}

RECOMMENDATION:
${result.recommendation}

DISCLAIMER:
This AI analysis is for screening purposes only. Always consult with a qualified ophthalmologist for proper medical diagnosis and treatment decisions.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diabetic_retinopathy_analysis_${currentDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Diabetic Retinopathy Analysis Results',
          text: `Analysis Result: ${result.class} (${result.confidence}% confidence)`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Diabetic Retinopathy Analysis Results\n\nResult: ${result.class}\nConfidence: ${result.confidence}%\nRecommendation: ${result.recommendation}`;
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Detection Tool</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-gray-600 mt-1">Diabetic Retinopathy Detection Report</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
              
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Download Report</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Result Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-500"></div>
              <div className="p-8">
                <div className={`p-6 rounded-xl border-2 ${severityColors[result.severity]} mb-6`}>
                  <div className="flex items-start space-x-4">
                    <SeverityIcon className="h-8 w-8 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{result.class}</h2>
                      <p className="text-lg opacity-90 mb-4">{result.description}</p>
                      
                      {/* Confidence Score */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Confidence Level</span>
                          <span className="text-xl font-bold">{result.confidence}%</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
                          <div 
                            className="bg-current h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Medical Recommendation
                  </h3>
                  <p className="text-amber-800 leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Analysis Details</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                      Analysis Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">{currentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium text-gray-900">{currentTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Image File:</span>
                        <span className="font-medium text-gray-900 truncate ml-2">{fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Analysis Method:</span>
                        <span className="font-medium text-gray-900">AI Deep Learning</span>
                      </div>
                    </div>
                  </div>

                  {(patientInfo.id || patientInfo.age || patientInfo.eye) && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-600" />
                        Patient Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        {patientInfo.id && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Patient ID:</span>
                            <span className="font-medium text-gray-900">{patientInfo.id}</span>
                          </div>
                        )}
                        {patientInfo.age && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Age:</span>
                            <span className="font-medium text-gray-900">{patientInfo.age} years</span>
                          </div>
                        )}
                        {patientInfo.eye && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Eye:</span>
                            <span className="font-medium text-gray-900">
                              {patientInfo.eye === 'left' ? 'Left' : 'Right'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Consult Healthcare Provider</p>
                      <p className="text-sm text-gray-600">Share these results with your ophthalmologist or healthcare provider for professional evaluation.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Follow Recommendations</p>
                      <p className="text-sm text-gray-600">Adhere to the medical recommendations provided based on your analysis results.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Regular Monitoring</p>
                      <p className="text-sm text-gray-600">Continue regular eye examinations and diabetes management as advised by your healthcare team.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
              <div className="h-2 bg-gradient-to-r from-teal-500 to-green-500"></div>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Analyzed Image</h3>
              </div>
              <div className="p-6">
                <img 
                  src={imagePreview} 
                  alt="Analyzed retinal image" 
                  className="w-full rounded-lg shadow-md border border-gray-200"
                />
                <p className="text-sm text-gray-600 mt-3 text-center">{fileName}</p>
              </div>
              
              {/* Severity Scale */}
              <div className="p-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Severity Scale</h4>
                <div className="space-y-2">
                  {[
                    { level: 'none', label: 'No DR', color: 'bg-green-500' },
                    { level: 'mild', label: 'Mild DR', color: 'bg-blue-500' },
                    { level: 'moderate', label: 'Moderate DR', color: 'bg-yellow-500' },
                    { level: 'severe', label: 'Severe DR', color: 'bg-orange-500' },
                    { level: 'proliferative', label: 'Proliferative DR', color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.level} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color} ${result.severity === item.level ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}></div>
                      <span className={`text-sm ${result.severity === item.level ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Medical Disclaimer:</strong> This AI analysis is for screening purposes only. 
                  Always consult with a qualified ophthalmologist for proper medical diagnosis and treatment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Eye className="h-5 w-5" />
            <span>Analyze Another Image</span>
          </Link>
          
          <Link
            to="/about-diabetes"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Learn More About Diabetes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;