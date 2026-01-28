
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface RecommendationQuizProps {
  quiz: QuizQuestion[];
  onClose: () => void;
}

export const RecommendationQuiz: React.FC<RecommendationQuizProps> = ({ quiz, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = quiz[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
  };

  const handleConfirm = () => {
    if (selectedIdx === null) return;
    setIsAnswered(true);
    if (selectedIdx === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
    }
  };

  if (showSummary) {
    return (
      <div className="bg-white rounded-[32px] p-10 text-center shadow-2xl border border-blue-50 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Kuis Selesai!</h3>
        <p className="text-slate-500 mb-8">Anda menjawab <span className="font-bold text-blue-600">{score} dari {quiz.length}</span> pertanyaan dengan benar.</p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
        >
          Kembali ke Hasil
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] shadow-2xl border border-blue-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-1 px-8 pt-8 flex justify-between items-center mb-6">
        <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Cek Pemahaman Strategis</span>
        <span className="text-xs font-bold text-slate-300">Pertanyaan {currentIdx + 1} / {quiz.length}</span>
      </div>

      <div className="px-8 pb-10">
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-10">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${((currentIdx + 1) / quiz.length) * 100}%` }}
          />
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = "border-slate-100 bg-slate-50/50 text-slate-600";
            if (selectedIdx === idx) stateClass = "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20";
            
            if (isAnswered) {
              if (idx === currentQuestion.correctAnswerIndex) stateClass = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20";
              else if (selectedIdx === idx) stateClass = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20";
              else stateClass = "border-slate-100 bg-slate-50 text-slate-300";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full p-5 text-left rounded-2xl border-2 font-medium transition-all flex items-center justify-between group ${stateClass}`}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                   <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                )}
                {!isAnswered && <div className={`w-5 h-5 rounded-full border-2 ${selectedIdx === idx ? 'border-blue-500 bg-blue-500' : 'border-slate-200'} transition-all`} />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mb-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-bold text-blue-800 mb-1">Mengapa demikian?</p>
            <p className="text-xs text-blue-600 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
            <button 
              onClick={onClose}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
                Batal
            </button>
            {!isAnswered ? (
              <button
                onClick={handleConfirm}
                disabled={selectedIdx === null}
                className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-30"
              >
                Konfirmasi
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
              >
                {currentIdx < quiz.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesai'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
