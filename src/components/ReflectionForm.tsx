import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { db, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeReflection, ReflectionAnalysis } from '../lib/gemini';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReflectionForm: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReflectionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim() || !user) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeReflection(text);
      
      // Save to Firestore
      try {
        await addDoc(collection(db, 'reflections'), {
          userId: user.uid,
          originalText: text,
          analysis: result,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, 'create', 'reflections');
      }

      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError('חלה שגיאה בניתוח הרפלקציה. אנא נסה שוב.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base mb-8"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-1">תיעוד שיעור חדש</h2>
          <p className="text-sm text-slate-500">תאר בקצרה מה קרה בשיעור, איך הרגשת ומה עבד טוב לדעתך.</p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="איך עבר השיעור היום? אילו רגעים היו מוצלחים ומה היה מאתגר? לדוגמה: היום העברתי שיעור על מערכת העיכול..."
          className="w-full h-40 p-4 border border-border-subtle rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all resize-none mb-6 text-base leading-relaxed bg-slate-50/50"
          disabled={isAnalyzing}
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="btn-primary-polished"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>מנתח בעזרת Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>נתח רפלקציה בעזרת Gemini</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="card-base flex flex-col gap-6 md:col-start-1">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">ניתוח AI לשיעור</h3>
              
              <div className="space-y-6 overflow-y-auto">
                <section>
                  <div className="mb-2">
                    <span className="badge-base badge-strengths">3 נקודות חוזק</span>
                  </div>
                  <ul className="text-sm text-slate-700 list-disc list-inside space-y-1.5 leading-relaxed">
                    {analysis.strengths.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <div className="mb-2">
                    <span className="badge-base badge-challenges">2 אתגרים</span>
                  </div>
                  <ul className="text-sm text-slate-700 list-disc list-inside space-y-1.5 leading-relaxed">
                    {analysis.challenges.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <div className="mb-2">
                    <span className="badge-base badge-suggestions">3 הצעות לשיפור</span>
                  </div>
                  <ul className="text-sm text-slate-700 list-disc list-inside space-y-1.5 leading-relaxed">
                    {analysis.suggestions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 flex flex-col justify-center items-center text-center border border-border-subtle shadow-xs h-fit sticky top-24">
              <div className="bg-blue-50 p-4 rounded-full mb-4 text-brand-blue">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ניתוח הושלם!</p>
              <h4 className="text-2xl font-bold text-slate-800 mb-6">הרפלקציה נשמרה</h4>
              <button 
                onClick={() => {
                  setText('');
                  setAnalysis(null);
                }}
                className="text-brand-blue hover:underline font-semibold"
              >
                כתיבת רפלקציה נוספת
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
