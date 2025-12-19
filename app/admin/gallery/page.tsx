'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Video, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { useRouter } from 'next/navigation';
import { Gallery } from '@/app/types/gallery';
import Image from 'next/image';

const categories = ['Ceremony', 'Bridal', 'Portraits', 'Mehndi', 'Sangeet', 'Reception', 'Decor', 'Films'];
const eventTypes = ['Wedding', 'Pre-Wedding', 'Engagement'];

interface Props {
  initialGallery?: Gallery[];
}

const ManageGallery: React.FC<Props> = ({ initialGallery }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [gallery, setGallery] = useState<Gallery[]>(initialGallery || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState<'url' | 'thumbnail' | null>(null);
  const [formData, setFormData] = useState({
    type: 'photo' as 'photo' | 'video',
    url: '',
    thumbnail: '',
    title: '',
    category: 'Ceremony',
    eventType: 'Wedding',
  });

  // Fetch gallery items on mount
  useEffect(() => {
    if (!initialGallery || initialGallery.length === 0) {
      fetchGallery();
    }
  }, []);

  const fetchGallery = async () => {
    setIsFetching(true);
    try {
      const response = await fetch('/api/admin/gallery');
      const data = await response.json();

      if (response.ok && data.galleries) {
        setGallery(Array.isArray(data.galleries) ? data.galleries : []);
      } else {
        console.error('Failed to fetch gallery:', data);
        toast({
          title: 'Error',
          description: 'Failed to load gallery items',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast({
        title: 'Error',
        description: 'Failed to load gallery items',
        variant: 'destructive'
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'url' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadingField(field);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData(prev => ({ ...prev, [field]: url }));
        toast({
          title: 'Image Uploaded',
          description: `${field === 'url' ? 'Main image' : 'Thumbnail'} uploaded successfully.`
        });
      } else {
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload image',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Error uploading image',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const galleryData = {
      type: formData.type,
      url: formData.url,
      thumbnail: formData.thumbnail || undefined,
      title: formData.title,
      category: formData.category,
      eventType: formData.eventType,
    };

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData),
      });

      const result = await response.json();

      if (response.ok) {
        setGallery(prev => [...prev, result.gallery]);
        toast({
          title: 'Gallery Updated',
          description: 'New item added to gallery.'
        });
        setIsModalOpen(false);
        resetForm();
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add gallery item',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGallery(prev => prev.filter(item => item.id !== id));
        toast({
          title: 'Item Deleted',
          description: 'Gallery item has been removed.'
        });
        router.refresh();
      } else {
        const result = await response.json();
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete item',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'photo',
      url: '',
      thumbnail: '',
      title: '',
      category: 'Ceremony',
      eventType: 'Wedding',
    });
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
      {isFetching ? (
        <div className="bg-card rounded-xl shadow-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-card rounded-xl shadow-card p-8 text-center">
          <p className="text-muted-foreground mb-4">No gallery items found. Add your first item to get started.</p>
          <Button variant="royal" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="group relative rounded-lg overflow-hidden bg-card shadow-card">
              {(item.type === 'video' ? item.thumbnail : item.url) && (
                <Image
                  src={item.type === 'video' ? item.thumbnail! : item.url!}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              )}
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
                <p className="text-xs text-muted-foreground">{item.category} • {item.eventType}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-elegant animate-scale-in">
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
                      className="w-4 h-4"
                    />
                    <ImageIcon className="w-4 h-4" />
                    Photo
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.type === 'video'}
                      onChange={() => setFormData({ ...formData, type: 'video' })}
                      className="w-4 h-4"
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

              {/* Main Image/Video URL Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.type === 'photo' ? 'Photo' : 'Video URL'}
                </label>
                <div className="space-y-2">
                  {formData.url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img
                        src={formData.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://... or upload"
                      className="flex-1"
                    />
                    {formData.type === 'photo' && (
                      <label className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors whitespace-nowrap">
                        <Upload className="w-4 h-4" />
                        {isUploading && uploadingField === 'url' ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'url')}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Thumbnail Upload */}
              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail</label>
                  <div className="space-y-2">
                    {formData.thumbnail && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://... or upload"
                        className="flex-1"
                      />
                      <label className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors whitespace-nowrap">
                        <Upload className="w-4 h-4" />
                        {isUploading && uploadingField === 'thumbnail' ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'thumbnail')}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                  disabled={loading || isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="royal"
                  className="flex-1"
                  disabled={loading || isUploading}
                >
                  {loading && (
                    <span
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                      aria-hidden
                    />
                  )}
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