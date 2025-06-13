
import { Contact } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, User } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-green-100 text-green-800',
      family: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
      <CardContent className="p-6">
        {/* Avatar and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
            {contact.avatar ? (
              <img 
                src={contact.avatar} 
                alt={contact.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(contact.name)
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(contact)}
              className="h-8 w-8 p-0 hover:bg-secondary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(contact.id)}
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg leading-tight">{contact.name}</h3>
            {contact.company && (
              <p className="text-sm text-muted-foreground">{contact.company}</p>
            )}
          </div>

          <div className="space-y-2">
            <a 
              href={`mailto:${contact.email}`}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors truncate"
            >
              {contact.email}
            </a>
            {contact.phone && (
              <a 
                href={`tel:${contact.phone}`}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {contact.phone}
              </a>
            )}
          </div>

          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(contact.category)} text-xs capitalize`}
          >
            {contact.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
