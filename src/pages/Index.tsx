
import { useState, useMemo } from 'react';
import { ContactCard } from '@/components/ContactCard';
import { ContactForm } from '@/components/ContactForm';
import { SearchBar } from '@/components/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown';
import { AddContactButton } from '@/components/AddContactButton';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/hooks/use-toast';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: 'work' | 'personal' | 'family' | 'other';
  avatar?: string;
  createdAt: Date;
}

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterCategory === 'all' || contact.category === filterCategory;
      
      return matchesSearch && matchesFilter;
    });
  }, [contacts, searchTerm, filterCategory]);

  const handleAddContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setContacts(prev => [...prev, newContact]);
    setIsFormOpen(false);
    toast({
      title: "Contact added",
      description: `${contactData.name} has been added to your contacts.`,
    });
  };

  const handleEditContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    if (!editingContact) return;
    
    setContacts(prev => prev.map(contact => 
      contact.id === editingContact.id 
        ? { ...contact, ...contactData }
        : contact
    ));
    setEditingContact(null);
    setIsFormOpen(false);
    toast({
      title: "Contact updated",
      description: `${contactData.name} has been updated.`,
    });
  };

  const handleDeleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact deleted",
      description: `${contact?.name} has been removed from your contacts.`,
      variant: "destructive",
    });
  };

  const openEditForm = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Contacts</h1>
          <p className="text-muted-foreground">Manage your personal and professional contacts</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div className="flex gap-3">
            <FilterDropdown filterCategory={filterCategory} onFilterChange={setFilterCategory} />
            <AddContactButton onClick={openAddForm} />
          </div>
        </div>

        {/* Contact Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={openEditForm}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            hasContacts={contacts.length > 0}
            onAddContact={openAddForm}
          />
        )}

        {/* Contact Form Modal */}
        <ContactForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={editingContact ? handleEditContact : handleAddContact}
          initialData={editingContact}
          mode={editingContact ? 'edit' : 'add'}
        />
      </div>
    </div>
  );
};

export default Index;
