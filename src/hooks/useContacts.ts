
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Contact } from '@/pages/Index'
import { useToast } from '@/hooks/use-toast'

export const useContacts = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch contacts
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log('Fetching contacts from Supabase...')
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contacts:', error)
        throw error
      }

      console.log('Fetched contacts:', data)
      return data.map(contact => ({
        ...contact,
        createdAt: new Date(contact.created_at)
      })) as Contact[]
    }
  })

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
      console.log('Adding contact:', contactData)
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          category: contactData.category,
          avatar: contactData.avatar || null,
          is_favorite: contactData.is_favorite || false
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding contact:', error)
        throw error
      }

      console.log('Contact added successfully:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: "Contact added",
        description: `${data.name} has been added to your contacts.`,
      })
    },
    onError: (error) => {
      console.error('Failed to add contact:', error)
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, ...contactData }: { id: string } & Omit<Contact, 'id' | 'createdAt'>) => {
      console.log('Updating contact:', { id, ...contactData })
      const { data, error } = await supabase
        .from('contacts')
        .update({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          category: contactData.category,
          avatar: contactData.avatar || null,
          is_favorite: contactData.is_favorite || false
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating contact:', error)
        throw error
      }

      console.log('Contact updated successfully:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: "Contact updated",
        description: `${data.name} has been updated.`,
      })
    },
    onError: (error) => {
      console.error('Failed to update contact:', error)
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: string) => {
      const contact = contacts.find(c => c.id === id)
      if (!contact) throw new Error('Contact not found')

      console.log('Toggling favorite for contact:', id)
      const { data, error } = await supabase
        .from('contacts')
        .update({ is_favorite: !contact.is_favorite })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling favorite:', error)
        throw error
      }

      console.log('Favorite toggled successfully:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: data.is_favorite ? "Added to favorites" : "Removed from favorites",
        description: `${data.name} has been ${data.is_favorite ? 'added to' : 'removed from'} your favorites.`,
      })
    },
    onError: (error) => {
      console.error('Failed to toggle favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact:', id)
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting contact:', error)
        throw error
      }

      console.log('Contact deleted successfully')
      return id
    },
    onSuccess: (id) => {
      const deletedContact = contacts.find(c => c.id === id)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: "Contact deleted",
        description: `${deletedContact?.name} has been removed from your contacts.`,
        variant: "destructive",
      })
    },
    onError: (error) => {
      console.error('Failed to delete contact:', error)
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      })
    }
  })

  return {
    contacts,
    isLoading,
    error,
    addContact: addContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isAddingContact: addContactMutation.isPending,
    isUpdatingContact: updateContactMutation.isPending,
    isDeletingContact: deleteContactMutation.isPending
  }
}
