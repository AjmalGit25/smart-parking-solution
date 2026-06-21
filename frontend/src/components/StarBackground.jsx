import { useMemo } from 'react';

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function StarBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
      size: random(1, 3),
      duration: `${random(2, 6)}s`,
      delay: `${random(0, 5)}s`,
      opacity: random(0.4, 1),
    })), []
  );

  const shootingStars = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: `${random(5, 50)}%`,
      left: `${random(0, 60)}%`,
      duration: `${random(3, 6)}s`,
      delay: `${random(0, 10)}s`,
    })), []
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060818]">

      {/* Nebula orbs */}
      <div className="absolute w-125 h-125 rounded-full opacity-20 blur-[120px] bg-indigo-600 -top-32 -left-32 animate-[drift_18s_ease-in-out_infinite]" />
      <div className="absolute w-100 h-100 rounded-full opacity-15 blur-[100px] bg-violet-700 bottom-0 right-0 animate-[drift_22s_ease-in-out_infinite_reverse]" />
      <div className="absolute w-75 h-75 rounded-full opacity-10 blur-[90px] bg-cyan-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[drift_15s_ease-in-out_infinite_1s]" />

      {/* Twinkling stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((s) => (
        <span
          key={s.id}
          className="absolute h-px bg-linear-to-r from-transparent via-white to-transparent"
          style={{
            top: s.top,
            left: s.left,
            width: '120px',
            opacity: 0,
            animation: `shoot ${s.duration} ${s.delay} ease-in infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.08); }
          66%       { transform: translate(-30px, 40px) scale(0.95); }
        }
        @keyframes shoot {
          0%   { opacity: 0;   transform: translateX(0)    rotate(-30deg); }
          10%  { opacity: 1; }
          70%  { opacity: 0.6; }
          100% { opacity: 0;   transform: translateX(300px) rotate(-30deg); }
        }
      `}</style>
    </div>
  );
}
