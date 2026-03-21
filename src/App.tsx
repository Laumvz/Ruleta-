/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ExternalLink, RefreshCw, Trophy, Gift, ArrowRight, Ticket, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TYPES ---
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

// --- CONFIGURATION ---
const SUBSCRIPTION_OFFER_LINK = "https://tu-oferta-de-suscripcion.com"; // Change this to your subscription offer link
const INITIAL_SPINS = 1;

interface Product {
  id: number;
  name: string;
  link: string;
  color: string;
  description: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Masterclass de Trading', link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=70090&tracking_id=/trading', color: '#FF6B6B', description: 'Aprende a invertir como un profesional.' },
  { id: 2, name: 'Curso de Marketing Digital', link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=56777&tracking_id= /mkt', color: '#4ECDC4', description: 'Domina las redes sociales y vende más.' },
  { id: 3, name: 'Suplemento Keto Pro', link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=70157&tracking_id= ', color: '#FFE66D', description: 'Energía pura para tu estilo de vida.' },
  { id: 4, name: 'Ebook: Libertad Financiera', link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=71637&tracking_id= ', color: '#1A535C', description: 'El camino hacia tu independencia.' },
  { id: 5, name: 'Software SEO Elite', link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=71187&tracking_id= ', color: '#F7FFF7', description: 'Posiciona tu web en el primer lugar.' },
  { id: 6, name: 'Membresía Fitness VIP', link: 'https://singingfiles.com/show.php?l=0&u=2508758&id=68576&tracking_id= ', color: '#FF9F1C', description: 'Entrena desde casa con los mejores.' },
];

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState<number>(() => {
    const saved = localStorage.getItem('spins_remaining');
    return saved !== null ? parseInt(saved) : INITIAL_SPINS;
  });
  const [hasClickedOffer, setHasClickedOffer] = useState(false);
  const [telegramUser, setTelegramUser] = useState<string | null>(null);

  // Telegram Mini App Integration
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Set theme colors
      tg.setHeaderColor(tg.themeParams.bg_color || '#0F172A');
      
      if (tg.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user.first_name);
      }
    }
  }, []);

  // Persist spins to localStorage
  useEffect(() => {
    localStorage.setItem('spins_remaining', spinsRemaining.toString());
  }, [spinsRemaining]);

  const spinWheel = () => {
    if (isSpinning) return;

    if (spinsRemaining <= 0) {
      setShowUnlockModal(true);
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setShowModal(false);
    setSpinsRemaining(prev => prev - 1);

    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * (5 + Math.floor(Math.random() * 5))) + extraDegrees;
    
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDegrees = totalRotation % 360;
      const segmentSize = 360 / PRODUCTS.length;
      const winningIndex = Math.floor((360 - (actualDegrees % 360)) / segmentSize) % PRODUCTS.length;
      
      const winningProduct = PRODUCTS[winningIndex];
      setWinner(winningProduct);
      setShowModal(true);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: PRODUCTS.map(p => p.color)
      });
    }, 4000);
  };

  const handleUnlockSpin = () => {
    // In a real scenario, you'd verify the subscription via a postback/API
    // For this demo, we'll allow them to claim it after clicking the link
    setSpinsRemaining(prev => prev + 1);
    setShowUnlockModal(false);
    setHasClickedOffer(false);
    
    // Celebration for unlocking
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#10B981', '#3B82F6']
    });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-emerald-500/30 pb-20">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            {telegramUser ? `¡Hola, ${telegramUser}!` : 'Ofertas Exclusivas Hoy'}
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            RULETA DE LA <span className="text-emerald-500">FORTUNA</span>
          </h1>
          
          {/* Spin Counter Badge */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Ticket className="text-emerald-500 w-5 h-5" />
              <span className="font-bold text-lg">
                {spinsRemaining} {spinsRemaining === 1 ? 'Giro disponible' : 'Giros disponibles'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Wheel Container */}
        <div className="relative flex flex-col items-center">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
            <div className="w-8 h-12 bg-white rounded-b-full shadow-xl flex items-center justify-center border-4 border-[#0F172A]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* The Wheel */}
          <motion.div
            className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full border-[12px] border-slate-800 shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.45, 0.05, 0.55, 0.95] }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {PRODUCTS.map((product, index) => {
                const angle = 360 / PRODUCTS.length;
                const startAngle = index * angle;
                const endAngle = (index + 1) * angle;
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                
                return (
                  <g key={product.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={product.color}
                      className="transition-opacity duration-300 hover:opacity-90"
                    />
                    <text
                      x="75"
                      y="50"
                      transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                      fill={index === 3 || index === 4 ? 'white' : '#0F172A'}
                      className="text-[3px] font-bold uppercase tracking-tighter"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {product.name.length > 15 ? product.name.substring(0, 12) + '...' : product.name}
                    </text>
                    
                    {/* Golden Star at the edge */}
                    <path
                      d="M 0,-1.5 L 0.4,-0.5 L 1.5,-0.5 L 0.6,0.2 L 0.9,1.2 L 0,0.6 L -0.9,1.2 L -0.6,0.2 L -1.5,-0.5 L -0.4,-0.5 Z"
                      fill="#FFD700"
                      stroke="#B8860B"
                      strokeWidth="0.1"
                      transform={`translate(${50 + 44 * Math.cos((Math.PI * (startAngle + angle / 2)) / 180)}, ${50 + 44 * Math.sin((Math.PI * (startAngle + angle / 2)) / 180)}) rotate(${startAngle + angle / 2 + 90})`}
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Center Hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 md:w-24 md:h-24 bg-[#0F172A] rounded-full border-4 border-slate-800 flex items-center justify-center shadow-inner">
                <Gift className="text-emerald-500 w-5 h-5 md:w-10 md:h-10" />
              </div>
            </div>
          </motion.div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`mt-12 group relative px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-300 ${
              isSpinning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : spinsRemaining <= 0
                  ? 'bg-slate-700 text-white/50 border border-white/10'
                  : 'bg-emerald-500 text-[#0F172A] hover:bg-emerald-400 hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.3)]'
            }`}
          >
            <span className="relative z-10 flex items-center gap-3">
              {isSpinning ? (
                <>
                  <RefreshCw className="animate-spin" />
                  Girando...
                </>
              ) : spinsRemaining <= 0 ? (
                <>
                  <Lock size={20} />
                  Sin Giros
                </>
              ) : (
                <>
                  GIRAR AHORA
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
          
          {spinsRemaining <= 0 && !isSpinning && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowUnlockModal(true)}
              className="mt-4 text-emerald-400 font-bold text-sm flex items-center gap-2 hover:text-emerald-300 transition-colors"
            >
              <Ticket size={16} />
              Obtener boleto extra
            </motion.button>
          )}
        </div>

        {/* Winner Modal */}
        <AnimatePresence>
          {showModal && winner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/10 p-8 rounded-[32px] max-w-md w-full shadow-2xl text-center relative overflow-hidden"
              >
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <Trophy className="text-emerald-500 w-10 h-10" />
                  </div>
                  <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2">¡Tenemos un Ganador!</h2>
                  <h3 className="text-3xl font-black mb-4 leading-tight">{winner.name}</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">{winner.description}</p>
                  <div className="space-y-3">
                    <a
                      href={winner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 text-[#0F172A] rounded-xl font-bold hover:bg-emerald-400 transition-colors group"
                    >
                      RECLAMAR OFERTA
                      <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <button onClick={() => setShowModal(false)} className="w-full py-4 bg-white/5 text-white/60 rounded-xl font-bold hover:bg-white/10 transition-colors">Cerrar</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Unlock Spin Modal (The Subscription Offer) */}
        <AnimatePresence>
          {showUnlockModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0F172A]/90 backdrop-blur-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-emerald-500/30 p-8 rounded-[32px] max-w-md w-full shadow-2xl text-center relative overflow-hidden"
              >
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <Ticket className="text-emerald-500 w-8 h-8" />
                  </div>
                  
                  <h2 className="text-2xl font-black mb-2">¿Quieres otro giro?</h2>
                  <p className="text-slate-400 mb-8">
                    Obtén un <span className="text-white font-bold">boleto extra</span> suscribiéndote a nuestra oferta especial de hoy. ¡Es rápido y fácil!
                  </p>
                  
                  <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Paso 1: Suscríbete</h4>
                        <p className="text-xs text-slate-500">Completa el registro en el siguiente enlace.</p>
                      </div>
                    </div>
                    <div className="h-6 w-px bg-white/10 ml-5 my-1" />
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${hasClickedOffer ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                        <RefreshCw className={`w-6 h-6 ${hasClickedOffer ? 'text-emerald-500' : 'text-white/20'}`} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${hasClickedOffer ? 'text-white' : 'text-white/40'}`}>Paso 2: Reclama tu giro</h4>
                        <p className="text-xs text-slate-500">Vuelve aquí y presiona el botón de abajo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <a
                      href={SUBSCRIPTION_OFFER_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setHasClickedOffer(true)}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-white text-[#0F172A] rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      IR A LA OFERTA
                      <ExternalLink size={18} />
                    </a>
                    
                    <button
                      onClick={handleUnlockSpin}
                      disabled={!hasClickedOffer}
                      className={`w-full py-4 rounded-xl font-bold transition-all ${
                        hasClickedOffer 
                          ? 'bg-emerald-500 text-[#0F172A] shadow-lg shadow-emerald-500/20' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      RECLAMAR BOLETO EXTRA
                    </button>
                    
                    <button
                      onClick={() => setShowUnlockModal(false)}
                      className="w-full py-2 text-slate-500 text-xs font-medium hover:text-slate-400 transition-colors"
                    >
                      Tal vez más tarde
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-32 text-center text-slate-500 text-sm border-t border-white/5 pt-12 w-full">
          <p>© 2026 Affiliate Fortune Wheel. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
