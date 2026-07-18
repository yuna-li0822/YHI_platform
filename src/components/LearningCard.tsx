interface LearningCardProps {
  title: string;
  text: string;
  accent: string;
}

const accentMap: Record<string, string> = {
  Blue: 'from-sky-500 to-cyan-400',
  Indigo: 'from-indigo-500 to-violet-500',
  Pink: 'from-pink-500 to-rose-500',
  Cyan: 'from-cyan-400 to-sky-500',
  Violet: 'from-violet-500 to-fuchsia-500',
};

const LearningCard = ({ title, text, accent }: LearningCardProps) => (
  <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
    <div className={`inline-flex rounded-full bg-gradient-to-r ${accentMap[accent] ?? 'from-sky-500 to-cyan-400'} px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950/90`}>{accent}</div>
    <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
  </div>
);

export default LearningCard;
