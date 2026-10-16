import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative rounded-3xl border border-rose-200 bg-rose-50/80 p-3 shadow-inner shadow-rose-200/50 transition focus-within:border-rose-400/80 focus-within:shadow-[0_0_0_1px_rgba(244,114,182,0.35)]">
    <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-500" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search devices like TAVR"
      className="w-full rounded-3xl border border-transparent bg-transparent py-3 pl-12 pr-4 text-sm text-rose-900 outline-none placeholder:text-rose-400/60"
    />
  </div>
);

export default SearchBar;
