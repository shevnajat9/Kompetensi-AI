
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start mb-6">
        <div className="bg-blue-600 p-2.5 rounded-2xl mr-4 text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{recommendation.title}</h4>
          <p className="text-slate-500 text-sm leading-relaxed">{recommendation.description}</p>
        </div>
      </div>
      
      <div className="mt-auto bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <div className="flex items-center mb-4 text-slate-800">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h5 className="text-xs font-bold uppercase tracking-widest">Rencana Pengembangan</h5>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Langkah Strategis</span>
            <ul className="space-y-2">
              {recommendation.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-700 leading-snug">
                  <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {recommendation.resources && recommendation.resources.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Sumber Daya Terpilih</span>
              <div className="flex flex-wrap gap-2">
                {recommendation.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url || '#'}
                    target={res.url ? "_blank" : "_self"}
                    className="text-[11px] font-medium bg-white hover:bg-blue-600 hover:text-white text-blue-600 px-3 py-1.5 rounded-xl border border-slate-200 transition-all shadow-sm flex items-center group"
                  >
                    {res.name}
                    {res.url && (
                      <svg className="w-3 h-3 ml-1.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
