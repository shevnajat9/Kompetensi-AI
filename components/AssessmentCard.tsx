
import React from 'react';
import { Question } from '../types';

interface AssessmentCardProps {
  question: Question;
  currentIndex: number;
  total: number;
  onNext: (answer: string) => void;
  currentValue: string;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ 
  question, 
  currentIndex, 
  total, 
  onNext, 
  currentValue 
}) => {
  const [text, setText] = React.useState(currentValue);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full mx-auto border border-slate-100 transition-all">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{question.domain}</span>
        <span className="text-sm font-medium text-slate-400">Pertanyaan {currentIndex + 1} dari {total}</span>
      </div>
      
      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-700 ease-out" 
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-500 mb-2">Jawaban Anda (Esai/Studi Kasus):</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tuliskan jawaban atau pendekatan Anda di sini..."
          className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 leading-relaxed"
        />
        
        <div className="flex justify-end pt-4">
          <button
            onClick={() => onNext(text)}
            disabled={!text.trim()}
            className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all active:scale-95"
          >
            {currentIndex === total - 1 ? 'Selesai & Lihat Hasil' : 'Pertanyaan Selanjutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};
