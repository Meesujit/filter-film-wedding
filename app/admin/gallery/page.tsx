'use client';
import React, { useState } from 'react';
import { Plus, Trash2, X, Image, Video } from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';

const categories = ['Ceremony', 'Bridal', 'Portraits', 'Mehndi', 'Sangeet', 'Reception', 'Decor', 'Films'];
const eventTypes = ['Wedding', 'Pre-Wedding', 'Engagement'];

const ManageGallery: React.FC = () => {
  const { gallery, addGalleryItem, deleteGalleryItem } = useData();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'photo' as 'photo' | 'video',
    url: '',
    thumbnail: '',
    title: '',
    category: 'Ceremony',
    eventType: 'Wedding',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem(formData);
    toast({ title: 'Gallery Updated', description: 'New item added to gallery.' });
    setIsModalOpen(false);
    setFormData({
      type: 'photo',
      url: '',
      thumbnail: '',
      title: '',
      category: 'Ceremony',
      eventType: 'Wedding',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteGalleryItem(id);
      toast({ title: 'Item Deleted', description: 'Gallery item has been removed.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Manage Gallery</h1>
          <p className="text-muted-foreground">Upload and manage your portfolio.</p>
        </div>
        <Button variant="royal" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="group relative rounded-lg overflow-hidden bg-card shadow-card">
            <img
              src={item.type === 'video' ? item.thumbnail : item.url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Video className="w-10 h-10 text-white/80" />
              </div>
            )}
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-card rounded-2xl w-full max-w-md shadow-elegant animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">Add Gallery Item</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.type === 'photo'}
                      onChange={() => setFormData({ ...formData, type: 'photo' })}
                    />
                    <Image className="w-4 h-4" />
                    Photo
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.type === 'video'}
                      onChange={() => setFormData({ ...formData, type: 'video' })}
                    />
                    <Video className="w-4 h-4" />
                    Video
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Royal Mandap Ceremony"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <Input
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="royal" className="flex-1">
                  Add Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
