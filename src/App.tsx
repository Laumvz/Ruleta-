/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ExternalLink, 
  Trophy, 
  Gift, 
  ArrowRight, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Star,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TYPES ---
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

interface Task {
  id: number;
  title: string;
  reward: number;
  link: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  description: string;
}

// --- CONFIGURATION ---
const TASKS: Task[] = [
  { 
    id: 1, 
    title: 'iPhone 15 Pro Max', 
    reward: 5.00, 
    link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=71187&tracking_id=', 
    icon: <Zap className="text-cyan-400" />, 
    color: 'from-cyan-500/20 to-blue-500/20',
    category: 'Sorteo Premium',
    description: 'Completa el registro para participar en el sorteo del último iPhone.'
  },
  { 
    id: 2, 
    title: 'PayPal $100 Bonus', 
    reward: 3.00, 
    link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=70090&tracking_id=', 
    icon: <Wallet className="text-emerald-400" />, 
    color: 'from-emerald-500/20 to-teal-500/20',
    category: 'Efectivo Directo',
    description: 'Verifica tu cuenta para recibir un bono de $100 en PayPal.'
  },
  { 
    id: 3, 
    title: 'Amazon Gift Card', 
    reward: 2.00, 
    link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=70157&tracking_id=', 
    icon: <Gift className="text-orange-400" />, 
    color: 'from-orange-500/20 to-red-500/20',
    category: 'Compras Gratis',
    description: 'Obtén un vale de $200 para tus compras en Amazon.'
  },
  { 
    id: 4, 
    title: 'PlayStation 5 Hub', 
    reward: 0.32, 
    link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=71637&tracking_id=', 
    icon: <Gamepad2 className="text-indigo-400" />, 
    color: 'from-indigo-500/20 to-purple-500/20',
    category: 'Gaming',
    description: 'Regístrate en el portal de gaming para ganar una PS5.'
  },
  { 
    id: 5, 
    title: 'Tech Samples', 
    reward: 0.32, 
    link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=56777&tracking_id=', 
    icon: <TrendingUp className="text-pink-400" />, 
    color: 'from-pink-500/20 to-rose-500/20',
    category: 'Gadgets',
    description: 'Recibe muestras gratis de los mejores gadgets del año.'
  },
];

const WITHDRAWAL_GOAL = 25;

