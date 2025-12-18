'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';
import { Package } from '@/app/types/package';
import Image from 'next/image';

interface Props {
    initialPackages?: Package[];
}

export default function Page({ initialPackages }: Props) {
    const router = useRouter();
    const [packages, setPackages] = useState<Package[]>(initialPackages || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetchingPackages, setIsFetchingPackages] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        deliverables: '',
        duration: '',
        preview: '',
        popular: false,
    });

    // Fetch packages on mount if initialPackages is empty
    useEffect(() => {
        if (!initialPackages || initialPackages.length === 0) {
            fetchPackages();
        }
    }, []);

    const fetchPackages = async () => {
        setIsFetchingPackages(true);
        try {
            const response = await fetch('/api/admin/package');
            const data = await response.json();
            
            console.log('Fetched packages response:', data);
            
            if (response.ok && data.packages) {
                setPackages(Array.isArray(data.packages) ? data.packages : []);
            } else {
                console.error('Failed to fetch packages:', data);
                toast({
                    title: 'Error',
                    description: 'Failed to load packages',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            toast({
                title: 'Error',
                description: 'Failed to load packages',
                variant: 'destructive'
            });
        } finally {
            setIsFetchingPackages(false);
        }
    };

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

    const openModal = (pkg?: Package) => {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const { url } = await response.json();
                setFormData(prev => ({ ...prev, preview: url }));
                toast({
                    title: 'Image Uploaded',
                    description: 'Preview image uploaded successfully.'
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
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const packageData = {
            name: formData.name,
            price: parseInt(formData.price),
            description: formData.description,
            deliverables: formData.deliverables.split('\n').filter(d => d.trim()),
            duration: formData.duration,
            preview: formData.preview || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
            popular: formData.popular,
        };

        try {
            if (editingId) {
                // Update existing package
                const response = await fetch(`/api/admin/package/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(packageData),
                });

                const result = await response.json();

                if (response.ok) {
                    setPackages(prev => prev.map(p => p.id === editingId ? result.package : p));
                    toast({
                        title: 'Package Updated',
                        description: 'The package has been updated successfully.'
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result.error || 'Failed to update package',
                        variant: 'destructive'
                    });
                    setLoading(false);
                    return;
                }
            } else {
                // Create new package
                const response = await fetch('/api/admin/package', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(packageData),
                });

                const result = await response.json();

                if (response.ok) {
                    setPackages(prev => [...prev, result.package]);
                    toast({
                        title: 'Package Created',
                        description: 'The new package has been created successfully.'
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result.error || 'Failed to create package',
                        variant: 'destructive'
                    });
                    setLoading(false);
                    return;
                }
            }

            setIsModalOpen(false);
            resetForm();
            router.refresh();
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
        if (!confirm('Are you sure you want to delete this package?')) return;

        try {
            const response = await fetch(`/api/admin/package/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPackages(prev => prev.filter(p => p.id !== id));
                toast({
                    title: 'Package Deleted',
                    description: 'The package has been removed.'
                });
                router.refresh();
            } else {
                const result = await response.json();
                toast({
                    title: 'Error',
                    description: result.error || 'Failed to delete package',
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
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
                {isFetchingPackages ? (
                    <div className="bg-card rounded-xl shadow-card p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Loading packages...</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div className="bg-card rounded-xl shadow-card p-8 text-center">
                        <p className="text-muted-foreground mb-4">No packages found. Create your first package to get started.</p>
                        <Button variant="royal" onClick={() => openModal()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Package
                        </Button>
                    </div>
                ) : (
                    packages.map((pkg) => (
                        <div key={pkg.id} className="bg-card rounded-xl shadow-card overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <Image
                                    src={pkg.preview}
                                    alt={pkg.name}
                                    width={192}
                                    height={192}
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
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-4 z-50 flex items-center justify-center p-4 bg-foreground/50">
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
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Preview Image</label>
                                <div className="flex items-center gap-4">
                                    {formData.preview && (
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={formData.preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                                        <Upload className="w-4 h-4" />
                                        {isUploading ? 'Uploading...' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="royal"
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <span
                                            className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                            aria-hidden
                                        />
                                    )}
                                    {editingId ? 'Update' : 'Create'} Package
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}