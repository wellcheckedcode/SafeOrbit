import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Plus, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { RelationshipType, relationshipTypes, type InsertUserProfile, type InsertEmergencyContact } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: RelationshipType;
  priority: number;
}

export default function ProfileCreate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Emergency contacts state
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: '', phone: '', email: '', relationship: 'Parent', priority: 1 }
  ]);

  const handleBack = () => {
    navigate('/');
  };

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      email: '',
      relationship: 'Parent',
      priority: contacts.length + 1
    };
    setContacts([...contacts, newContact]);
    console.log('Added new contact:', newContact); // TODO: remove mock functionality
  };

  const handleRemoveContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(c => c.id !== id));
      console.log('Removed contact:', id); // TODO: remove mock functionality
    }
  };

  const handleContactChange = (id: string, field: keyof EmergencyContact, value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, [field]: field === 'priority' ? parseInt(value) || 1 : value }
        : contact
    ));
  };

  // Profile creation mutation
  const createProfileMutation = useMutation({
    mutationFn: async ({ profileData, contactsData }: {
      profileData: InsertUserProfile;
      contactsData: InsertEmergencyContact[];
    }) => {
      // Create profile first
      const profileResponse = await apiRequest('/api/profiles', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      const createdProfile = await profileResponse.json();

      // Then create emergency contacts
      const contactPromises = contactsData.map(contact => 
        apiRequest('/api/emergency-contacts', {
          method: 'POST',
          body: JSON.stringify({
            ...contact,
            userId: createdProfile.id
          })
        })
      );

      await Promise.all(contactPromises);
      return createdProfile;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Created',
        description: 'Your profile and emergency contacts have been saved successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('Profile creation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData: InsertUserProfile = {
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim() || null,
    };

    const contactsData: InsertEmergencyContact[] = contacts.map((contact, index) => ({
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim() || null,
      relationship: contact.relationship,
      priority: index + 1,
      userId: '', // Will be set after profile creation
    }));

    createProfileMutation.mutate({ profileData, contactsData });
  };

  const isFormValid = profile.name.trim() && profile.email.trim() && 
                     contacts.every(c => c.name.trim() && c.phone.trim());
  const isSubmitting = createProfileMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">Create Profile</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your full name"
                  data-testid="input-profile-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="your.email@example.com"
                  data-testid="input-profile-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                  data-testid="input-profile-phone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Emergency Contacts</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddContact}
                  data-testid="button-add-contact"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {contacts.map((contact, index) => (
                <div key={contact.id} className="border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Contact #{index + 1}</h4>
                    {contacts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveContact(contact.id)}
                        data-testid={`button-remove-contact-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                        placeholder="Contact name"
                        data-testid={`input-contact-name-${index}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        data-testid={`input-contact-phone-${index}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                        placeholder="contact@example.com"
                        data-testid={`input-contact-email-${index}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select
                        value={contact.relationship}
                        onValueChange={(value: RelationshipType) => 
                          handleContactChange(contact.id, 'relationship', value)
                        }
                      >
                        <SelectTrigger data-testid={`select-contact-relationship-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              data-testid="button-submit-profile"
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}