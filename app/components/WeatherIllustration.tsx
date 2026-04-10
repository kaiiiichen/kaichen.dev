interface WeatherIllustrationProps {
  weatherCode: number;
  className?: string;
}

function getVariant(code: number): "sunny" | "partly-cloudy" | "overcast" | "rainy" | "thunderstorm" | "snowy" {
  if (code === 0) return "sunny";
  if (code <= 2) return "partly-cloudy";
  if (code === 3 || code === 45 || code === 48) return "overcast";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rainy";
  if (code >= 95 && code <= 99) return "thunderstorm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snowy";
  return "overcast";
}

const Cloud = ({ cx = 60, cy = 50, scale = 1 }: { cx?: number; cy?: number; scale?: number }) => (
  <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
    <ellipse cx="0" cy="0" rx="22" ry="13" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="-10" cy="-5" rx="14" ry="11" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="10" cy="-4" rx="13" ry="10" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
  </g>
);

const Sun = ({ cx = 40, cy = 35, r = 12 }: { cx?: number; cy?: number; r?: number }) => {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x1 = cx + Math.cos(angle) * (r + 4);
    const y1 = cy + Math.sin(angle) * (r + 4);
    const x2 = cx + Math.cos(angle) * (r + 10);
    const y2 = cy + Math.sin(angle) * (r + 10);
    return { x1, y1, x2, y2 };
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#C4894F" opacity="0.25" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#C4894F" strokeWidth="1.8" />
      {rays.map((ray, i) => (
        <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} stroke="#C4894F" strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </g>
  );
};

export default function WeatherIllustration({ weatherCode, className }: WeatherIllustrationProps) {
  const variant = getVariant(weatherCode);

  return (
    <svg
      viewBox="0 0 120 80"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
    >
      {variant === "sunny" && (
        <Sun cx={60} cy={40} r={16} />
      )}

      {variant === "partly-cloudy" && (
        <>
          <Sun cx={75} cy={28} r={10} />
          <Cloud cx={52} cy={48} scale={0.9} />
        </>
      )}

      {variant === "overcast" && (
        <>
          <Cloud cx={50} cy={38} scale={1.05} />
          <Cloud cx={70} cy={50} scale={0.85} />
        </>
      )}

      {variant === "rainy" && (
        <>
          <Cloud cx={60} cy={35} scale={1} />
          {[[-16, 0], [-8, 6], [0, 0], [8, 6], [16, 0], [24, 6]].map(([dx, dy], i) => (
            <line
              key={i}
              x1={60 + dx} y1={55 + dy}
              x2={54 + dx} y2={68 + dy}
              stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round"
            />
          ))}
        </>
      )}

      {variant === "thunderstorm" && (
        <>
          <Cloud cx={60} cy={32} scale={1} />
          {[[-14, 0], [-6, 5], [10, 0], [18, 5]].map(([dx, dy], i) => (
            <line
              key={i}
              x1={55 + dx} y1={52 + dy}
              x2={49 + dx} y2={63 + dy}
              stroke="#5b9bd5" strokeWidth="1.4" strokeLinecap="round"
            />
          ))}
          <polyline
            points="64,50 58,62 63,62 56,74"
            fill="none"
            stroke="#C4894F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {variant === "snowy" && (
        <>
          <Cloud cx={60} cy={33} scale={1} />
          {[[38, 57], [50, 63], [62, 57], [74, 63], [44, 70], [68, 70]].map(([sx, sy], i) => (
            <g key={i}>
              <line x1={sx} y1={sy - 5} x2={sx} y2={sy + 5} stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={sx - 4} y1={sy - 3} x2={sx + 4} y2={sy + 3} stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={sx + 4} y1={sy - 3} x2={sx - 4} y2={sy + 3} stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
