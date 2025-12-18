'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Instagram, Upload, Calendar, TrendingUp, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types/user';

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
        assignment: [] as string[],
        progress: '0%',
        attendance: '0%',
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
            assignment: [],
            progress: '0%',
            attendance: '100%',
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
                assignment: member.teamProfile?.assignment || [],
                progress: member.teamProfile?.progress || '0%',
                attendance: member.teamProfile?.attendance || '0%',
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

    const addAssignment = () => {
        const assignment = prompt('Enter assignment:');
        if (assignment) {
            setFormData(prev => ({
                ...prev,
                assignment: [...prev.assignment, assignment],
            }));
        }
    };

    const removeAssignment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            assignment: prev.assignment.filter((_, i) => i !== index),
        }));
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

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        <div className="relative h-48">
                            <Image
                                src={member.image || ''}
                                alt={member.name || ''}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => openModal(member)}
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                                >
                                    <Edit className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                            <div className="absolute bottom-2 left-2 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full">
                                {member.teamProfile?.experience}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900">{member.email}</h3>
                            <h3 className='font-bold text-sm text-gray-800'>{member.name || ''}</h3>
                            <p className="text-yellow-600 text-sm font-medium">{member.role}</p>
                            <p className="text-gray-600 text-sm mt-1">{member.teamProfile?.specialization || ''}</p>

                            {/* Stats */}
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <Calendar className="w-3 h-3" />
                                        Attendance
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        {member.teamProfile?.attendance || '100%'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <TrendingUp className="w-3 h-3" />
                                        Progress
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                        {member.teamProfile?.progress || '0%'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <Briefcase className="w-3 h-3" />
                                        Assignments
                                    </span>
                                    <span className="font-semibold text-purple-600">
                                        {member.teamProfile?.assignment?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {member.teamProfile?.instagram && (
                                <a
                                    href={`https://instagram.com/${member.teamProfile.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 mt-3"
                                >
                                    <Instagram className="w-3 h-3" />
                                    {member.teamProfile?.instagram}
                                </a>
                            )}

                            <button
                                onClick={() => openDetailModal(member)}
                                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
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
                                                fill
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
                                    <input
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Lead Photographer"
                                    />
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
                                <div>
                                    <label className="block text-sm font-medium mb-1">Attendance</label>
                                    <input
                                        value={formData.attendance}
                                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="100%"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Progress</label>
                                <input
                                    value={formData.progress}
                                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="75%"
                                />
                            </div>

                            {/* Assignments */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium">Assignments</label>
                                    <button
                                        type="button"
                                        onClick={addAssignment}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        + Add Assignment
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.assignment.map((task, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                value={task}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAssignment(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
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

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700 mb-1">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-sm font-medium">Attendance</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {selectedMember.teamProfile?.attendance || '100%'}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="text-sm font-medium">Progress</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {selectedMember.teamProfile?.progress || '0%'}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-2 text-purple-700 mb-1">
                                        <Briefcase className="w-5 h-5" />
                                        <span className="text-sm font-medium">Assignments</span>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {selectedMember.teamProfile?.assignment?.length || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Biography</h4>
                                <p className="text-gray-600 leading-relaxed">{selectedMember.teamProfile?.bio}</p>
                            </div>

                            {/* Assignments Section */}
                            {selectedMember.teamProfile?.assignment && selectedMember.teamProfile?.assignment.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Assignments</h4>
                                    <div className="space-y-2">
                                        {selectedMember.teamProfile.assignment.map((task, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-700">{task}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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