
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddContactButtonProps {
  onClick: () => void;
}

export const AddContactButton = ({ onClick }: AddContactButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Contact
    </Button>
  );
};
