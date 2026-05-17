import { useState, useEffect } from 'react';

export function useCountdown(targetMs: number | null, intervalMs: number): string {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    const update = () => {
      if (!targetMs) { setDisplay(''); return; }
      const diff = targetMs - Date.now();
      if (diff <= 0) { setDisplay(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 0) setDisplay(`${h}ч ${m.toString().padStart(2,'0')}м ${s.toString().padStart(2,'0')}с`);
      else if (m > 0) setDisplay(`${m}м ${s.toString().padStart(2,'0')}с`);
      else setDisplay(`${s}с`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return display;
}

export function useCooldownEnd(last: number | null, duration: number): number | null {
  if (!last) return null;
  const end = last + duration;
  return end > Date.now() ? end : null;
}
