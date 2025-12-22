'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Instagram, Upload, Calendar, TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types/user';
import { Button } from '@/app/src/components/ui/button';


interface Props {
    initialTeam: User[];
}

export default function TeamManagementClient({ initialTeam }: Props) {
    const router = useRouter();
    const [team, setTeam] = useState<User[]>(initialTeam);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<User | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        specialization: '',
        photo: '',
        experience: '',
        bio: '',
        instagram: '',
        email: '',
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
            email: '',
        });
        setEditingId(null);
    };

    const openModal = (member?: User) => {
        if (member) {
            setEditingId(member.id);
            setFormData({
                name: member.name || '',
                role: member.role,
                specialization: member.teamProfile?.specialization || '',
                photo: member.image || '',
                experience: member.teamProfile?.experience || '',
                bio: member.teamProfile?.bio || '',
                instagram: member.teamProfile?.instagram || '',
                email: member.email || '',
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const openDetailModal = (member: User) => {
        setSelectedMember(member);
        setIsDetailModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const { url } = await response.json();
                setFormData(prev => ({ ...prev, photo: url }));
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

        try {
            if (editingId) {
                console.log("Updating member with ID:", editingId);
                console.log("Sending data:", formData);

                // Update existing member
                const response = await fetch(`/api/admin/team/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                console.log("Update response:", result);

                if (response.ok) {
                    setTeam(prev => prev.map(m => m.id === editingId ? result.member : m));
                    alert('Team member updated successfully!');
                } else {
                    alert(`Error: ${result.error}`);
                    return;
                }
            } else {
                console.log("Creating new member with data:", formData);

                // Create new member
                const response = await fetch('/api/admin/team', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                console.log("Create response:", result);

                if (response.ok) {
                    setTeam(prev => [...prev, result.member]);
                    alert('Team member added successfully!');
                } else {
                    alert(`Error: ${result.error}`);
                    return;
                }
            }

            setIsModalOpen(false);
            resetForm();
            router.refresh();
            setLoading(false);
        } catch (error) {
            console.error('Submit error:', error);
            alert('Error saving team member');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;

        try {
            const response = await fetch(`/api/admin/team/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTeam(prev => prev.filter(m => m.id !== id));
                alert('Team member removed successfully!');
                router.refresh();
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting team member');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end">
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 text-sm text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Member</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Attendance</th>
                            <th className="p-3">Progress</th>
                            <th className="p-3">Assignments</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="h-72 text-center align-middle">
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-muted-foreground" />
                                        <p className="text-muted-foreground">Loading gallery...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : team.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center">
                                    <p className="text-muted-foreground mb-4">
                                        No team members found. Add your first member to get started.
                                    </p>
                                    <Button variant="royal" onClick={() => setIsModalOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Member
                                    </Button>
                                </td>
                            </tr>
                        ) : (
                            team.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={member.image || ''}
                                                    alt={member.name || ''}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-3 text-center">{member.role}</td>

                                    <td className="p-3">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openDetailModal(member)}>
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button onClick={() => openModal(member)}>
                                                <Edit className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button onClick={() => handleDelete(member.id)}>
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>



            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">
                                {editingId ? 'Edit Team Member' : 'Add Team Member'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    {formData.photo && (
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={formData.photo}
                                                alt="Preview"
                                                className="object-cover"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Arjun Kapoor"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role *</label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="" disabled>
                                            Select role
                                        </option>
                                        <option value="customer">Customer</option>
                                        <option value="team">Team</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Experience *</label>
                                    <input
                                        required
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="12 Years"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Specialization *</label>
                                    <input
                                        required
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Candid Photography"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Bio *</label>
                                <textarea
                                    required
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="A brief description..."
                                    rows={3}
                                />
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="example@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Instagram Handle</label>
                                    <input
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="@username"
                                    />
                                </div>
                                
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                                        disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && (
                                        <span
                                            className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                            aria-hidden
                                        />
                                    )}

                                    <span>
                                        {editingId ? "Update" : "Add"} Member
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {isDetailModalOpen && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">Team Member Details</h2>
                            <button onClick={() => setIsDetailModalOpen(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Profile Section */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={selectedMember.image || ''}
                                        alt={selectedMember.name || ''}
                                        width={100}
                                        height={100}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name || ''}</h3>
                                    <p className="text-yellow-600 font-medium">{selectedMember.role || ''}</p>
                                    <p className="text-gray-600 text-sm mt-1">{selectedMember.teamProfile?.specialization || ''}</p>
                                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                        {selectedMember.teamProfile?.experience} Experience
                                    </div>
                                    {selectedMember.teamProfile?.instagram && (
                                        <a
                                            href={`https://instagram.com/${selectedMember.teamProfile?.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 mt-2 ml-3"
                                        >
                                            <Instagram className="w-4 h-4" />
                                            {selectedMember.teamProfile?.instagram}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Biography</h4>
                                <p className="text-gray-600 leading-relaxed">{selectedMember.teamProfile?.bio}</p>
                            </div>

                            {/* Timeline */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Joined:</span>{' '}
                                        {new Date(selectedMember.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span>{' '}
                                        {new Date(selectedMember.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        openModal(selectedMember);
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Member
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        handleDelete(selectedMember.id);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}