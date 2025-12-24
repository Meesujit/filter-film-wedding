'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/app/src/components/ui/button';
import { Package } from '@/app/types/package';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';
import toast from 'react-hot-toast';
import DeleteModal from '@/app/src/components/common/modal/delete-modal';

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
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        deliverables: '',
        duration: '',
        preview: '',
        popular: false,
    });

    /* ---------------------------------------------
       Fetch packages if not provided from server
    ---------------------------------------------- */
    useEffect(() => {
        if (!initialPackages || initialPackages.length === 0) {
            fetchPackages();
        }
    }, []);

    /* ---------------------------------------------
       Cleanup local preview object URL
    ---------------------------------------------- */
    useEffect(() => {
        return () => {
            if (localPreview) {
                URL.revokeObjectURL(localPreview);
            }
        };
    }, [localPreview]);

    const fetchPackages = async () => {
        setIsFetchingPackages(true);
        try {
            const response = await fetch('/api/admin/package', {
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok && data.packages) {
                setPackages(Array.isArray(data.packages) ? data.packages : []);
            } else {
                alert('Failed to load packages');
            }
        } catch (error) {
            console.error(error);
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
        setSelectedFile(null);
        setLocalPreview(null);
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

    const openDeleteModal = (id: string) => {
        setDeleteId(id);
        setDeleteOpen(true);
    }

    /* ---------------------------------------------
       Image upload (ONLY on submit)
    ---------------------------------------------- */
    const uploadImage = async (): Promise<string> => {
        if (!selectedFile) {
            throw new Error('No file selected');
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);

        const response = await fetch('/api/admin/upload-image', {
            method: 'POST',
            body: formDataUpload,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const { url } = await response.json();
        return url as string;
    };

    /* ---------------------------------------------
       Submit form
    ---------------------------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.preview;

            if (selectedFile) {
                setIsUploading(true);
                imageUrl = await uploadImage();
                setIsUploading(false);
            }

            const packageData = {
                name: formData.name,
                price: parseInt(formData.price),
                description: formData.description,
                deliverables: formData.deliverables.split('\n').filter(d => d.trim()),
                duration: formData.duration,
                preview:
                    imageUrl ||
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
                popular: formData.popular,
            };

            const response = await fetch(
                editingId
                    ? `/api/admin/package/${editingId}`
                    : '/api/admin/package',
                {
                    method: editingId ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(packageData),
                    credentials: 'include',
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to save package');
            }

            setPackages(prev =>
                editingId
                    ? prev.map(p => (p.id === editingId ? result.package : p))
                    : [...prev, result.package]
            );

            setIsModalOpen(false);
            resetForm();
            router.refresh();

            toast.success(`Package ${editingId ? 'updated' : 'created'} successfully`);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);

        try {
            const response = await fetch(`/api/admin/package/${deleteId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setPackages(prev => prev.filter(p => p.id !== deleteId));
                router.refresh();
                toast.success('Package deleted successfully');
            } else {
                const result = await response.json();
                toast.error(result.error || 'Failed to delete package');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete package');
        } finally {
            setDeleting(false);
            setDeleteOpen(false);
            setDeleteId(null);
        }
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);

    /* ---------------------------------------------
       Render
    ---------------------------------------------- */
    return (

        <>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Packages</h1>
                        <p className="text-muted-foreground mt-1">
                            Create and manage your service packages
                        </p>
                    </div>
                    <Button variant="royal" onClick={() => openModal()}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Package
                    </Button>
                </div>

                <div className="grid gap-4">
                    {isFetchingPackages ? (
                        <div className="h-72 flex flex-col items-center justify-center bg-card rounded-xl">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            Loading packages...
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="h-72 flex flex-col items-center justify-center bg-card rounded-xl">
                            No packages found
                        </div>
                    ) : (
                        packages.map(pkg => (
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
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteModal(pkg.id)}>
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

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-card w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl">
                            <div className="flex justify-between items-center border-b px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        {editingId ? 'Edit Package' : 'Create Package'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {editingId ? 'Update package details' : 'Add a new package'}
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                                <div className="border rounded-lg p-4">
                                    <label className="text-sm font-medium block mb-2">
                                        Package Preview Image
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        {(localPreview || formData.preview) && (
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                                <Image
                                                    src={localPreview || formData.preview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                {isUploading && (<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                                </div>)}
                                            </div>
                                        )}
                                        <label className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-lg px-4 py-5 cursor-pointer">
                                            <Upload className="w-6 h-6" />
                                            Upload image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={e => {
                                                    const file = e.target.files?.[0] || null;
                                                    setSelectedFile(file);
                                                    if (file) {
                                                        setLocalPreview(URL.createObjectURL(file));
                                                    }
                                                }}
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

                                <label className="flex gap-2 items-center">
                                    <input type="checkbox" checked={formData.popular} onChange={e => setFormData({ ...formData, popular: e.target.checked })} />
                                    Mark as Popular
                                </label>

                                <div className="flex justify-end gap-3">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="royal" type="submit" disabled={loading}>
                                        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        {editingId ? 'Update Package' : 'Create Package'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <DeleteModal
                open={deleteOpen}
                loading={deleting}
                onCancel={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Package"
                description="Are you sure you want to delete this package? This action cannot be undone."
            />

        </>
    );
}
