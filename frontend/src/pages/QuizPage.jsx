import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ArrowRight, RotateCcw, CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What is the minimum age to vote in Indian General Elections?",
    options: ["18 years", "21 years", "25 years", "16 years"],
    correct: 0,
    explanation: "The voting age was lowered from 21 to 18 years by the 61st Amendment Act, 1988."
  },
  {
    id: 2,
    question: "Which of the following is NOT a valid ID for voting?",
    options: ["Aadhaar Card", "PAN Card", "Ration Card (without photo)", "Passport"],
    correct: 2,
    explanation: "Ration cards without photographs are not accepted as valid identity proof for voting."
  },
  {
    id: 3,
    question: "How many Lok Sabha constituencies are there in India?",
    options: ["543", "545", "550", "530"],
    correct: 0,
    explanation: "There are 543 elected constituencies in the Lok Sabha."
  }
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState('start'); // start, quiz, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleStart = () => {
    setCurrentStep('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCurrentStep('result');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-[500px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {currentStep === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center glass p-12 rounded-3xl"
          >
            <div className="w-20 h-20 bg-saffron/10 text-saffron rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-navy-chakra mb-4">Election Genius Quiz</h1>
            <p className="text-slate-500 mb-8">Test your knowledge about Indian democracy and win the Election Maestro badge!</p>
            <button onClick={handleStart} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
              Start Quiz <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {currentStep === 'quiz' && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-saffron transition-all duration-500" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-navy-chakra mb-8">{questions[currentQuestion].question}</h2>
            
            <div className="space-y-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === questions[currentQuestion].correct;
                const showResult = selectedOption !== null;

                let stateClasses = "border-slate-100 hover:border-saffron bg-white dark:bg-slate-800";
                if (showResult) {
                  if (isCorrect) stateClasses = "border-green-election bg-green-50 dark:bg-green-900/20";
                  else if (isSelected) stateClasses = "border-red-500 bg-red-50 dark:bg-red-900/20";
                  else stateClasses = "opacity-50 border-slate-100";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={showResult}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between font-medium ${stateClasses}`}
                  >
                    <span>{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-election" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-8 border border-blue-100 dark:border-blue-800/30"
              >
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  <span className="font-bold">Did you know?</span> {questions[currentQuestion].explanation}
                </p>
                <button 
                  onClick={handleNext} 
                  className="mt-4 text-saffron font-bold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {currentStep === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass p-12 rounded-3xl w-full"
          >
            <div className="w-24 h-24 bg-yellow-400/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold text-navy-chakra mb-2">Well Done!</h1>
            <p className="text-slate-500 mb-8">You scored <span className="font-bold text-navy-chakra">{score} out of {questions.length}</span></p>
            
            <div className="flex gap-4">
              <button onClick={handleStart} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
              <button className="flex-1 btn-primary py-4">
                Share Result
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
