
import { CompetencyDomain, Question } from './types';

export const QUESTIONS: Question[] = [
  // Kemampuan Teknis
  { id: 1, domain: CompetencyDomain.TECHNICAL, text: "Seberapa percaya diri Anda dalam mempelajari dan menerapkan perangkat lunak atau alat baru yang relevan dengan bidang Anda?" },
  { id: 2, domain: CompetencyDomain.TECHNICAL, text: "Apakah Anda memiliki pendekatan sistematis dalam mendokumentasikan alur kerja teknis Anda?" },
  { id: 3, domain: CompetencyDomain.TECHNICAL, text: "Seberapa sering Anda memperbarui pengetahuan teknis Anda melalui kursus, literatur, atau eksperimen mandiri?" },
  { id: 4, domain: CompetencyDomain.TECHNICAL, text: "Seberapa efektif Anda dalam mengoptimalkan penggunaan alat kerja untuk meningkatkan produktivitas?" },
  { id: 5, domain: CompetencyDomain.TECHNICAL, text: "Seberapa mahir Anda dalam mengidentifikasi batasan teknis dari sebuah solusi yang diusulkan?" },
  
  // Komunikasi
  { id: 6, domain: CompetencyDomain.COMMUNICATION, text: "Seberapa efektif Anda dalam menjelaskan konsep rumit kepada pemangku kepentingan non-teknis?" },
  { id: 7, domain: CompetencyDomain.COMMUNICATION, text: "Seberapa nyaman Anda dalam memfasilitasi diskusi kelompok atau pertemuan tim?" },
  { id: 8, domain: CompetencyDomain.COMMUNICATION, text: "Seberapa baik Anda dalam mendengarkan secara aktif sebelum memberikan tanggapan atau solusi?" },
  { id: 9, domain: CompetencyDomain.COMMUNICATION, text: "Seberapa mampu Anda dalam menyampaikan umpan balik yang membangun tanpa menyinggung perasaan rekan kerja?" },
  { id: 10, domain: CompetencyDomain.COMMUNICATION, text: "Seberapa mahir Anda dalam menyesuaikan gaya komunikasi Anda berdasarkan audiens yang berbeda?" },
  
  // Kepemimpinan & Strategi
  { id: 11, domain: CompetencyDomain.LEADERSHIP, text: "Apakah Anda mengambil inisiatif untuk membimbing rekan tim saat menghadapi hambatan?" },
  { id: 12, domain: CompetencyDomain.LEADERSHIP, text: "Seberapa baik Anda dapat menyelaraskan tugas pribadi dengan tujuan jangka panjang organisasi?" },
  { id: 13, domain: CompetencyDomain.LEADERSHIP, text: "Seberapa sering Anda mendelegasikan tugas secara efektif berdasarkan kekuatan individu anggota tim?" },
  { id: 14, domain: CompetencyDomain.LEADERSHIP, text: "Seberapa mampu Anda dalam memotivasi orang lain untuk mencapai target yang menantang?" },
  { id: 15, domain: CompetencyDomain.LEADERSHIP, text: "Seberapa berani Anda dalam mengambil keputusan sulit meskipun data yang tersedia belum lengkap?" },
  
  // Berpikir Analitis
  { id: 16, domain: CompetencyDomain.PROBLEM_SOLVING, text: "Saat menghadapi masalah yang tidak dikenal, seberapa sistematis proses pencarian solusi Anda?" },
  { id: 17, domain: CompetencyDomain.PROBLEM_SOLVING, text: "Seberapa sering Anda mencari akar masalah daripada hanya memperbaiki gejala yang terlihat?" },
  { id: 18, domain: CompetencyDomain.PROBLEM_SOLVING, text: "Seberapa mahir Anda dalam menggunakan data untuk mendukung argumen atau keputusan Anda?" },
  { id: 19, domain: CompetencyDomain.PROBLEM_SOLVING, text: "Seberapa mampu Anda melihat pola atau tren dari informasi yang tampak acak?" },
  { id: 20, domain: CompetencyDomain.PROBLEM_SOLVING, text: "Seberapa sering Anda mengevaluasi efektivitas dari solusi yang telah Anda terapkan sebelumnya?" },
  
  // Adaptabilitas & Resiliensi
  { id: 21, domain: CompetencyDomain.ADAPTABILITY, text: "Seberapa efektif Anda dalam menjaga kinerja di bawah tekanan atau tenggat waktu yang ketat?" },
  { id: 22, domain: CompetencyDomain.ADAPTABILITY, text: "Seberapa terbuka Anda terhadap perubahan gaya kerja berdasarkan umpan balik konstruktif?" },
  { id: 23, domain: CompetencyDomain.ADAPTABILITY, text: "Seberapa cepat Anda bangkit kembali setelah mengalami kegagalan atau hambatan besar dalam pekerjaan?" },
  { id: 24, domain: CompetencyDomain.ADAPTABILITY, text: "Seberapa fleksibel Anda dalam menyesuaikan prioritas saat rencana kerja berubah tiba-tiba?" },
  { id: 25, domain: CompetencyDomain.ADAPTABILITY, text: "Seberapa baik Anda dalam menjaga kesehatan mental dan keseimbangan kerja saat beban kerja meningkat?" }
];

export const SCORING_LABELS = [
  "Sangat Tidak Yakin",
  "Kurang Yakin",
  "Cukup Yakin",
  "Sangat Yakin",
  "Sangat Ahli / Yakin"
];
