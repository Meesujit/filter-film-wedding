'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/app/src/components/ui/button';
import { Package } from '@/app/types/package';

interface Props {
    initialPackages?: Package[];
}

export default function PackageManagement({ initialPackages }: Props) {
    const router = useRouter();
    const [packages, setPackages] = useState<Package[]>(initialPackages || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetchingPackages, setIsFetchingPackages] = useState(false);
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
                alert('Failed to load packages');
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            alert('Failed to load packages');
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
                alert('Image uploaded successfully');
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image');
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
                    alert('Package updated successfully');
                } else {
                    alert(result.error || 'Failed to update package');
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
                    alert('Package created successfully');
                } else {
                    alert(result.error || 'Failed to create package');
                    setLoading(false);
                    return;
                }
            }

            setIsModalOpen(false);
            resetForm();
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            alert('An unexpected error occurred');
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
                alert('Package deleted successfully');
                router.refresh();
            } else {
                const result = await response.json();
                alert(result.error || 'Failed to delete package');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An unexpected error occurred');
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
        <div className="space-y-0 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Packages</h1>
                    <p className="text-gray-600 mt-1">Create and manage your service packages.</p>
                </div>
                <Button variant="royal" onClick={() => openModal()}>
                    <Plus className="w-4 h-4" />
                    Add Package
                </Button>
            </div>

            {/* Packages List */}
            <div className="grid gap-4">
                {isFetchingPackages ? (
                    <div className="bg-card rounded-xl shadow-card p-8 text-center h-72 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Loading packages...</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div className="p-8 text-center bg-card rounded-xl shadow-card h-72 flex flex-col items-center justify-center">
                        <p className="text-gray-600 mb-4">No packages found. Create your first package to get started.</p>
                        <Button variant="royal" onClick={() => openModal()}>
                            <Plus className="w-4 h-4" />
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
                                            <p className="text-gold text-2xl font-bold">{formatPrice(pkg.price)}</p>
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

            {/* Modal - FIXED POSITIONING */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingId ? 'Edit Package' : 'Create New Package'}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {editingId ? 'Update your package details' : 'Add a new service package to your offerings'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Image Upload Section */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Package Preview Image
                                </label>
                                <div className="flex items-center gap-6">
                                    {formData.preview && (
                                        <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md border-2 border-blue-200">
                                            <Image
                                                src={formData.preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                height={100}
                                                width={100}
                                            />
                                        </div>
                                    )}
                                    <label className="flex-1 flex flex-col items-center gap-3 px-6 py-8 bg-white rounded-xl cursor-pointer hover:bg-blue-50 transition-all border-2 border-dashed border-blue-300 hover:border-blue-500">
                                        <Upload className="w-8 h-8 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {isUploading ? 'Uploading...' : 'Click to upload image'}
                                        </span>
                                        <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
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

                            {/* Package Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Package Name *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Royal Heritage Package"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            {/* Price and Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="500000"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Duration *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="3 Days"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what makes this package special..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Deliverables */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Deliverables (one per line) *
                                </label>
                                <textarea
                                    required
                                    value={formData.deliverables}
                                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                                    placeholder="3 Days Full Coverage&#10;Cinematic Wedding Film&#10;500+ Edited Photos&#10;Online Gallery"
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none font-mono text-sm"
                                />
                            </div>

                            {/* Popular Checkbox */}
                            <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200">
                                <input
                                    type="checkbox"
                                    checked={formData.popular}
                                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                <div>
                                    <span className="text-sm font-semibold text-gray-900">Mark as Popular</span>
                                    <p className="text-xs text-gray-600">This package will be highlighted to customers</p>
                                </div>
                            </label>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading && (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    )}
                                    {editingId ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}