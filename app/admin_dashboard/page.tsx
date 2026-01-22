'use client'

import { useState, useEffect } from 'react'
import { supabase, PortfolioImage } from '@/lib/supabase'
import { Upload, Trash2, Eye, EyeOff, Save, X, Edit2 } from 'lucide-react'
import Image from 'next/image'

export default function AdminDashboard() {
    const [images, setImages] = useState<PortfolioImage[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '' })

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_images')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setImages(data || [])
        } catch (error) {
            console.error('Error fetching images:', error)
            alert('Error loading images')
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('File size must be less than 10MB')
            return
        }

        setUploading(true)
        try {
            // Upload image to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(fileName)

            // Insert record into database
            const { data: insertData, error: insertError } = await supabase
                .from('portfolio_images')
                .insert({
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    description: '',
                    image_url: publicUrl,
                    display_order: images.length,
                    is_visible: true
                })
                .select()

            if (insertError) throw insertError

            await fetchImages()
            alert('Image uploaded successfully!')
        } catch (error: any) {
            console.error('Error uploading:', error)
            alert(`Error uploading image: ${error.message || 'Unknown error'}. Check console for details.`)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        try {
            // Extract file path from URL
            const urlParts = imageUrl.split('/portfolio/')
            if (urlParts.length > 1) {
                const filePath = urlParts[1]
                const { error: storageError } = await supabase.storage
                    .from('portfolio')
                    .remove([filePath])

                if (storageError) {
                    console.warn('Storage delete error:', storageError)
                }
            }

            const { error } = await supabase
                .from('portfolio_images')
                .delete()
                .eq('id', id)

            if (error) throw error

            await fetchImages()
            alert('Image deleted successfully!')
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Error deleting image')
        }
    }

    const toggleVisibility = async (id: string, currentVisibility: boolean) => {
        try {
            const { error } = await supabase
                .from('portfolio_images')
                .update({ is_visible: !currentVisibility })
                .eq('id', id)

            if (error) throw error

            await fetchImages()
        } catch (error) {
            console.error('Error toggling visibility:', error)
            alert('Error updating visibility')
        }
    }

    const startEdit = (image: PortfolioImage) => {
        setEditingId(image.id)
        setEditForm({
            title: image.title,
            description: image.description || ''
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({ title: '', description: '' })
    }

    const saveEdit = async (id: string) => {
        if (!editForm.title.trim()) {
            alert('Title cannot be empty')
            return
        }

        try {
            const { error } = await supabase
                .from('portfolio_images')
                .update({
                    title: editForm.title.trim(),
                    description: editForm.description.trim() || null
                })
                .eq('id', id)

            if (error) throw error

            await fetchImages()
            cancelEdit()
            alert('Image updated successfully!')
        } catch (error) {
            console.error('Error updating:', error)
            alert('Error updating image')
        }
    }

    const updateOrder = async (id: string, newOrder: number) => {
        try {
            const { error } = await supabase
                .from('portfolio_images')
                .update({ display_order: newOrder })
                .eq('id', id)

            if (error) throw error

            await fetchImages()
        } catch (error) {
            console.error('Error updating order:', error)
            alert('Error updating order')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Admin Dashboard</h1>
                    <p className="text-gray-600 mb-6">Manage your portfolio images</p>

                    {/* Upload Button */}
                    <label className="inline-flex items-center px-6 py-3 bg-coral-600 hover:bg-coral-700 text-white font-medium rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Upload className="mr-2" size={20} />
                        {uploading ? 'Uploading...' : 'Upload New Image'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>

                    <p className="text-sm text-gray-500 mt-2">
                        Max file size: 10MB. Supported formats: JPG, PNG, GIF, WebP
                    </p>
                </div>

                {/* Images Grid */}
                {images.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg mb-4">No images yet. Upload your first image!</p>
                        <p className="text-sm text-gray-400">
                            Click the "Upload New Image" button above to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                                    !image.is_visible ? 'opacity-60' : ''
                                } ${editingId === image.id ? 'ring-2 ring-blue-500' : ''}`}
                            >
                                {/* Image Preview */}
                                <div className="relative h-64 bg-gray-200">
                                    <Image
                                        src={image.image_url}
                                        alt={image.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {!image.is_visible && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-semibold px-3 py-1 bg-gray-900 bg-opacity-75 rounded">
                                                Hidden
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {editingId === image.id ? (
                                        /* EDIT MODE */
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter image title"
                                                    maxLength={100}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {editForm.title.length}/100 characters
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description (optional)
                                                </label>
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    placeholder="Add a description for this image"
                                                    rows={4}
                                                    maxLength={500}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {editForm.description.length}/500 characters
                                                </p>
                                            </div>

                                            {/* Save/Cancel Buttons */}
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => saveEdit(image.id)}
                                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                                                >
                                                    <Save size={16} className="mr-2" />
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* VIEW MODE */
                                        <>
                                            {/* Title */}
                                            <div className="mb-3">
                                                <h3 className="font-semibold text-lg text-gray-900 mb-1" title={image.title}>
                                                    {image.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm min-h-[2.5rem]">
                                                    {image.description || <span className="text-gray-400 italic">No description</span>}
                                                </p>
                                            </div>

                                            {/* Display Order */}
                                            <div className="mb-4">
                                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                                    Display Order:
                                                </label>
                                                <input
                                                    type="number"
                                                    value={image.display_order}
                                                    onChange={(e) => updateOrder(image.id, parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => startEdit(image)}
                                                    className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                                                >
                                                    <Edit2 size={16} className="mr-1.5" />
                                                    Edit Info
                                                </button>
                                                <button
                                                    onClick={() => toggleVisibility(image.id, image.is_visible)}
                                                    className={`flex items-center justify-center px-3 py-2 text-white text-sm font-medium rounded-md transition-colors ${
                                                        image.is_visible
                                                            ? 'bg-gray-600 hover:bg-gray-700'
                                                            : 'bg-amber-600 hover:bg-amber-700'
                                                    }`}
                                                    title={image.is_visible ? 'Hide image' : 'Show image'}
                                                >
                                                    {image.is_visible ? (
                                                        <>
                                                            <EyeOff size={16} className="mr-1.5" />
                                                            Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye size={16} className="mr-1.5" />
                                                            Show
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(image.id, image.image_url)}
                                                className="w-full mt-2 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                                                title="Delete image"
                                            >
                                                <Trash2 size={16} className="mr-1.5" />
                                                Delete Image
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}