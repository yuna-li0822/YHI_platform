import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative rounded-3xl border border-cyan-500/20 bg-slate-900/90 p-3 shadow-inner shadow-cyan-900/20 transition focus-within:border-cyan-400/80 focus-within:shadow-[0_0_0_1px_rgba(56,189,248,0.25)]">
    <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search devices like TAVR"
      className="w-full rounded-3xl border border-transparent bg-transparent py-3 pl-12 pr-4 text-sm text-cyan-100 outline-none placeholder:text-cyan-400/60"
    />
  </div>
);

export default SearchBar;
