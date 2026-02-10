'use client'

import type React from 'react'
import Image from 'next/image'
import { Upload, Trash2, Save, X, Edit2, ImagePlus } from 'lucide-react'
import { GalleryExhibitor } from '@/lib/supabase'

type ExhibitorForm = {
    name: string
    title: string
    instagram_path: string
}

type ExhibitorsTabProps = {
    exhibitors: GalleryExhibitor[]
    exhibitorsLoading: boolean
    newExhibitor: ExhibitorForm
    setNewExhibitor: React.Dispatch<React.SetStateAction<ExhibitorForm>>
    newExhibitorFileKey: number
    setNewExhibitorFile: React.Dispatch<React.SetStateAction<File | null>>
    exhibitorUploading: boolean
    createExhibitor: (event: React.FormEvent<HTMLFormElement>) => void
    editingExhibitorId: string | null
    exhibitorEditForm: ExhibitorForm
    setExhibitorEditForm: React.Dispatch<React.SetStateAction<ExhibitorForm>>
    exhibitorEditFileKey: number
    setExhibitorEditFile: React.Dispatch<React.SetStateAction<File | null>>
    saveExhibitorEdit: (id: string) => void
    cancelExhibitorEdit: () => void
    startExhibitorEdit: (exhibitor: GalleryExhibitor) => void
    deleteExhibitor: (exhibitor: GalleryExhibitor) => void
}

export default function ExhibitorsTab({
    exhibitors,
    exhibitorsLoading,
    newExhibitor,
    setNewExhibitor,
    newExhibitorFileKey,
    setNewExhibitorFile,
    exhibitorUploading,
    createExhibitor,
    editingExhibitorId,
    exhibitorEditForm,
    setExhibitorEditForm,
    exhibitorEditFileKey,
    setExhibitorEditFile,
    saveExhibitorEdit,
    cancelExhibitorEdit,
    startExhibitorEdit,
    deleteExhibitor
}: ExhibitorsTabProps) {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-serif text-graphite">Expositores</h2>
                <p className="text-sm text-graphite/70 mt-1">Gerencie os expositores exibidos na Galeria.</p>
            </div>

            <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
                <form onSubmit={createExhibitor} className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-graphite">
                        <ImagePlus size={18} />
                        Novo expositor
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Nome *</label>
                            <input
                                type="text"
                                value={newExhibitor.name}
                                onChange={(e) => setNewExhibitor({ ...newExhibitor, name: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                placeholder="Ex: Nathalia Malinowski"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Titulo</label>
                            <input
                                type="text"
                                value={newExhibitor.title}
                                onChange={(e) => setNewExhibitor({ ...newExhibitor, title: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Instagram</label>
                            <input
                                type="text"
                                value={newExhibitor.instagram_path}
                                onChange={(e) => setNewExhibitor({ ...newExhibitor, instagram_path: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                placeholder="ex: nathalia_malinowski"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Foto *</label>
                            <input
                                key={newExhibitorFileKey}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewExhibitorFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-graphite/70"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={exhibitorUploading}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-button transition-colors disabled:opacity-60"
                    >
                        <Upload className="mr-2" size={18} />
                        {exhibitorUploading ? 'Salvando...' : 'Salvar expositor'}
                    </button>
                </form>
            </div>

            <div className="mt-6">
                {exhibitorsLoading ? (
                    <p className="text-sm text-graphite/70">Carregando expositores...</p>
                ) : exhibitors.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-warm-beige/80 shadow-sm">
                        <p className="text-graphite text-lg mb-2">Nenhum expositor ainda.</p>
                        <p className="text-sm text-graphite/60">
                            Crie o primeiro expositor para iniciar a lista.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {exhibitors.map((exhibitor) => (
                            <div
                                key={exhibitor.id}
                                className={`bg-white rounded-2xl border border-warm-beige/80 overflow-hidden transition-all duration-200 shadow-sm ${
                                    editingExhibitorId === exhibitor.id ? 'ring-2 ring-olive-green' : ''
                                }`}
                            >
                                <div className="p-4 flex gap-4">
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-off-white">
                                        {exhibitor.avatar_url && (
                                            <Image
                                                src={exhibitor.avatar_url}
                                                alt={exhibitor.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {editingExhibitorId === exhibitor.id ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Nome *</label>
                                                    <input
                                                        type="text"
                                                        value={exhibitorEditForm.name}
                                                        onChange={(e) => setExhibitorEditForm({ ...exhibitorEditForm, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Titulo</label>
                                                    <input
                                                        type="text"
                                                        value={exhibitorEditForm.title}
                                                        onChange={(e) => setExhibitorEditForm({ ...exhibitorEditForm, title: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Instagram</label>
                                                    <input
                                                        type="text"
                                                        value={exhibitorEditForm.instagram_path}
                                                        onChange={(e) => setExhibitorEditForm({ ...exhibitorEditForm, instagram_path: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Nova foto</label>
                                                    <input
                                                        key={exhibitorEditFileKey}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setExhibitorEditFile(e.target.files?.[0] || null)}
                                                        className="w-full text-sm text-graphite/70"
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => saveExhibitorEdit(exhibitor.id)}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-md transition-colors"
                                                    >
                                                        <Save size={16} className="mr-2" />
                                                        Salvar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelExhibitorEdit}
                                                        className="px-4 py-2 bg-warm-beige text-graphite font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-semibold text-lg text-graphite">{exhibitor.name}</h3>
                                                <p className="text-sm text-graphite/70 mt-1">{exhibitor.title}</p>
                                                {exhibitor.instagram_path && (
                                                    <p className="text-xs text-graphite/60 mt-2">@{exhibitor.instagram_path}</p>
                                                )}
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => startExhibitorEdit(exhibitor)}
                                                        className="flex items-center justify-center px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-sm font-medium rounded-md transition-colors"
                                                    >
                                                        <Edit2 size={16} className="mr-1.5" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteExhibitor(exhibitor)}
                                                        className="flex items-center justify-center px-3 py-2 bg-warm-beige text-graphite text-sm font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                    >
                                                        <Trash2 size={16} className="mr-1.5" />
                                                        Excluir
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
