import { useState, useEffect } from 'react';

interface Props {
  /** Target end time in ms (Date.now() based) */
  targetTime: number;
  /** Optional: size variant */
  size?: 'sm' | 'md';
}

function padZero(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function CountdownTimer({ targetTime, size = 'md' }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const boxClass =
    size === 'sm'
      ? 'bg-gray-900 text-white text-sm font-bold rounded-md px-1.5 py-0.5 min-w-[28px] text-center'
      : 'bg-gray-900 text-white text-lg font-extrabold rounded-lg px-2.5 py-1.5 min-w-[40px] text-center shadow-md';

  const separatorClass =
    size === 'sm'
      ? 'text-gray-900 font-bold text-sm'
      : 'text-white font-extrabold text-lg';

  return (
    <div className="flex items-center gap-1.5">
      <span className={boxClass}>{padZero(timeLeft.hours)}</span>
      <span className={separatorClass}>:</span>
      <span className={boxClass}>{padZero(timeLeft.minutes)}</span>
      <span className={separatorClass}>:</span>
      <span className={boxClass}>{padZero(timeLeft.seconds)}</span>
    </div>
  );
}

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
}

/** Helper: get end of today (23:59:59) as target */
export function getEndOfDay(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
}
