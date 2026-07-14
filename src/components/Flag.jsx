const FLAG_CODES = { Argentina: 'ar', France: 'fr', Spain: 'es', England: 'gb-eng' };

export default function Flag({ nation, className = "w-6 h-4" }) {
  const code = FLAG_CODES[nation];
  if (!code) return <span className="text-sm">🏳️</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={nation}
      className={`${className} object-cover rounded-sm inline-block align-middle`}
    />
  );
}