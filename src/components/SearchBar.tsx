import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-3 shadow-inner shadow-slate-950/20 transition focus-within:border-cyan-400/70 focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.2)]">
    <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search devices like TAVR"
      className="w-full rounded-3xl border border-transparent bg-transparent py-3 pl-12 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500"
    />
  </div>
);

export default SearchBar;
