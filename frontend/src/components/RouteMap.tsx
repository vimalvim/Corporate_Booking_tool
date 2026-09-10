export default function RouteMap() {
  return (
    <svg viewBox="0 0 320 200" className="w-full max-w-xs opacity-90" fill="none">
      <path
        d="M10 170 C 80 150, 90 60, 160 60 S 250 150, 310 30"
        stroke="#B8862F"
        strokeWidth="2"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <circle cx="10" cy="170" r="5" fill="#F7F6F1" stroke="#B8862F" strokeWidth="2" />
      <circle cx="160" cy="60" r="4" fill="#B8862F" />
      <g transform="translate(298, 20) rotate(45)">
        <path d="M0 8 L16 0 L0 -8 L3 0 Z" fill="#F7F6F1" />
      </g>
    </svg>
  );
}