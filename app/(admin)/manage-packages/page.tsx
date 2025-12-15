'use client'
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import { useToast } from '@/app/src/components/ui/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';
import { formatPrice } from '@/app/data/mockData';


export default function Page() {
  const { packages, addPackage, updatePackage, deletePackage } = useData();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    deliverables: '',
    duration: '',
    preview: '',
    popular: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      deliverables: '',
      duration: '',
      preview: '',
      popular: false,
    });
    setEditingId(null);
  };

  const openModal = (pkg?: typeof packages[0]) => {
    if (pkg) {
      setEditingId(pkg.id);
      setFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        description: pkg.description,
        deliverables: pkg.deliverables.join('\n'),
        duration: pkg.duration,
        preview: pkg.preview,
        popular: pkg.popular || false,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      deliverables: formData.deliverables.split('\n').filter(d => d.trim()),
      duration: formData.duration,
      preview: formData.preview || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      popular: formData.popular,
    };

    if (editingId) {
      updatePackage(editingId, packageData);
      toast({ title: 'Package Updated', description: 'The package has been updated successfully.' });
    } else {
      addPackage(packageData);
      toast({ title: 'Package Created', description: 'The new package has been created successfully.' });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      deletePackage(id);
      toast({ title: 'Package Deleted', description: 'The package has been removed.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Manage Packages</h1>
          <p className="text-muted-foreground">Create and manage your service packages.</p>
        </div>
        <Button variant="royal" onClick={() => openModal()}>
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      {/* Packages List */}
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <img
                src={pkg.preview}
                alt={pkg.name}
                className="w-full md:w-48 h-48 object-cover"
              />
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                      {pkg.name}
                      {pkg.popular && (
                        <span className="text-xs px-2 py-1 bg-gold text-maroon-dark rounded-full">Popular</span>
                      )}
                    </h3>
                    <p className="text-gold font-bold">{formatPrice(pkg.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(pkg)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(pkg.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{pkg.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.deliverables.slice(0, 3).map((d, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {d}
                    </span>
                  ))}
                  {pkg.deliverables.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      +{pkg.deliverables.length - 3} more
                    </span>
                  )}
                </div>
              </div>
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
                {editingId ? 'Edit Package' : 'Add New Package'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Package Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Royal Heritage"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <Input
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="3 Days"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Package description..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deliverables (one per line)</label>
                <Textarea
                  required
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="3 Days Full Coverage&#10;Cinematic Wedding Film&#10;500+ Edited Photos"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preview Image URL</label>
                <Input
                  value={formData.preview}
                  onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Mark as Popular</span>
              </label>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="royal" className="flex-1">
                  {editingId ? 'Update' : 'Create'} Package
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
