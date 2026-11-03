import React from 'react';
import { Users, Baby, Heart, Zap, AlertCircle, Activity, Clock, Target } from 'lucide-react';

const DiabetesTypes = () => {
  const diabetesTypes = [
    {
      id: 'type1',
      title: 'Type 1 Diabetes',
      icon: Zap,
      prevalence: '5-10%',
      onset: 'Usually childhood/adolescence',
      cause: 'Autoimmune destruction of beta cells',
      color: 'red',
      characteristics: [
        'Absolute insulin deficiency',
        'Rapid onset of symptoms',
        'Requires insulin therapy',
        'Often diagnosed in youth',
        'Strong genetic component'
      ],
      symptoms: [
        'Rapid weight loss',
        'Extreme fatigue',
        'Frequent urination',
        'Excessive thirst',
        'Diabetic ketoacidosis (DKA)'
      ],
      treatment: [
        'Insulin injections (multiple daily)',
        'Continuous glucose monitoring',
        'Carbohydrate counting',
        'Regular blood sugar testing',
        'Lifestyle management'
      ]
    },
    {
      id: 'type2',
      title: 'Type 2 Diabetes',
      icon: Users,
      prevalence: '90-95%',
      onset: 'Usually adulthood (>45 years)',
      cause: 'Insulin resistance + beta cell dysfunction',
      color: 'blue',
      characteristics: [
        'Progressive insulin resistance',
        'Gradual onset of symptoms',
        'Often associated with obesity',
        'Strong lifestyle component',
        'May be reversible with intervention'
      ],
      symptoms: [
        'Gradual weight gain or loss',
        'Increased hunger',
        'Blurred vision',
        'Slow-healing wounds',
        'Frequent infections'
      ],
      treatment: [
        'Lifestyle modifications (diet, exercise)',
        'Oral medications (metformin, etc.)',
        'Injectable medications (GLP-1, insulin)',
        'Blood glucose monitoring',
        'Weight management'
      ]
    },
    {
      id: 'gestational',
      title: 'Gestational Diabetes',
      icon: Baby,
      prevalence: '2-10% of pregnancies',
      onset: 'During pregnancy (24-28 weeks)',
      cause: 'Pregnancy hormones cause insulin resistance',
      color: 'pink',
      characteristics: [
        'Develops during pregnancy',
        'Usually resolves after delivery',
        'Increases future T2D risk',
        'Affects baby\'s health',
        'Requires careful monitoring'
      ],
      symptoms: [
        'Often asymptomatic',
        'Excessive thirst',
        'Frequent urination',
        'Fatigue',
        'Detected through screening'
      ],
      treatment: [
        'Dietary modifications',
        'Regular physical activity',
        'Blood glucose monitoring',
        'Insulin if needed',
        'Fetal monitoring'
      ]
    },
    {
      id: 'mody',
      title: 'MODY (Maturity-Onset Diabetes of the Young)',
      icon: Target,
      prevalence: '1-2%',
      onset: 'Usually before age 25',
      cause: 'Single gene mutations',
      color: 'purple',
      characteristics: [
        'Monogenic diabetes',
        'Strong family history',
        'Early onset',
        'Often misdiagnosed',
        'Several subtypes exist'
      ],
      symptoms: [
        'Mild hyperglycemia',
        'Often asymptomatic initially',
        'Family history pattern',
        'Normal weight typically',
        'Gradual progression'
      ],
      treatment: [
        'Depends on specific type',
        'May not require medication initially',
        'Sulfonylureas often effective',
        'Lifestyle modifications',
        'Genetic counseling'
      ]
    }
  ];

  const secondaryTypes = [
    {
      title: 'Drug-Induced Diabetes',
      description: 'Caused by medications like corticosteroids, thiazides, or antipsychotics',
      icon: AlertCircle
    },
    {
      title: 'Pancreatic Diabetes',
      description: 'Results from pancreatic diseases, surgery, or trauma affecting insulin production',
      icon: Activity
    },
    {
      title: 'Endocrine Diabetes',
      description: 'Associated with hormonal disorders like Cushing\'s syndrome or hyperthyroidism',
      icon: Heart
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'bg-red-100 text-red-600',
        accent: 'bg-red-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'bg-blue-100 text-blue-600',
        accent: 'bg-blue-600'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-800',
        icon: 'bg-pink-100 text-pink-600',
        accent: 'bg-pink-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        icon: 'bg-purple-100 text-purple-600',
        accent: 'bg-purple-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <img 
          src="/images/ophthalmologist-consultation.jpg" 
          alt="Diabetic retinopathy in different types of diabetes"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Types of Diabetes</h1>
            <p className="text-xl text-purple-100 leading-relaxed mb-6">
              Diabetes is not a single disease but a group of metabolic disorders with different causes, 
              characteristics, and treatment approaches. Understanding these differences is crucial for 
              proper diagnosis and management.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">4 Main Types</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">Different Treatments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Overview */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prevalence</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Typical Onset</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Primary Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {diabetesTypes.map((type, index) => {
                  const colors = getColorClasses(type.color);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${colors.icon}`}>
                            <type.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-gray-900">{type.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{type.prevalence}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{type.onset}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{type.cause}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <img 
            src="/images/retinal-examination-1.jpg" 
            alt="Type 1 diabetes retinopathy screening"
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
          <img 
            src="/images/retinal-screening-1.jpg" 
            alt="Type 2 diabetes retinal examination"
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
          <img 
            src="/images/ophthalmologist-consultation.jpg" 
            alt="Gestational diabetes eye care"
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
          <img 
            src="/images/retinal-examination-1.jpg" 
            alt="MODY diabetes retinal monitoring"
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Detailed Type Information */}
      <div className="space-y-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Detailed Information</h2>
        
        {diabetesTypes.map((type, index) => {
          const colors = getColorClasses(type.color);
          const Icon = type.icon;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className={`p-6 ${colors.bg} border-b ${colors.border}`}>
                <div className="h-1 bg-gradient-to-r from-gray-400 to-gray-600 mb-4 rounded"></div>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${colors.icon}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{type.title}</h3>
                    <p className={`text-sm ${colors.text} mt-1`}>
                      {type.prevalence} of all diabetes cases • {type.onset}
                    </p>
                  </div>
                </div>
              </div>
              
              {index === 0 && (
                <div className="px-6 pt-4">
                  <img 
                    src="/images/retinal-screening-1.jpg" 
                    alt="Type 1 diabetes retinopathy management"
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {index === 1 && (
                <div className="px-6 pt-4">
                  <img 
                    src="/images/retinal-examination-1.jpg" 
                    alt="Type 2 diabetes retinal screening"
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Characteristics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-gray-600" />
                      Key Characteristics
                    </h4>
                    <ul className="space-y-2">
                      {type.characteristics.map((char, charIndex) => (
                        <li key={charIndex} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${colors.accent}`}></div>
                          <span className="text-sm text-gray-700">{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-gray-600" />
                      Common Symptoms
                    </h4>
                    <ul className="space-y-2">
                      {type.symptoms.map((symptom, symptomIndex) => (
                        <li key={symptomIndex} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${colors.accent}`}></div>
                          <span className="text-sm text-gray-700">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-gray-600" />
                      Treatment Approach
                    </h4>
                    <ul className="space-y-2">
                      {type.treatment.map((treatment, treatmentIndex) => (
                        <li key={treatmentIndex} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${colors.accent}`}></div>
                          <span className="text-sm text-gray-700">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Types */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Secondary Types of Diabetes</h2>
        <p className="text-gray-600 mb-6">
          These less common forms of diabetes are caused by other medical conditions or external factors.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-gray-400 to-gray-500"></div>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{type.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Criteria */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="mr-3 h-6 w-6 text-blue-600" />
            Diagnostic Criteria
          </h2>
          <p className="text-gray-600 mt-2">Standard tests used to diagnose different types of diabetes</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Blood Glucose Tests</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Fasting Plasma Glucose</span>
                  <span className="text-sm text-gray-900">≥126 mg/dL</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Random Plasma Glucose</span>
                  <span className="text-sm text-gray-900">≥200 mg/dL</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">2-hour OGTT</span>
                  <span className="text-sm text-gray-900">≥200 mg/dL</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Additional Tests</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HbA1c</span>
                  <span className="text-sm text-gray-900">≥6.5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">C-peptide</span>
                  <span className="text-sm text-gray-900">Low in T1D</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Autoantibodies</span>
                  <span className="text-sm text-gray-900">Present in T1D</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Diagnosis should always be confirmed with repeat testing and 
              interpreted by qualified healthcare professionals. Different criteria may apply for 
              gestational diabetes and special populations.
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50">
          <img 
            src="/images/ophthalmologist-consultation.jpg" 
            alt="Diabetic retinopathy diagnostic procedures"
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default DiabetesTypes;