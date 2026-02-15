'use client'

import type React from 'react'
import Image from 'next/image'
import { Upload, Trash2, Eye, EyeOff, Save, X, Edit2, ImagePlus } from 'lucide-react'
import { PortfolioImage } from '@/lib/supabase'
import { parseImageList } from '@/components/admin_dashboard/utils'

type ProjectForm = {
    title: string
    description: string
}

type PortfolioTabProps = {
    images: PortfolioImage[]
    newProject: ProjectForm
    setNewProject: React.Dispatch<React.SetStateAction<ProjectForm>>
    newFilesKey: number
    setNewFiles: React.Dispatch<React.SetStateAction<File[]>>
    uploading: boolean
    handleCreateProject: (event: React.FormEvent<HTMLFormElement>) => void
    editingId: string | null
    editForm: ProjectForm
    setEditForm: React.Dispatch<React.SetStateAction<ProjectForm>>
    editImages: string[]
    setEditImages: React.Dispatch<React.SetStateAction<string[]>>
    editFilesKey: number
    setEditNewFiles: React.Dispatch<React.SetStateAction<File[]>>
    savingId: string | null
    saveEdit: (id: string) => void
    cancelEdit: () => void
    startEdit: (image: PortfolioImage) => void
    toggleVisibility: (id: string, currentVisibility: boolean) => void
    updateOrder: (id: string, newOrder: number) => void
    handleDelete: (image: PortfolioImage) => void
}

export default function PortfolioTab({
    images,
    newProject,
    setNewProject,
    newFilesKey,
    setNewFiles,
    uploading,
    handleCreateProject,
    editingId,
    editForm,
    setEditForm,
    editImages,
    setEditImages,
    editFilesKey,
    setEditNewFiles,
    savingId,
    saveEdit,
    cancelEdit,
    startEdit,
    toggleVisibility,
    updateOrder,
    handleDelete
}: PortfolioTabProps) {
    return (
        <section>
            <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-graphite">
                        <ImagePlus size={18} />
                        Novo projeto
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1">Titulo *</label>
                        <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                            placeholder="Ex: Apartamento Vila Nova"
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1">Descricao (opcional)</label>
                        <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white resize-none"
                            placeholder="Adicione uma descricao do projeto"
                            rows={4}
                            maxLength={500}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1">Fotos do projeto *</label>
                        <input
                            key={newFilesKey}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
                            className="w-full text-sm text-graphite/70"
                        />
                        <p className="text-xs text-graphite/60 mt-1">
                            Selecione uma ou mais imagens. Maximo 10MB por arquivo.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-button transition-colors disabled:opacity-60"
                    >
                        <Upload className="mr-2" size={18} />
                        {uploading ? 'Salvando...' : 'Salvar projeto'}
                    </button>
                </form>
            </div>

            <div className="mt-6">
                {images.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-warm-beige/80 shadow-sm">
                        <p className="text-graphite text-lg mb-2">Nenhum projeto ainda.</p>
                        <p className="text-sm text-graphite/60">
                            Crie o primeiro projeto para iniciar o portfolio.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image) => {
                            const imageList = parseImageList(image)
                            const coverImage = imageList[0]
                            return (
                                <div
                                    key={image.id}
                                    className={`bg-white rounded-2xl border border-warm-beige/80 overflow-hidden transition-all duration-200 shadow-sm ${
                                        !image.is_visible ? 'opacity-60' : ''
                                    } ${editingId === image.id ? 'ring-2 ring-olive-green' : ''}`}
                                >
                                    <div className="relative h-56 bg-off-white">
                                        {coverImage ? (
                                            <Image
                                                src={coverImage}
                                                alt={image.title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-sm text-graphite/60">
                                                Sem imagem
                                            </div>
                                        )}
                                        {!image.is_visible && (
                                            <div className="absolute inset-0 bg-graphite/60 flex items-center justify-center">
                                                <span className="text-off-white font-semibold px-3 py-1 bg-graphite/80 rounded-full text-xs">
                                                    Oculto
                                                </span>
                                            </div>
                                        )}
                                        {imageList.length > 1 && (
                                            <span className="absolute top-3 right-3 bg-graphite/80 text-off-white text-xs px-2 py-1 rounded-full">
                                                {imageList.length} fotos
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        {editingId === image.id ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Titulo *</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.title}
                                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                        placeholder="Digite o titulo do projeto"
                                                        maxLength={100}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Descricao (opcional)</label>
                                                    <textarea
                                                        value={editForm.description}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white resize-none"
                                                        rows={4}
                                                        maxLength={500}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-graphite mb-2">Fotos atuais</p>
                                                    {editImages.length === 0 ? (
                                                        <p className="text-xs text-graphite/60">Nenhuma foto restante.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {editImages.map((url) => (
                                                                <div key={url} className="relative group">
                                                                    <div className="relative h-20 rounded-md overflow-hidden">
                                                                        <Image
                                                                            src={url}
                                                                            alt="Foto do projeto"
                                                                            fill
                                                                            className="object-cover"
                                                                            unoptimized
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setEditImages((prev) => prev.filter((item) => item !== url))}
                                                                        className="absolute -top-2 -right-2 bg-graphite text-off-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        aria-label="Remover foto"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Adicionar novas fotos</label>
                                                    <input
                                                        key={editFilesKey}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => setEditNewFiles(Array.from(e.target.files || []))}
                                                        className="w-full text-sm text-graphite/70"
                                                    />
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => saveEdit(image.id)}
                                                        disabled={savingId === image.id}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-md transition-colors disabled:opacity-60"
                                                    >
                                                        <Save size={16} className="mr-2" />
                                                        {savingId === image.id ? 'Salvando...' : 'Salvar alteracoes'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="px-4 py-2 bg-warm-beige text-graphite font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-3">
                                                    <h3 className="font-semibold text-lg text-graphite mb-1" title={image.title}>
                                                        {image.title}
                                                    </h3>
                                                    <p className="text-graphite/70 text-sm min-h-[2.5rem]">
                                                        {image.description || <span className="text-graphite/40 italic">Sem descricao</span>}
                                                    </p>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="text-xs font-medium text-graphite/70 mb-1 block">Ordem de exibicao</label>
                                                    <input
                                                        type="number"
                                                        value={image.display_order}
                                                        onChange={(e) => updateOrder(image.id, parseInt(e.target.value, 10) || 0)}
                                                        className="w-full px-3 py-1.5 text-sm border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                        min="0"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(image)}
                                                        className="flex items-center justify-center px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-sm font-medium rounded-md transition-colors"
                                                    >
                                                        <Edit2 size={16} className="mr-1.5" />
                                                        Editar projeto
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleVisibility(image.id, image.is_visible)}
                                                        className={`flex items-center justify-center px-3 py-2 text-off-white text-sm font-medium rounded-md transition-colors ${
                                                            image.is_visible
                                                                ? 'bg-graphite hover:bg-graphite/90'
                                                                : 'bg-olive-green hover:bg-olive-green/90'
                                                        }`}
                                                        title={image.is_visible ? 'Ocultar projeto' : 'Mostrar projeto'}
                                                    >
                                                        {image.is_visible ? (
                                                            <>
                                                                <EyeOff size={16} className="mr-1.5" />
                                                                Ocultar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye size={16} className="mr-1.5" />
                                                                Mostrar
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(image)}
                                                    className="w-full mt-2 flex items-center justify-center px-3 py-2 bg-warm-beige text-graphite text-sm font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                    title="Excluir projeto"
                                                >
                                                    <Trash2 size={16} className="mr-1.5" />
                                                    Excluir projeto
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
