import { useState, useContext } from "react";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipType, relationshipTypes, type InsertUserProfile, type InsertEmergencyContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: RelationshipType;
  priority: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { setUser } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profile form state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Emergency contacts state
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "", phone: "", email: "", relationship: "Parent", priority: 1 },
  ]);

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      phone: "",
      email: "",
      relationship: "Parent",
      priority: contacts.length + 1,
    };
    setContacts([...contacts, newContact]);
  };

  const handleRemoveContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const handleContactChange = (id: string, field: keyof EmergencyContact, value: string) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id
          ? { ...contact, [field]: field === "priority" ? parseInt(value) || 1 : value }
          : contact
      )
    );
  };

  // Profile creation mutation
  const createProfileMutation = useMutation({
    mutationFn: async ({
      profileData,
      contactsData,
    }: {
      profileData: InsertUserProfile;
      contactsData: InsertEmergencyContact[];
    }) => {
      // Create profile first
      const profileResponse = await apiRequest("POST", "/api/profiles", profileData);
      const createdProfile = await profileResponse.json();

      // Then create emergency contacts
      const contactPromises = contactsData.map((contact) =>
        apiRequest("POST", "/api/emergency-contacts", {
          ...contact,
          userId: createdProfile.id,
        })
      );

      await Promise.all(contactPromises);
      return createdProfile;
    },
    onSuccess: (createdProfile) => {
      toast({
        title: "Profile Created",
        description: "Your profile and emergency contacts have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setUser(createdProfile);
      onClose();
    },
    onError: (error) => {
      console.error("Profile creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData: InsertUserProfile = {
      name: profile.name.trim(),
      email: profile.email.trim(),
      password: profile.password.trim(),
      phone: profile.phone.trim() || null,
    };

    const contactsData: InsertEmergencyContact[] = contacts.map((contact, index) => ({
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim() || null,
      relationship: contact.relationship,
      priority: index + 1,
      userId: "", // Will be set after profile creation
    }));

    createProfileMutation.mutate({ profileData, contactsData });
  };

  const isFormValid =
    profile.name.trim() &&
    profile.email.trim() &&
    profile.password.trim() &&
    contacts.every((c) => c.name.trim() && c.phone.trim());
  const isSubmitting = createProfileMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                placeholder="Enter a password"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Emergency Contacts</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
                Add Contact
              </Button>
            </div>
            <div className="space-y-6">
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
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleContactChange(contact.id, "name", e.target.value)}
                        placeholder="Contact name"
                        required
                      />
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleContactChange(contact.id, "phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(contact.id, "email", e.target.value)}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Select
                        value={contact.relationship}
                        onValueChange={(value: RelationshipType) =>
                          handleContactChange(contact.id, "relationship", value)
                        }
                      >
                        <SelectTrigger>
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating Profile..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
