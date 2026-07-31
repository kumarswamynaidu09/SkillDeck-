import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Splash animation sequence (smoother & longer)
   0.0 s  – dot appears (pulse)
   0.8 s  – dot stretches into a horizontal line
   2.0 s  – line contracts slightly, title fades in centred on line
   3.2 s  – subtitle/tagline fades in below title
   4.2 s  – vertical door panels slide apart (top / bottom)
   5.6 s  – navigation completed
───────────────────────────────────────────── */

const DOOR_OPEN_DELAY = 4.2;   // seconds when doors start opening
const DONE_DELAY      = 5600;  // ms after which we navigate

export default function SplashScreen() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), DONE_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (done) navigate('/login', { replace: true });
  }, [done, navigate]);

  return (
    <AnimatePresence>
      {!done && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950">
          <motion.div
            key="splash"
            className="w-full max-w-md h-[100vh] relative overflow-hidden bg-slate-950 shadow-2xl border-x border-white/10 flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d2b1f 0%, #060d0a 60%, #000 100%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
          {/* ── Subtle grid overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* ── Ambient glow behind centre ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0.7], scale: [0.4, 1.2, 1] }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />

          {/* ════════════════════════════════════════
              CENTRE STAGE – dot → line → title
          ════════════════════════════════════════ */}
          <div className="relative flex flex-col items-center justify-center select-none">

            {/* ── STEP 1: dot appears & stretches ── */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                boxShadow: '0 0 24px rgba(16,185,129,0.9), 0 0 60px rgba(16,185,129,0.4)',
              }}
              initial={{ width: 10, height: 10, opacity: 0, scale: 0 }}
              animate={[
                // pulse in
                { width: 10, height: 10, opacity: 1, scale: 1,
                  transition: { duration: 0.5, ease: [0.34,1.56,0.64,1] } },
                // stretch to line
                { width: 260, height: 3, borderRadius: 4, opacity: 1,
                  transition: { delay: 0.4, duration: 0.8, ease: [0.76,0,0.24,1] } },
                // line glows bright briefly
                { width: 240, height: 3,
                  transition: { delay: 0.1, duration: 0.3, ease: 'easeOut' } },
              ]}
            />

            {/* ── STEP 2: title fades in over the line ── */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8, ease: [0.25,1,0.5,1] }}
            >
              {/* Brand name */}
              <h1
                className="font-black tracking-tight text-center leading-none"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 3.2rem)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 45%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                }}
              >
                SkillDeck{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 60%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Business
                </span>
              </h1>

              {/* Animated underline / shimmer bar */}
              <motion.div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)',
                  borderRadius: 2,
                  marginTop: 8,
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.7, ease: 'easeOut' }}
              />

              {/* Tagline */}
              <motion.p
                className="mt-3 text-center font-medium tracking-widest uppercase"
                style={{
                  fontSize: 'clamp(0.55rem, 2vw, 0.72rem)',
                  color: 'rgba(167,243,208,0.6)',
                  letterSpacing: '0.22em',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.6, ease: 'easeOut' }}
              >
                Connect · Grow · Succeed
              </motion.p>
            </motion.div>

            {/* ── Floating particles around centre ── */}
            {[...Array(8)].map((_, i) => {
              const angle  = (i / 8) * Math.PI * 2;
              const radius = 120 + (i % 3) * 30;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius * 0.5;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 3 + (i % 3),
                    height: 3 + (i % 3),
                    background: `rgba(16,185,129,${0.3 + (i % 4) * 0.12})`,
                    boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                    left: `calc(50% + ${x}px)`,
                    top:  `calc(50% + ${y}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale:   [0, 1.4, 0],
                    x: [0, Math.cos(angle + Math.PI / 2) * 20, 0],
                    y: [0, Math.sin(angle + Math.PI / 2) * 20, 0],
                  }}
                  transition={{
                    delay:    2.2 + i * 0.1,
                    duration: 1.8,
                    repeat:   Infinity,
                    repeatDelay: 0.5,
                    ease:     'easeInOut',
                  }}
                />
              );
            })}
          </div>

          {/* ════════════════════════════════════════
              VERTICAL DOOR PANELS – slide top & bottom
          ════════════════════════════════════════ */}

          {/* Top door */}
          <motion.div
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{
              height: '50%',
              background: 'linear-gradient(180deg, #060d0a 0%, #0a1a12 100%)',
              transformOrigin: 'center top',
              zIndex: 20,
            }}
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ delay: DOOR_OPEN_DELAY, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Door bottom edge highlight */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(16,185,129,0.4), transparent)',
              }}
            />
            {/* Door inner glow */}
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 0,
                translateX: '-50%',
                width: 240,
                height: 60,
                background: 'radial-gradient(ellipse at bottom, rgba(16,185,129,0.15) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: DOOR_OPEN_DELAY - 0.2, duration: 1.4 }}
            />
          </motion.div>

          {/* Bottom door */}
          <motion.div
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            style={{
              height: '50%',
              background: 'linear-gradient(0deg, #060d0a 0%, #0a1a12 100%)',
              transformOrigin: 'center bottom',
              zIndex: 20,
            }}
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ delay: DOOR_OPEN_DELAY, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Door top edge highlight */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(16,185,129,0.4), transparent)',
              }}
            />
            {/* Door inner glow */}
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                translateX: '-50%',
                width: 240,
                height: 60,
                background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.15) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: DOOR_OPEN_DELAY - 0.2, duration: 1.4 }}
            />
          </motion.div>

          {/* ── Door seam glow (horizontal center crack) ── */}
          <motion.div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: '50%',
              translateY: '-50%',
              height: 2,
              zIndex: 21,
              background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.9) 30%, rgba(52,211,153,1) 50%, rgba(16,185,129,0.9) 70%, transparent 100%)',
              boxShadow: '0 0 16px rgba(16,185,129,0.8), 0 0 40px rgba(16,185,129,0.3)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 1] }}
            transition={{
              delay: DOOR_OPEN_DELAY - 0.05,
              duration: 1.2,
              times: [0, 0.15, 0.6, 1],
              ease: 'easeInOut',
            }}
          />

          {/* ── Loading indicator (bottom) ── */}
          <motion.div
            className="absolute bottom-16 left-1/2 flex flex-col items-center gap-3"
            style={{ translateX: '-50%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.5 }}
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: 'rgba(16,185,129,0.7)',
                  }}
                  animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    delay: 3.0 + i * 0.15,
                    duration: 0.7,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
            <motion.p
              style={{
                fontSize: '0.65rem',
                color: 'rgba(167,243,208,0.4)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              Loading
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
