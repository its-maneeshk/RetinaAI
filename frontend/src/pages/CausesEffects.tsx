import React from 'react';
import { Zap, Target, AlertTriangle, TrendingUp, Heart, Brain, Eye, FileKey as Kidney, Shield, Activity } from 'lucide-react';

const CausesEffects = () => {
  const primaryCauses = [
    {
      icon: Target,
      title: 'Insulin Resistance',
      description: 'Cells become less responsive to insulin, requiring higher levels to maintain normal blood glucose.',
      category: 'Metabolic'
    },
    {
      icon: Activity,
      title: 'Beta Cell Dysfunction',
      description: 'Pancreatic beta cells fail to produce adequate insulin to meet the body\'s needs.',
      category: 'Pancreatic'
    },
    {
      icon: TrendingUp,
      title: 'Genetic Predisposition',
      description: 'Inherited genetic variants increase susceptibility to developing diabetes.',
      category: 'Genetic'
    },
    {
      icon: Shield,
      title: 'Autoimmune Response',
      description: 'Immune system attacks and destroys insulin-producing beta cells (Type 1).',
      category: 'Autoimmune'
    }
  ];

  const lifestyleFactors = [
    {
      factor: 'Poor Diet',
      impact: 'High',
      description: 'Excessive consumption of processed foods, sugary drinks, and refined carbohydrates',
      color: 'red'
    },
    {
      factor: 'Physical Inactivity',
      impact: 'High',
      description: 'Sedentary lifestyle reduces insulin sensitivity and glucose uptake by muscles',
      color: 'red'
    },
    {
      factor: 'Obesity',
      impact: 'Very High',
      description: 'Excess body fat, especially abdominal fat, increases insulin resistance',
      color: 'red'
    },
    {
      factor: 'Chronic Stress',
      impact: 'Medium',
      description: 'Prolonged stress elevates cortisol levels, affecting blood glucose regulation',
      color: 'yellow'
    },
    {
      factor: 'Sleep Disorders',
      impact: 'Medium',
      description: 'Poor sleep quality and duration affect glucose metabolism and insulin sensitivity',
      color: 'yellow'
    },
    {
      factor: 'Smoking',
      impact: 'Medium',
      description: 'Tobacco use increases insulin resistance and risk of complications',
      color: 'orange'
    }
  ];

  const shortTermEffects = [
    { effect: 'Frequent urination (polyuria)', severity: 'mild' },
    { effect: 'Excessive thirst (polydipsia)', severity: 'mild' },
    { effect: 'Increased hunger (polyphagia)', severity: 'mild' },
    { effect: 'Unexplained weight loss', severity: 'moderate' },
    { effect: 'Fatigue and weakness', severity: 'moderate' },
    { effect: 'Blurred vision', severity: 'moderate' },
    { effect: 'Slow-healing wounds', severity: 'moderate' },
    { effect: 'Frequent infections', severity: 'severe' }
  ];

  const longTermComplications = [
    {
      icon: Eye,
      title: 'Diabetic Retinopathy',
      description: 'Progressive damage to retinal blood vessels leading to vision loss',
      timeline: '5-10 years',
      prevention: 'Regular eye exams, blood sugar control'
    },
    {
      icon: Kidney,
      title: 'Diabetic Nephropathy',
      description: 'Kidney damage progressing to chronic kidney disease',
      timeline: '10-20 years',
      prevention: 'Blood pressure control, protein restriction'
    },
    {
      icon: Brain,
      title: 'Diabetic Neuropathy',
      description: 'Nerve damage causing pain, numbness, and loss of sensation',
      timeline: '5-15 years',
      prevention: 'Glucose control, foot care, regular monitoring'
    },
    {
      icon: Heart,
      title: 'Cardiovascular Disease',
      description: 'Increased risk of heart attack, stroke, and peripheral artery disease',
      timeline: '5-10 years',
      prevention: 'Cholesterol management, blood pressure control'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'mild': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <img 
          src="/images/ophthalmologist-consultation.jpg" 
          alt="Diabetic retinopathy examination and causes research"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Diabetes: Causes & Effects</h1>
            <p className="text-xl text-red-100 leading-relaxed mb-6">
              Understanding the underlying causes of diabetes and its wide-ranging effects on the body 
              is crucial for prevention, early detection, and effective management.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">Multiple Risk Factors</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">Preventable Complications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Causes */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="mr-3 h-8 w-8 text-red-600" />
          Primary Causes of Diabetes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {primaryCauses.map((cause, index) => {
            const Icon = cause.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{cause.title}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {cause.category}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{cause.description}</p>
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <div className="px-6 pb-6">
                    <img 
                      src="/images/retinal-examination-1.jpg" 
                      alt="Diabetic retinopathy pathophysiology research"
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifestyle Factors */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contributing Lifestyle Factors</h2>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
          <div className="p-6">
            <div className="space-y-4">
              {lifestyleFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{factor.factor}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getImpactColor(factor.impact)}`}>
                        {factor.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <img 
              src="/images/retinal-screening-1.jpg" 
              alt="Risk factors for diabetic retinopathy development"
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Short-term Effects */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-500"></div>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="mr-3 h-6 w-6 text-yellow-600" />
              Short-term Effects
            </h2>
            <p className="text-gray-600 mt-2">Early symptoms and immediate health impacts</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {shortTermEffects.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-gray-700">{item.effect}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These symptoms may develop gradually and can be easily overlooked. 
                If you experience multiple symptoms, consult a healthcare provider for proper evaluation.
              </p>
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <img 
              src="/images/ophthalmologist-consultation.jpg" 
              alt="Early diabetic retinopathy symptoms and detection"
              className="w-full h-32 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Long-term Complications */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="mr-3 h-6 w-6 text-red-600" />
              Long-term Complications
            </h2>
            <p className="text-gray-600 mt-2">Chronic complications from uncontrolled diabetes</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {longTermComplications.map((complication, index) => {
                const Icon = complication.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Icon className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{complication.title}</h3>
                          <span className="text-xs text-gray-500">{complication.timeline}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{complication.description}</p>
                        <div className="bg-green-50 rounded p-2">
                          <p className="text-xs text-green-800">
                            <strong>Prevention:</strong> {complication.prevention}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <img 
              src="/images/retinal-examination-1.jpg" 
              alt="Advanced diabetic retinopathy complications"
              className="w-full h-32 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="mt-12 relative bg-gradient-to-r from-green-900 via-green-800 to-teal-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <img 
          src="/images/retinal-screening-1.jpg" 
          alt="Diabetic retinopathy prevention and management strategies"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Prevention & Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-white">Lifestyle Modifications</h3>
              <ul className="text-sm space-y-1 text-green-100">
                <li>• Maintain healthy weight</li>
                <li>• Regular physical activity</li>
                <li>• Balanced, nutritious diet</li>
                <li>• Adequate sleep</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-white">Medical Management</h3>
              <ul className="text-sm space-y-1 text-green-100">
                <li>• Regular blood glucose monitoring</li>
                <li>• Medication adherence</li>
                <li>• Regular medical check-ups</li>
                <li>• Blood pressure control</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-white">Complication Prevention</h3>
              <ul className="text-sm space-y-1 text-green-100">
                <li>• Annual eye examinations</li>
                <li>• Kidney function monitoring</li>
                <li>• Foot care and inspection</li>
                <li>• Cardiovascular risk assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CausesEffects;