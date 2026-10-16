interface LearningCardProps {
  title: string;
  text: string;
  accent: string;
}

const accentMap: Record<string, string> = {
  Blue: 'from-rose-400 via-fuchsia-400 to-pink-500',
  Indigo: 'from-rose-500 via-fuchsia-500 to-pink-400',
  Pink: 'from-pink-500 to-rose-500',
  Cyan: 'from-rose-400 via-pink-400 to-rose-500',
  Violet: 'from-fuchsia-500 via-pink-500 to-rose-400',
};

const LearningCard = ({ title, text, accent }: LearningCardProps) => (
  <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-lg shadow-rose-200/50 backdrop-blur-xl">
    <div className={`inline-flex rounded-full bg-gradient-to-r ${accentMap[accent] ?? 'from-pink-500 to-rose-400'} px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white`}>{accent}</div>
    <h3 className="mt-4 text-lg font-semibold text-rose-950">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-rose-700">{text}</p>
  </div>
);

export default LearningCard;