export default function App() {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('reward_balance');
    return saved ? parseFloat(saved) : 0;
  });
  const [completedTasks, setCompletedTasks] = useState<number[]>(() => {
    const saved = localStorage.getItem('completed_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [telegramUser, setTelegramUser] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);

  // Telegram Integration
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0F172A');
      if (tg.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user.first_name);
      }
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('reward_balance', balance.toString());
    localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
  }, [balance, completedTasks]);

  const handleTaskClick = (task: Task) => {
    if (!completedTasks.includes(task.id)) {
      // We simulate completion when they click, encouraging them to actually do it
      // In a real CPA app, you'd wait for a postback, but for CTR we reward the click/intent
      setBalance(prev => prev + task.reward);
      setCompletedTasks(prev => [...prev, task.id]);
      
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#3B82F6']
      });
    }
    window.open(task.link, '_blank');
  };

  const claimDailyBonus = () => {
    if (!dailyBonusClaimed) {
      const bonus = 0.50;
      setBalance(prev => prev + bonus);
      setDailyBonusClaimed(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const progress = Math.min((balance / WITHDRAWAL_GOAL) * 100, 100);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 pb-24 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header / Top Bar */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Trophy className="text-[#020617] w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none">ELITE HUB</h1>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Status: Premium</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full">
            <Wallet className="text-emerald-500 w-4 h-4" />
            <span className="font-black text-white">${balance.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-6 pt-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-[32px] relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="text-emerald-500/20 w-12 h-12" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2">
              ¡Hola, {telegramUser || 'Ganador'}! 👋
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Tienes tareas pendientes para hoy. Completa cada una para acumular bonos y llegar a tu meta de retiro.
            </p>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progreso de Retiro</span>
                <span className="text-sm font-black text-emerald-500">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>$0.00</span>
                <span>Meta: ${WITHDRAWAL_GOAL}.00</span>
              </div>
            </div>

            <button 
              onClick={() => setShowWithdrawModal(true)}
              disabled={balance < WITHDRAWAL_GOAL}
              className={`w-full mt-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                balance >= WITHDRAWAL_GOAL 
                ? 'bg-emerald-500 text-[#020617] hover:scale-[1.02] shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ArrowRight size={18} />
              Retirar Fondos
            </button>
          </motion.div>
        </section>

        {/* Daily Bonus Mini-Game Element */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Star size={14} className="text-emerald-500" />
              Bonos Diarios
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={claimDailyBonus}
              disabled={dailyBonusClaimed}
              className={`p-4 rounded-3xl border flex flex-col items-center gap-3 transition-all duration-300 ${
                dailyBonusClaimed 
                ? 'bg-slate-900/50 border-slate-800 opacity-50' 
                : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dailyBonusClaimed ? 'bg-slate-800' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}>
                <CheckCircle2 className={dailyBonusClaimed ? 'text-slate-600' : 'text-[#020617]'} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Check-in</p>
                <p className="font-black text-white">+$0.50</p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 flex flex-col items-center gap-3 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Gift className="text-[#020617]" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Caja Misteriosa</p>
                <p className="font-black text-white">Próximamente</p>
              </div>
            </motion.button>
          </div>
        </section>

        {/* Task Wall */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" />
              Muro de Tareas
            </h3>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
              {TASKS.length - completedTasks.length} DISPONIBLES
            </span>
          </div>

          <div className="space-y-4">
            {TASKS.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTaskClick(task)}
                className={`group relative p-5 rounded-[28px] border transition-all duration-300 cursor-pointer overflow-hidden ${
                  completedTasks.includes(task.id)
                  ? 'bg-slate-900/40 border-slate-800/50 grayscale opacity-70'
                  : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5'
                }`}
              >
                {/* Task Background Glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${task.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                <div className="relative z-10 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-110 transition-transform">
                    {task.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {task.category}
                      </span>
                      {completedTasks.includes(task.id) && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 size={10} /> COMPLETADA
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-white text-lg truncate">{task.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Recompensa</p>
                    <p className="text-xl font-black text-emerald-500 tracking-tighter">
                      +${task.reward.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="ml-2 text-slate-700 group-hover:text-emerald-500 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <footer className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Seguro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Pagos 24h</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-700 max-w-[200px] mx-auto leading-relaxed">
            © 2026 Elite Reward Hub. Todos los derechos reservados. Sujeto a términos y condiciones.
          </p>
        </footer>
      </main>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <Wallet className="text-emerald-500 w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-black text-white mb-3">Retiro de Fondos</h2>
                
                {balance < WITHDRAWAL_GOAL ? (
                  <>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      Aún no has alcanzado el mínimo de retiro. Necesitas al menos <span className="text-white font-bold">${WITHDRAWAL_GOAL}.00</span> para procesar tu pago.
                    </p>
                    <div className="bg-slate-950 rounded-2xl p-4 mb-8 border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Faltan</p>
                      <p className="text-2xl font-black text-white tracking-tighter">
                        ${(WITHDRAWAL_GOAL - balance).toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      ¡Felicidades! Has alcanzado la meta. Para procesar tu retiro de <span className="text-emerald-500 font-bold">${balance.toFixed(2)}</span>, completa la verificación final.
                    </p>
                    <a 
                      href={TASKS[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-emerald-500 text-[#020617] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 mb-4"
                    >
                      Verificación Final
                      <ExternalLink size={18} />
                    </a>
                  </>
                )}
                
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-slate-500 font-bold text-sm hover:text-slate-400 transition-colors"
                >
                  Volver al Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Bar (Mobile Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-t border-slate-800/50 px-8 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button className="flex flex-col items-center gap-1 text-emerald-500">
            <Zap size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Tareas</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-400 transition-colors">
            <TrendingUp size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Ranking</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-400 transition-colors">
            <ShieldCheck size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
