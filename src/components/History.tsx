import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { db, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ReflectionEntry } from '../types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Loader2, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const History: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'reflections'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ReflectionEntry[];
        setEntries(data);
      } catch (err) {
        handleFirestoreError(err, 'list', 'reflections');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 min-h-screen">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-600 animate-pulse">טוען את היסטוריית הרפלקציות שלך...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
          <h2 className="text-xl font-bold text-slate-800 mb-2">אין עדיין רפלקציות</h2>
          <p className="text-slate-500 mb-6">לאחר שתכתוב את הרפלקציה הראשונה שלך, תוכל למצוא אותה כאן ולעקוב אחר ההתקדמות שלך.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="card-base sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4">היסטוריית רפלקציות</h2>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setExpandedId(entry.id || null)}
                  className={`history-item-polished rounded-lg ${
                    expandedId === entry.id ? 'bg-blue-50 border-r-4 border-brand-blue' : ''
                  }`}
                >
                  <p className={`text-sm font-bold truncate ${expandedId === entry.id ? 'text-brand-blue' : 'text-slate-700'}`}>
                    {entry.originalText}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {entry.createdAt ? format(entry.createdAt.toDate(), 'HH:mm, d בMMMM', { locale: he }) : ''}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center">
               <div className="bg-blue-50 p-3 rounded-full mb-3 text-brand-blue">
                 <Calendar size={24} />
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">סך הכל</p>
               <p className="text-3xl font-bold text-slate-800">{entries.length}</p>
               <p className="text-xs text-slate-500">רפלקציות</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {expandedId ? (
              <motion.div
                key={expandedId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {entries.filter(e => e.id === expandedId).map(entry => (
                  <div key={entry.id} className="space-y-6">
                    <div className="card-base">
                       <h3 className="text-md font-bold text-slate-500 mb-3">תוכן הרפלקציה</h3>
                       <p className="text-lg text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-xl italic">
                         "{entry.originalText}"
                       </p>
                    </div>

                    <div className="card-base flex flex-col gap-8">
                      <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">ניתוח מקצועי</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <section className="space-y-4">
                            <div><span className="badge-base badge-strengths">נקודות חוזק</span></div>
                            <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                              {entry.analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                         </section>
                         <section className="space-y-4">
                            <div><span className="badge-base badge-challenges">אתגרים</span></div>
                            <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                              {entry.analysis.challenges.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                         </section>
                         <section className="space-y-4">
                            <div><span className="badge-base badge-suggestions">הצעות לשיפור</span></div>
                            <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                              {entry.analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                         </section>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                <div>
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">בחר רפלקציה מהרשימה כדי לצפות בניתוח המלא</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
