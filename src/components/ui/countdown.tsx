import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate?: Date;
  /** If no targetDate is provided, start from this many seconds */
  initialSeconds?: number;
  variant?: "dark" | "light";
}

function CountdownUnit({ label, value, variant }: { label: string; value: number; variant: "dark" | "light" }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xs ${variant === "dark" ? "text-white" : "text-black"} font-medium`}>{label}</span>
      <span className={`text-2xl font-bold leading-tight ${variant === "dark" ? "text-white" : "text-black"}`}>{String(value).padStart(2, "0")}</span>
    </div>
  );
}

function CountdownColon() {
  return <span className="text-[#e07575] text-2xl font-bold self-end mb-0.5">:</span>;
}

export function Countdown({ targetDate, initialSeconds = 86400, variant = "light" }: CountdownProps) {
  const getTimeLeft = () => {
    if (targetDate) {
      const diff = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
      return diff;
    }
    return initialSeconds;
  };

  const [seconds, setSeconds] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-2">
      <CountdownUnit label="Days" value={days} variant={variant} />
      <CountdownColon />
      <CountdownUnit label="Hours" value={hours} variant={variant} />
      <CountdownColon />
      <CountdownUnit label="Minutes" value={mins} variant={variant} />
      <CountdownColon />
      <CountdownUnit label="Seconds" value={secs} variant={variant} />
    </div>
  );
}
