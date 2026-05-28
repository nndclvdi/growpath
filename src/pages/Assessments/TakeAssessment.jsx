import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { saveAssessment, availableAssessments } = useAppContext();

  const assessmentData = availableAssessments.find(
    (a) => String(a.id) === String(id)
  );

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

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const selectedAnswer = answers[currentQuestion];

  const handleNext = async () => {
    const isLast = currentQuestion === questions.length - 1;

    if (!isLast) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    const score = Math.floor(Math.random() * 40) + 60;

    const breakdown = [
      { topic: 'React Basics', score: 85 },
      { topic: 'State Management', score: 70 },
      { topic: 'Hooks', score: 90 },
      { topic: 'Routing', score: 95 }
    ];

    const assessmentResult = {
      assessmentId: id,
      title: assessmentData?.title || 'Assessment',
      score,
      date: new Date().toISOString(),
      breakdown,
      recommendation:
        score >= 80
          ? "Great job! Keep improving."
          : "Focus more on fundamentals."
    };

    try {
      setIsSubmitting(true);
      
      // Menggunakan Axios POST
      const response = await API.post('/assessments/submit', {
        assessment_id: id,
        score
      });

      const data = response.data;

      const finalResult = {
        ...assessmentResult,
        attemptId: data?.data?.id?.toString() || Date.now().toString()
      };

      saveAssessment(finalResult);
      navigate(`/assessments/result/${finalResult.attemptId}`);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Submit failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border">

        <div className="flex justify-between mb-6">
          <h2 className="font-bold text-xl">
            {assessmentData?.title || 'Assessment'}
          </h2>

          <span className="text-ocean-600 font-medium">
            Q {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full mb-8">
          <div
            className="h-2 bg-ocean-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h3 className="text-2xl font-semibold mb-6">
          {questions[currentQuestion].question}
        </h3>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index;

            return (
              <div
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'border-ocean-500 bg-ocean-50 text-ocean-700'
                    : 'border-slate-200 hover:border-ocean-200'
                }`}
              >
                {option}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined || isSubmitting}
            className="px-8 py-3 bg-ocean-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? 'Submitting...' 
              : currentQuestion === questions.length - 1
                ? 'Submit Assessment'
                : 'Next Question'}
          </button>
        </div>

      </div>
    </div>
  );
}