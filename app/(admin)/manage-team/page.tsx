'use client'
import { useState } from 'react';
import { Plus, Edit, Trash2, X, Instagram } from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import { useToast } from '@/app/src/components/ui/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';

export default function Page() {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    specialization: '',
    photo: '',
    experience: '',
    bio: '',
    instagram: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      specialization: '',
      photo: '',
      experience: '',
      bio: '',
      instagram: '',
    });
    setEditingId(null);
  };

  const openModal = (member?: typeof team[0]) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name,
        role: member.role,
        specialization: member.specialization,
        photo: member.photo,
        experience: member.experience,
        bio: member.bio,
        instagram: member.instagram || '',
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateTeamMember(editingId, formData);
      toast({ title: 'Team Member Updated', description: 'Profile has been updated.' });
    } else {
      addTeamMember(formData);
      toast({ title: 'Team Member Added', description: 'New team member has been added.' });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      deleteTeamMember(id);
      toast({ title: 'Team Member Removed', description: 'Team member has been removed.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Manage Team</h1>
          <p className="text-muted-foreground">Add and manage team members.</p>
        </div>
        <Button variant="royal" onClick={() => openModal()}>
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="relative">
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="secondary" size="icon" className="w-8 h-8" onClick={() => openModal(member)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" className="w-8 h-8" onClick={() => handleDelete(member.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-gold text-maroon-dark text-xs font-semibold rounded">
                {member.experience}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-gold text-sm font-medium">{member.role}</p>
              <p className="text-muted-foreground text-sm mt-1">{member.specialization}</p>
              {member.instagram && (
                <a
                  href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-2"
                >
                  <Instagram className="w-3 h-3" />
                  {member.instagram}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-elegant animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Arjun Kapoor"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <Input
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Lead Photographer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience</label>
                  <Input
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="12 Years"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <Input
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Candid Photography"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo URL</label>
                <Input
                  required
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="A brief description..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instagram Handle</label>
                <Input
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="royal" className="flex-1">
                  {editingId ? 'Update' : 'Add'} Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
