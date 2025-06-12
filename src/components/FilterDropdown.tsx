
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterDropdownProps {
  filterCategory: string;
  onFilterChange: (category: string) => void;
}

export const FilterDropdown = ({ filterCategory, onFilterChange }: FilterDropdownProps) => {
  return (
    <Select value={filterCategory} onValueChange={onFilterChange}>
      <SelectTrigger className="w-[140px] h-11">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Contacts</SelectItem>
        <SelectItem value="personal">Personal</SelectItem>
        <SelectItem value="work">Work</SelectItem>
        <SelectItem value="family">Family</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  );
};
