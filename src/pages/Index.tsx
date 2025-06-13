
import { useState, useMemo } from 'react';
import { ContactCard } from '@/components/ContactCard';
import { ContactForm } from '@/components/ContactForm';
import { SearchBar } from '@/components/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown';
import { AddContactButton } from '@/components/AddContactButton';
import { EmptyState } from '@/components/EmptyState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportContacts } from '@/components/ExportContacts';
import { useContacts } from '@/hooks/useContacts';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: 'work' | 'personal' | 'family' | 'other';
  avatar?: string;
  is_favorite?: boolean;
  createdAt: Date;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { 
    contacts, 
    isLoading, 
    addContact, 
    updateContact, 
    deleteContact,
    toggleFavorite,
    isAddingContact,
    isUpdatingContact 
  } = useContacts();

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterCategory === 'all' || contact.category === filterCategory;
      const matchesFavorites = !showFavorites || contact.is_favorite;
      
      return matchesSearch && matchesFilter && matchesFavorites;
    });
  }, [contacts, searchTerm, filterCategory, showFavorites]);

  const favoriteContacts = contacts.filter(contact => contact.is_favorite);

  const handleAddContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    addContact(contactData);
    setIsFormOpen(false);
  };

  const handleEditContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    if (!editingContact) return;
    
    updateContact({ id: editingContact.id, ...contactData });
    setEditingContact(null);
    setIsFormOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    deleteContact(id);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Contacts</h1>
              <p className="text-muted-foreground">Manage your personal and professional contacts</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div className="flex gap-3">
            <FilterDropdown filterCategory={filterCategory} onFilterChange={setFilterCategory} />
            <ExportContacts contacts={contacts} />
            <AddContactButton onClick={openAddForm} />
          </div>
        </div>

        {/* Favorites toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showFavorites 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              ⭐ Favorites ({favoriteContacts.length})
            </button>
            {showFavorites && (
              <span className="text-sm text-muted-foreground">
                Showing favorite contacts only
              </span>
            )}
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
                onToggleFavorite={handleToggleFavorite}
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
          isSubmitting={isAddingContact || isUpdatingContact}
        />
      </div>
    </div>
  );
};

export default Index;
