import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveAssessment, availableAssessments } = useAppContext();
  
  const assessmentData = availableAssessments.find(a => a.id === id);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of CSS Flexbox?",
      options: [
        "To add colors to elements",
        "To lay out items in a one-dimensional space",
        "To manage database queries",
        "To animate SVG elements"
      ]
    },
    {
      id: 2,
      question: "Which of the following is not a valid CSS position property?",
      options: [
        "static",
        "absolute",
        "floating",
        "sticky"
      ]
    }
  ];

  const handleSelectOption = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Mock detailed assessment data
      const score = Math.floor(Math.random() * 40) + 60; // Mock score between 60-100
      
      const breakdown = [
        { topic: 'React Basics', score: Math.floor(Math.random() * 20) + 80 },
        { topic: 'State Management', score: Math.floor(Math.random() * 30) + 60 },
        { topic: 'Hooks', score: Math.floor(Math.random() * 20) + 75 },
        { topic: 'Routing', score: 100 }
      ];

      const assessmentResult = {
        assessmentId: id,
        title: assessmentData?.title || 'Assessment',
        score,
        date: new Date().toISOString(),
        breakdown,
        recommendation: "Based on your score, you should focus on State Management."
      };

      const attemptId = saveAssessment(assessmentResult);
      navigate(`/assessments/result/${attemptId}`);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-800">{assessmentData?.title || 'Skill Assessment'}</h2>
          <span className="text-ocean-600 font-medium bg-ocean-50 px-4 py-1.5 rounded-full">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-ocean-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQuestion] === index 
                    ? 'border-ocean-500 bg-ocean-50 text-ocean-700' 
                    : 'border-slate-100 hover:border-ocean-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index ? 'border-ocean-500' : 'border-slate-300'
                  }`}>
                    {answers[currentQuestion] === index && <div className="w-3 h-3 bg-ocean-500 rounded-full"></div>}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button 
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="px-8 py-3 bg-ocean-600 text-white rounded-xl font-medium hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ocean-500/20"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
