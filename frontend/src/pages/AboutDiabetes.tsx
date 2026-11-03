import React from 'react';
import { Heart, Brain, Eye, FileKey as Kidney, Activity, AlertCircle } from 'lucide-react';

const AboutDiabetes = () => {
  const complications = [
    {
      icon: Eye,
      title: 'Diabetic Retinopathy',
      description: 'Damage to blood vessels in the retina, leading to vision problems and potential blindness.',
      severity: 'high'
    },
    {
      icon: Heart,
      title: 'Cardiovascular Disease',
      description: 'Increased risk of heart attack, stroke, and other heart-related complications.',
      severity: 'high'
    },
    {
      icon: Kidney,
      title: 'Diabetic Nephropathy',
      description: 'Kidney damage that can progress to kidney failure requiring dialysis or transplant.',
      severity: 'high'
    },
    {
      icon: Brain,
      title: 'Neuropathy',
      description: 'Nerve damage causing pain, tingling, and loss of sensation, especially in extremities.',
      severity: 'medium'
    }
  ];

  const statistics = [
    { number: '537M', label: 'Adults with diabetes worldwide', color: 'text-blue-600' },
    { number: '6.7M', label: 'Deaths attributed to diabetes annually', color: 'text-red-600' },
    { number: '1 in 10', label: 'Adults have diabetes globally', color: 'text-orange-600' },
    { number: '90%', label: 'Have Type 2 diabetes', color: 'text-green-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <img 
          src="/images/understanding.jpg" 
          alt="Diabetic retinopathy fundus examination and research"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Understanding Diabetes</h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-6">
              Diabetes is a chronic metabolic disorder characterized by elevated blood glucose levels. 
              It occurs when the body cannot effectively produce or use insulin, a hormone that regulates blood sugar.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">537M+ affected worldwide</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">Leading cause of blindness</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* What is Diabetes */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-500"></div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Activity className="mr-3 h-6 w-6 text-blue-600" />
                What is Diabetes?
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Diabetes mellitus is a group of metabolic disorders characterized by chronic hyperglycemia 
                (high blood sugar levels) resulting from defects in insulin secretion, insulin action, or both.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Insulin is a hormone produced by the pancreas that allows cells to absorb glucose from the 
                bloodstream for energy. When this process is impaired, glucose accumulates in the blood, 
                leading to various health complications.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Normal vs. Diabetic Blood Sugar Levels</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Normal (fasting):</span>
                    <span className="font-medium text-blue-900">70-99 mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Prediabetes (fasting):</span>
                    <span className="font-medium text-blue-900">100-125 mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Diabetes (fasting):</span>
                    <span className="font-medium text-blue-900">≥126 mg/dL</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50">
              <img 
                src="/images/understanding diabetic-retinopathy.jpg" 
                alt="Diabetic retinopathy screening and monitoring"
                className="w-full h-50 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* How Diabetes Develops */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">How Diabetes Develops</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Normal Function</h3>
                    <p className="text-gray-700">
                      Pancreatic beta cells produce insulin in response to rising blood glucose levels after meals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Insulin Resistance</h3>
                    <p className="text-gray-700">
                      Cells become less responsive to insulin, requiring more insulin to achieve the same effect.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Beta Cell Dysfunction</h3>
                    <p className="text-gray-700">
                      Pancreatic beta cells become exhausted and cannot produce sufficient insulin.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hyperglycemia</h3>
                    <p className="text-gray-700">
                      Blood glucose levels remain persistently elevated, leading to diabetes diagnosis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <img 
                src="/images/image2.webp" 
                alt="Ophthalmologist examining patient for diabetic retinopathy"
                className="w-full h-42 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Risk Factors</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-red-600">Non-Modifiable Risk Factors</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      Age (≥45 years)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      Family history of diabetes
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      Ethnicity (African American, Hispanic, Native American, Asian)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      History of gestational diabetes
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-blue-600">Modifiable Risk Factors</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Obesity (BMI ≥30)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Physical inactivity
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Poor diet (high in processed foods, sugar)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      High blood pressure
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Smoking
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/images/images4.png" 
                  alt="Diabetic retinopathy prevention through monitoring"
                  className="w-full h-35 object-cover opacity-70 rounded-lg shadow-md"
                />
                <img 
                  src="/images/images33.png" 
                  alt="Retinal screening for diabetic complications"
                  className="w-full h-35 object-cover opacity-70 rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Complications */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
            <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                Major Complications
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {complications.map((complication, index) => {
                const Icon = complication.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        complication.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          complication.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {complication.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {complication.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-6 bg-amber-50 border-t border-amber-200">
              <p className="text-xs text-amber-800">
                <strong>Important:</strong> Early detection and proper management can prevent or delay 
                most diabetes complications. Regular monitoring and medical care are essential.
              </p>
            </div>
            
            <div className="p-4">
              <img 
                src="/images/understanding diabetic-retinopathy.jpg" 
                alt="Diabetic complications awareness"
                className="w-full h-32 object-cover opacity-70 rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutDiabetes;