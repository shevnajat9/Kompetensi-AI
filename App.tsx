
import React, { useState, useRef } from 'react';
import { UserContext, Question, AIAnalysis, CompetencyDomain, QuizQuestion, AssessmentResult } from './types';
import { AssessmentCard } from './components/AssessmentCard';
import { RecommendationCard } from './components/RecommendationCard';
import { CareerCoach } from './components/CareerCoach';
import { RecommendationQuiz } from './components/RecommendationQuiz';
import { ResultChart } from './components/ResultChart';
import { generateCustomQuestions, evaluateAssessment, generateQuizFromRecommendations } from './services/geminiService';

type Step = 'menu' | 'generating' | 'test' | 'analyzing' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('menu');
  const [context, setContext] = useState<UserContext>({ name: '', role: '', level: '', organization: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const resetApp = () => {
    setStep('menu');
    setContext({ name: '', role: '', level: '', organization: '' });
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setAnalysis(null);
    setError(null);
    setIsQuizOpen(false);
    setQuizData([]);
  };

  const handleContextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('generating');
    try {
      const generated = await generateCustomQuestions(context);
      setQuestions(generated);
      setStep('test');
    } catch (err) {
      setError("Gagal menghasilkan soal. Silakan coba lagi.");
      setStep('menu');
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    const newAnswers = { ...answers, [questions[currentIndex].id]: answer };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('analyzing');
      try {
        const finalAnalysis = await evaluateAssessment(context, questions, newAnswers);
        setAnalysis(finalAnalysis);
        setStep('results');
      } catch (err) {
        setError("Gagal menganalisis jawaban. Silakan coba lagi.");
        setStep('results');
      }
    }
  };

  const handleStartQuiz = async () => {
    if (!analysis) return;
    setIsQuizLoading(true);
    try {
      const quiz = await generateQuizFromRecommendations(analysis.recommendations);
      setQuizData(quiz);
      setIsQuizOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Gagal memuat kuis. Silakan coba lagi.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!resultsRef.current) return;
    setIsExporting(true);
    setTimeout(() => {
      const element = resultsRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Laporan_Asesmen_${context.name?.replace(/\s+/g, '_') || 'User'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsExporting(false);
      });
    }, 500);
  };

  const getChartData = (): AssessmentResult[] => {
    if (!analysis) return [];
    
    // Inisialisasi summary dengan semua 5 domain agar sumbu selalu ada
    const summary: Record<string, { total: number, count: number }> = {};
    Object.values(CompetencyDomain).forEach(domain => {
      summary[domain] = { total: 0, count: 0 };
    });

    analysis.detailedPoints.forEach(p => {
      // Pastikan subType AI sesuai dengan domain yang diharapkan
      if (summary[p.subType]) {
        summary[p.subType].total += p.score;
        summary[p.subType].count += 1;
      }
    });

    // Urutan domain tetap sesuai CompetencyDomain
    return Object.values(CompetencyDomain).map(domain => {
      const data = summary[domain];
      const avgScore = data.count > 0 ? (data.total / (data.count * 10)) * 5 : 1; // Default minimum 1 jika tidak ada data
      return {
        domain,
        score: Math.round(avgScore * 10) / 10
      };
    });
  };

  if (step === 'menu') {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <header className="p-6 max-w-7xl mx-auto flex justify-between items-center">
           <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="font-bold text-2xl tracking-tight">CompetencyAI</span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
                  Ukur Potensi Anda dengan <span className="text-blue-600">AI Strategis.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                  Platform asesmen profesional yang mendiagnosis kompetensi teknis dan soft-skill secara akurat menggunakan teknologi Gemini 3 Pro.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">20+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Kategori Nilai</div>
                </div>
                <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">PDF</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Laporan Siap</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 rounded-[32px]">
              <div className="p-8 sm:p-10">
                <p className="text-slate-400 text-sm mb-10">Lengkapi data berikut untuk memulai sesi tes Anda.</p>
                
                <form onSubmit={handleContextSubmit} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Nama Lengkap</label>
                    <input 
                      required
                      className="w-full p-5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all placeholder:text-slate-300 text-slate-700"
                      placeholder="Masukkan Nama Lengkap"
                      value={context.name}
                      onChange={e => setContext({...context, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Jabatan / Peran</label>
                      <input 
                        required
                        className="w-full p-5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all placeholder:text-slate-300 text-slate-700"
                        placeholder="Masukkan Jabatan"
                        value={context.role}
                        onChange={e => setContext({...context, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Level Pengalaman</label>
                      <div className="relative">
                        <select 
                          required
                          className="w-full p-5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all appearance-none cursor-pointer text-slate-700"
                          value={context.level}
                          onChange={e => setContext({...context, level: e.target.value})}
                        >
                          <option value="">Pilih Level</option>
                          <option value="Entry/Junior">Entry / Junior</option>
                          <option value="Middle">Professional</option>
                          <option value="Senior">Senior</option>
                          <option value="Lead/Managerial">Lead / Manager</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Instansi / Organisasi</label>
                    <input 
                      required
                      className="w-full p-5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all placeholder:text-slate-300 text-slate-700"
                      placeholder="Masukkan Instansi"
                      value={context.organization}
                      onChange={e => setContext({...context, organization: e.target.value})}
                    />
                  </div>

                  <div className="pt-4">
                    <button className="w-full py-5 bg-[#2563EB] text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 text-lg hover:bg-blue-700 transition-all active:scale-[0.98]">
                      Mulai Asesmen AI Sekarang
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'generating' || step === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {step === 'generating' ? 'Menyusun Skenario...' : 'Mengevaluasi Jawaban...'}
        </h2>
        <p className="text-slate-400 text-center max-w-xs">Menggunakan penalaran tingkat tinggi Gemini untuk profil Anda.</p>
      </div>
    );
  }

  if (step === 'results' && analysis) {
    const today = new Date().toLocaleDateString('id-ID');
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const chartData = getChartData();

    return (
      <div className="min-h-screen bg-slate-50 pb-20 relative">
        {isQuizOpen && quizData.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="max-w-2xl w-full">
              <RecommendationQuiz quiz={quizData} onClose={() => setIsQuizOpen(false)} />
            </div>
          </div>
        )}

        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-xl text-blue-600">CompetencyAI</span>
          <div className="flex space-x-4">
            <button onClick={handleExportPDF} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl flex items-center space-x-2 text-sm shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>{isExporting ? 'Exporting...' : 'Unduh PDF'}</span>
            </button>
            <button onClick={resetApp} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">Menu Utama</button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto mt-12 px-6">
          <div ref={resultsRef} className="bg-white p-12 shadow-2xl rounded-[40px] border border-slate-100 overflow-hidden mb-12">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Laporan Hasil Asesmen</h1>
              <p className="text-slate-400 font-medium">Analisis Kompetensi Strategis Berbasis AI</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 border-l-4 border-blue-600 pl-8 ml-4">
              <div className="space-y-4">
                <div className="flex"><span className="w-24 font-bold text-slate-500">Nama</span><span className="mr-2">:</span><span className="font-bold text-slate-800">{context.name}</span></div>
                <div className="flex"><span className="w-24 font-bold text-slate-500">Jabatan</span><span className="mr-2">:</span><span className="font-bold text-slate-800">{context.role}</span></div>
              </div>
              <div className="space-y-4">
                <div className="flex"><span className="w-24 font-bold text-slate-500">Tanggal</span><span className="mr-2">:</span><span className="font-bold text-slate-800">{today}</span></div>
                <div className="flex"><span className="w-24 font-bold text-slate-500">Waktu</span><span className="mr-2">:</span><span className="font-bold text-slate-800">{time} WIB</span></div>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-3xl p-10 border border-slate-100 text-center mb-16">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Skor Asesmen</span>
              <div className="text-7xl font-black text-slate-900 mb-4">{analysis.totalScore}</div>
              <div className="inline-block px-6 py-2 bg-amber-100 text-amber-800 rounded-full font-bold text-sm uppercase tracking-wider">{analysis.status}</div>
            </div>

            <section className="mb-20">
              <h3 className="text-xl font-bold mb-8 border-b border-slate-100 pb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                Visualisasi Profil Kompetensi
              </h3>
              <ResultChart results={chartData} isExporting={isExporting} />
            </section>

            <section className="mb-20">
              <h3 className="text-xl font-bold mb-8 border-b border-slate-100 pb-4">Detail Nilai Per Indikator</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-4 font-bold text-slate-500 text-sm">No</th>
                      <th className="py-4 font-bold text-slate-500 text-sm">Indikator Kompetensi</th>
                      <th className="py-4 font-bold text-slate-500 text-sm">Skor</th>
                      <th className="py-4 font-bold text-slate-500 text-sm">Umpan Balik AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.detailedPoints.map((point, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 align-top text-slate-400 font-medium">{i + 1}</td>
                        <td className="py-6 pr-8 align-top">
                          <div className="font-bold text-slate-800 mb-1">{point.category}</div>
                          <div className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{point.subType}</div>
                        </td>
                        <td className="py-6 align-top font-black text-lg text-slate-800">{point.score}</td>
                        <td className="py-6 text-sm text-slate-600 leading-relaxed italic">{point.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-blue-50/30 rounded-[40px] p-10 border border-blue-100 mb-10">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Rencana Pengembangan Pribadi (IDP)</h3>
              <p className="text-slate-700 leading-relaxed mb-10 text-lg">{analysis.overallSummary}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {analysis.recommendations.map((rec, i) => (
                  <RecommendationCard key={i} recommendation={rec} />
                ))}
              </div>
              
              <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-md text-center md:text-left">
                    <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/30">
                      Mastery Check
                    </div>
                    <h4 className="text-2xl font-bold mb-3">Tantangan Pemahaman Strategis</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Uji sejauh mana Anda memahami langkah-langkah pengembangan yang telah kami susun khusus untuk Anda. Selesaikan kuis untuk mendapatkan label "Strategist".
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleStartQuiz}
                    disabled={isQuizLoading}
                    className="group relative flex items-center justify-center px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 overflow-hidden active:scale-95 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {isQuizLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                         <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                         <span>MULAI TANTANGAN</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
          
          <div className="mt-12">
             <CareerCoach />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
       {questions.length > 0 && (
         <AssessmentCard
           key={currentIndex}
           question={questions[currentIndex]}
           currentIndex={currentIndex}
           total={questions.length}
           onNext={handleAnswerSubmit}
           currentValue={answers[questions[currentIndex].id] || ''}
         />
       )}
    </div>
  );
};

export default App;
