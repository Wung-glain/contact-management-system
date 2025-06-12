
import { Button } from '@/components/ui/button';
import { User, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasContacts: boolean;
  onAddContact: () => void;
}

export const EmptyState = ({ hasContacts, onAddContact }: EmptyStateProps) => {
  if (hasContacts) {
    // No contacts match the current filter/search
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Try adjusting your search terms or filters to find the contacts you're looking for.
        </p>
      </div>
    );
  }

  // No contacts at all
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <User className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-3">Welcome to your Contact Manager</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Get started by adding your first contact. You can organize them by categories and easily search through your network.
      </p>
      <Button onClick={onAddContact} size="lg" className="px-8">
        <Plus className="h-5 w-5 mr-2" />
        Add Your First Contact
      </Button>
    </div>
  );
};
