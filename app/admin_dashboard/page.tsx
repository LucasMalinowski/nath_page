'use client'

import { useState, useEffect } from 'react'
import { supabase, PortfolioImage, BrandAsset, SiteMedia } from '@/lib/supabase'
import { Upload, Trash2, Eye, EyeOff, Save, X, Edit2, CheckCircle2, ImagePlus } from 'lucide-react'
import Image from 'next/image'

export default function AdminDashboard() {
    const assetLocationOptions = [
        { value: 'navbar', label: 'Menu' },
        { value: 'hero', label: 'Hero' },
        { value: 'footer', label: 'Rodape' }
    ]
    const assetDefaultSizes = {
        navbar: { width: 48, height: 48 },
        hero: { width: 160, height: 160 },
        footer: { width: 64, height: 64 }
    }
    const assetSizeLimits = { min: 24, max: 300 }

    const publicBrandAssets = [
        { id: 'nm-logo', title: 'Logo NM', image_url: '/nm-logo.png' },
        { id: 'nm-logo-black', title: 'Logo NM Preto', image_url: '/nm-logo-black.png' },
        { id: 'nm-logo-white', title: 'Logo NM Branco', image_url: '/nm-logo-white.png' },
        { id: 'nm-logo-green', title: 'Logo NM Verde', image_url: '/nm-logo-green.png' },
        { id: 'nm-nathalia-black', title: 'Logo NM Nathalia Preto', image_url: '/nm-nathalia-black.png' },
        { id: 'nm-nathalia-green', title: 'Logo NM Nathalia Verde', image_url: '/nm-nathalia-green.png' },
        { id: 'nm-nathalia-white', title: 'Logo NM Nathalia Branco', image_url: '/nm-nathalia-white.png' },
        { id: 'nathalia-black', title: 'Nathalia Preto', image_url: '/nathalia-black.png' },
        { id: 'nathalia-green', title: 'Nathalia Verde', image_url: '/nathalia-green.png' },
        { id: 'nathalia-white', title: 'Nathalia Branco', image_url: '/nathalia-white.png' }
    ]

    const publicSiteMedia = {
        background_texture: { title: 'Textura de Fundo', url: '/background-texture.jpeg' },
        hero_video: { title: 'Video do Hero', url: '/hero-video.mp4' }
    }

    const [images, setImages] = useState<PortfolioImage[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '' })
    const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
    const [assetsLoading, setAssetsLoading] = useState(true)
    const [assetUploading, setAssetUploading] = useState(false)
    const [assetForm, setAssetForm] = useState({
        title: '',
        location: 'navbar',
        width_px: '',
        height_px: ''
    })
    const [assetFile, setAssetFile] = useState<File | null>(null)
    const [activeTab, setActiveTab] = useState<'portfolio' | 'brand'>('portfolio')
    const [publicAssetPlacement, setPublicAssetPlacement] = useState<Record<string, string>>({})
    const [publicAssetSize, setPublicAssetSize] = useState<Record<string, { width: string; height: string }>>({})
    const [assetSizeEdits, setAssetSizeEdits] = useState<Record<string, { width: string; height: string }>>({})
    const [siteMedia, setSiteMedia] = useState<Record<string, SiteMedia>>({})
    const [siteMediaLoading, setSiteMediaLoading] = useState(true)
    const [siteMediaUploading, setSiteMediaUploading] = useState<string | null>(null)
    const [siteMediaFiles, setSiteMediaFiles] = useState<Record<string, File | null>>({
        background_texture: null,
        hero_video: null
    })

    useEffect(() => {
        fetchImages()
        fetchBrandAssets()
        fetchSiteMedia()
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
            alert('Erro ao carregar imagens')
        } finally {
            setLoading(false)
        }
    }

    const fetchBrandAssets = async () => {
        try {
            const { data, error } = await supabase
                .from('brand_assets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setBrandAssets(data || [])
        } catch (error) {
            console.error('Error fetching brand assets:', error)
            alert('Erro ao carregar ativos de marca')
        } finally {
            setAssetsLoading(false)
        }
    }

    const fetchSiteMedia = async () => {
        try {
            const { data, error } = await supabase
                .from('site_media')
                .select('*')

            if (error) throw error
            const mediaMap = (data || []).reduce<Record<string, SiteMedia>>((acc, item) => {
                acc[item.key] = item
                return acc
            }, {})
            setSiteMedia(mediaMap)
        } catch (error) {
            console.error('Error fetching site media:', error)
            alert('Erro ao carregar midias do site')
        } finally {
            setSiteMediaLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Envie um arquivo de imagem')
            return
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('O arquivo deve ter menos de 10MB')
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
            alert('Imagem enviada com sucesso!')
        } catch (error: any) {
            console.error('Error uploading:', error)
            alert(`Erro ao enviar imagem: ${error.message || 'Erro desconhecido'}. Veja o console para mais detalhes.`)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const getDefaultSizeForLocation = (location: string) =>
        assetDefaultSizes[location as keyof typeof assetDefaultSizes] || { width: 48, height: 48 }

    const getAssetSize = (location: string, asset?: BrandAsset | null) => {
        const fallback = getDefaultSizeForLocation(location)
        return {
            width: asset?.width_px ?? fallback.width,
            height: asset?.height_px ?? fallback.height
        }
    }

    const normalizeSizeValue = (value: string) => {
        const parsed = Number.parseInt(value, 10)
        if (!Number.isFinite(parsed)) return null
        const clamped = Math.min(assetSizeLimits.max, Math.max(assetSizeLimits.min, parsed))
        return clamped
    }

    const getActiveAsset = (location: string) =>
        brandAssets.find((asset) => asset.location === location && asset.is_active) || null

    const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setAssetFile(file)
    }

    const handleAssetUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!assetFile) {
            alert('Selecione um arquivo de imagem')
            return
        }

        if (!assetFile.type.startsWith('image/')) {
            alert('Envie um arquivo de imagem')
            return
        }

        if (assetFile.size > 5 * 1024 * 1024) { // 5MB limit for icons/logos
            alert('O arquivo deve ter menos de 5MB')
            return
        }

        setAssetUploading(true)
        try {
            const fileExt = assetFile.name.split('.').pop() || 'png'
            const fileName = `${assetForm.location}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('brand-assets')
                .upload(fileName, assetFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('brand-assets')
                .getPublicUrl(fileName)

            const { error: resetError } = await supabase
                .from('brand_assets')
                .update({ is_active: false })
                .eq('location', assetForm.location)

            if (resetError) throw resetError

            const { error: insertError } = await supabase
                .from('brand_assets')
                .insert({
                    title: assetForm.title.trim() || assetFile.name.replace(/\.[^/.]+$/, ''),
                    image_url: publicUrl,
                    location: assetForm.location,
                    is_active: true,
                    width_px: normalizeSizeValue(assetForm.width_px),
                    height_px: normalizeSizeValue(assetForm.height_px)
                })

            if (insertError) throw insertError

            await fetchBrandAssets()
            setAssetFile(null)
            setAssetForm({
                title: '',
                location: assetForm.location,
                width_px: '',
                height_px: ''
            })
            alert('Ativo de marca enviado com sucesso!')
        } catch (error: any) {
            console.error('Error uploading brand asset:', error)
            alert(`Erro ao enviar ativo de marca: ${error.message || 'Erro desconhecido'}. Veja o console para mais detalhes.`)
        } finally {
            setAssetUploading(false)
        }
    }

    const setActiveAsset = async (asset: BrandAsset) => {
        try {
            const { error: resetError } = await supabase
                .from('brand_assets')
                .update({ is_active: false })
                .eq('location', asset.location)

            if (resetError) throw resetError

            const { error } = await supabase
                .from('brand_assets')
                .update({ is_active: true })
                .eq('id', asset.id)

            if (error) throw error

            await fetchBrandAssets()
        } catch (error) {
            console.error('Error setting active asset:', error)
            alert('Erro ao atualizar ativo em uso')
        }
    }

    const updateAssetSize = async (assetId: string, width: string, height: string) => {
        try {
            const { error } = await supabase
                .from('brand_assets')
                .update({
                    width_px: normalizeSizeValue(width),
                    height_px: normalizeSizeValue(height)
                })
                .eq('id', assetId)

            if (error) throw error

            await fetchBrandAssets()
            alert('Tamanho do ativo atualizado!')
        } catch (error) {
            console.error('Error updating asset size:', error)
            alert('Erro ao atualizar tamanho do ativo')
        }
    }

    const getPublicPlacement = (assetId: string) =>
        publicAssetPlacement[assetId] || 'navbar'

    const getPublicSize = (assetId: string, location: string) => {
        const fallback = getDefaultSizeForLocation(location)
        return publicAssetSize[assetId] || { width: String(fallback.width), height: String(fallback.height) }
    }

    const setPublicPlacement = (assetId: string, location: string) => {
        setPublicAssetPlacement((prev) => ({ ...prev, [assetId]: location }))
    }

    const updatePublicAssetSize = (assetId: string, next: { width: string; height: string }) => {
        setPublicAssetSize((prev) => ({ ...prev, [assetId]: next }))
    }

    const setPublicAssetActive = async (
        asset: { title: string; image_url: string },
        location: string,
        size: { width: string; height: string }
    ) => {
        try {
            const { error: resetError } = await supabase
                .from('brand_assets')
                .update({ is_active: false })
                .eq('location', location)

            if (resetError) throw resetError

            const { error: insertError } = await supabase
                .from('brand_assets')
                .insert({
                    title: asset.title,
                    image_url: asset.image_url,
                    location,
                    is_active: true,
                    width_px: normalizeSizeValue(size.width),
                    height_px: normalizeSizeValue(size.height)
                })

            if (insertError) throw insertError

            await fetchBrandAssets()
        } catch (error) {
            console.error('Error activating public asset:', error)
            alert('Erro ao ativar ativo publico')
        }
    }

    const getSiteMedia = (key: string) => siteMedia[key] || null

    const handleSiteMediaFileChange = (key: string, file: File | null) => {
        setSiteMediaFiles((prev) => ({ ...prev, [key]: file }))
    }

    const saveSiteMedia = async (key: string, title: string, url: string) => {
        const { error } = await supabase
            .from('site_media')
            .upsert({ key, title, url }, { onConflict: 'key' })

        if (error) throw error
    }

    const uploadSiteMedia = async (key: string, title: string, file: File) => {
        setSiteMediaUploading(key)
        try {
            const fileExt = file.name.split('.').pop() || 'bin'
            const fileName = `${key}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

            const bucket = 'site-media'
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)

            await saveSiteMedia(key, title, publicUrl)
            await fetchSiteMedia()
            setSiteMediaFiles((prev) => ({ ...prev, [key]: null }))
            alert(`${title} atualizado com sucesso!`)
        } catch (error: any) {
            console.error('Error updating site media:', error)
            alert(`Erro ao atualizar ${title.toLowerCase()}: ${error.message || 'Erro desconhecido'}`)
        } finally {
            setSiteMediaUploading(null)
        }
    }

    const usePublicSiteMedia = async (key: string) => {
        const fallback = publicSiteMedia[key as keyof typeof publicSiteMedia]
        if (!fallback) return

        try {
            await saveSiteMedia(key, fallback.title, fallback.url)
            await fetchSiteMedia()
            alert(`${fallback.title} definido para o padrao publico!`)
        } catch (error) {
            console.error('Error setting public site media:', error)
            alert('Erro ao definir midia publica')
        }
    }

    const updateAssetLocation = async (id: string, newLocation: string) => {
        try {
            const { error } = await supabase
                .from('brand_assets')
                .update({ location: newLocation, is_active: false })
                .eq('id', id)

            if (error) throw error

            await fetchBrandAssets()
        } catch (error) {
            console.error('Error updating asset location:', error)
            alert('Erro ao atualizar local do ativo')
        }
    }

    const handleAssetDelete = async (asset: BrandAsset) => {
        if (!confirm('Tem certeza que deseja excluir este ativo de marca?')) return

        try {
            const urlParts = asset.image_url.split('/brand-assets/')
            if (urlParts.length > 1) {
                const filePath = urlParts[1]
                const { error: storageError } = await supabase.storage
                    .from('brand-assets')
                    .remove([filePath])

                if (storageError) {
                    console.warn('Storage delete error:', storageError)
                }
            }

            const { error } = await supabase
                .from('brand_assets')
                .delete()
                .eq('id', asset.id)

            if (error) throw error

            await fetchBrandAssets()
        } catch (error) {
            console.error('Error deleting brand asset:', error)
            alert('Erro ao excluir ativo de marca')
        }
    }

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) return

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
            alert('Imagem excluida com sucesso!')
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Erro ao excluir imagem')
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
            alert('Erro ao atualizar visibilidade')
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
            alert('O titulo nao pode ficar vazio')
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
            alert('Imagem atualizada com sucesso!')
        } catch (error) {
            console.error('Error updating:', error)
            alert('Erro ao atualizar imagem')
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
            alert('Erro ao atualizar ordem')
        }
    }

    const navbarAsset = getActiveAsset('navbar')
    const heroAsset = getActiveAsset('hero')
    const footerAsset = getActiveAsset('footer')
    const navbarSize = getAssetSize('navbar', navbarAsset)
    const heroSize = getAssetSize('hero', heroAsset)
    const footerSize = getAssetSize('footer', footerAsset)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-lg font-medium text-graphite">Carregando painel...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-off-white">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-graphite/70 font-sans">Admin</p>
                        <h1 className="text-3xl font-serif text-graphite">Painel</h1>
                        <p className="text-sm text-graphite/70 mt-1">
                            Atualize imagens do portfolio, ativos de marca e midias do site.
                        </p>
                    </div>
                    <div className="text-xs text-graphite/60 font-sans">
                        Aba ativa: {activeTab === 'portfolio' ? 'Imagens do Portfolio' : 'Marca e Midia'}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 border-b border-warm-beige pb-4">
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'portfolio'
                                ? 'bg-olive-green text-off-white'
                                : 'bg-warm-beige/60 text-graphite hover:bg-warm-beige'
                        }`}
                        aria-pressed={activeTab === 'portfolio'}
                        type="button"
                    >
                        Imagens do Portfolio
                    </button>
                    <button
                        onClick={() => setActiveTab('brand')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'brand'
                                ? 'bg-olive-green text-off-white'
                                : 'bg-warm-beige/60 text-graphite hover:bg-warm-beige'
                        }`}
                        aria-pressed={activeTab === 'brand'}
                        type="button"
                    >
                        Marca e Midia
                    </button>
                </div>

                {activeTab === 'brand' && (
                    <section className="mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Upload Form */}
                            <form onSubmit={handleAssetUpload} className="bg-white rounded-2xl border border-warm-beige/80 p-6 space-y-4 shadow-sm">
                                <div className="flex items-center gap-2 text-sm font-semibold text-graphite">
                                    <ImagePlus size={18} />
                                    Adicionar novo ativo
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-graphite mb-1">
                                        Titulo
                                    </label>
                                    <input
                                        type="text"
                                        value={assetForm.title}
                                        onChange={(e) => setAssetForm({ ...assetForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                        placeholder="Ex: Logo branco"
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-graphite mb-1">
                                        Local
                                    </label>
                                <select
                                    value={assetForm.location}
                                    onChange={(e) => {
                                        const nextLocation = e.target.value
                                        const defaults = getDefaultSizeForLocation(nextLocation)
                                        setAssetForm({
                                            ...assetForm,
                                            location: nextLocation,
                                            width_px: assetForm.width_px || String(defaults.width),
                                            height_px: assetForm.height_px || String(defaults.height)
                                        })
                                    }}
                                    className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                >
                                    {assetLocationOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-graphite mb-1">
                                        Arquivo de imagem *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAssetFileChange}
                                        className="w-full text-sm text-graphite/70"
                                    />
                                    <p className="text-xs text-graphite/60 mt-1">
                                        Maximo 5MB. PNG/SVG transparente recomendado.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-graphite/70 mb-1">
                                            Largura (px)
                                        </label>
                                        <input
                                            type="number"
                                            min={assetSizeLimits.min}
                                            max={assetSizeLimits.max}
                                            value={assetForm.width_px}
                                            onChange={(e) => setAssetForm({ ...assetForm, width_px: e.target.value })}
                                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white text-sm"
                                            placeholder={String(getDefaultSizeForLocation(assetForm.location).width)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-graphite/70 mb-1">
                                            Altura (px)
                                        </label>
                                        <input
                                            type="number"
                                            min={assetSizeLimits.min}
                                            max={assetSizeLimits.max}
                                            value={assetForm.height_px}
                                            onChange={(e) => setAssetForm({ ...assetForm, height_px: e.target.value })}
                                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white text-sm"
                                            placeholder={String(getDefaultSizeForLocation(assetForm.location).height)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={assetUploading}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white font-medium rounded-md transition-colors disabled:opacity-60"
                                >
                                    <Upload className="mr-2" size={16} />
                                    {assetUploading ? 'Enviando...' : 'Enviar ativo'}
                                </button>
                            </form>

                            {/* Preview */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
                                <div>
                                    <h3 className="text-sm font-semibold text-graphite">Previa de posicionamento</h3>
                                    <p className="text-xs text-graphite/60">Ativos ativos por local</p>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <div className="flex items-center justify-between bg-off-white rounded-xl px-4 py-3 border border-warm-beige/60">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-graphite/60">Menu</p>
                                            <p className="text-sm text-graphite">Topo da navegacao</p>
                                        </div>
                                        <div
                                            className="relative bg-white rounded-md border border-warm-beige flex items-center justify-center"
                                            style={{ width: navbarSize.width, height: navbarSize.height }}
                                        >
                                            {navbarAsset ? (
                                                <Image
                                                    src={navbarAsset.image_url}
                                                    alt={navbarAsset.title}
                                                    fill
                                                    className="object-contain p-2"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-xs text-graphite/50">Nenhum</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-off-white rounded-xl px-4 py-6 flex items-center justify-between border border-warm-beige/60">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-graphite/60">Hero</p>
                                            <p className="text-sm text-graphite">Destaque da home</p>
                                        </div>
                                        <div
                                            className="relative bg-white rounded-full border border-warm-beige flex items-center justify-center"
                                            style={{ width: heroSize.width, height: heroSize.height }}
                                        >
                                            {heroAsset ? (
                                                <Image
                                                    src={heroAsset.image_url}
                                                    alt={heroAsset.title}
                                                    fill
                                                    className="object-contain p-3"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-xs text-graphite/50">Nenhum</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-off-white rounded-xl px-4 py-3 border border-warm-beige/60">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-graphite/60">Rodape</p>
                                            <p className="text-sm text-graphite">Barra inferior</p>
                                        </div>
                                        <div
                                            className="relative bg-white rounded-md border border-warm-beige flex items-center justify-center"
                                            style={{ width: footerSize.width, height: footerSize.height }}
                                        >
                                            {footerAsset ? (
                                                <Image
                                                    src={footerAsset.image_url}
                                                    alt={footerAsset.title}
                                                    fill
                                                    className="object-contain p-2"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-xs text-graphite/50">Nenhum</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-graphite mb-3">Biblioteca de ativos</h3>
                            {assetsLoading ? (
                                <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 text-graphite/70 shadow-sm">
                                    Carregando ativos de marca...
                                </div>
                            ) : brandAssets.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 text-graphite/70 shadow-sm">
                                    Nenhum ativo de marca ainda. Envie o primeiro acima.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {brandAssets.map((asset) => {
                                        const editSize = assetSizeEdits[asset.id] || {
                                            width: asset.width_px?.toString() || '',
                                            height: asset.height_px?.toString() || ''
                                        }

                                        return (
                                            <div key={asset.id} className="bg-white rounded-2xl border border-warm-beige/80 p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="relative w-14 h-14 bg-off-white rounded-md border border-warm-beige">
                                                    <Image
                                                        src={asset.image_url}
                                                        alt={asset.title}
                                                        fill
                                                        className="object-contain p-2"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-graphite">{asset.title}</p>
                                                    <p className="text-xs text-graphite/60 mt-0.5">
                                                        Location: {assetLocationOptions.find((option) => option.value === asset.location)?.label || asset.location}
                                                    </p>
                                                    {asset.is_active && (
                                                        <p className="mt-1 inline-flex items-center text-xs font-medium text-olive-green bg-olive-green/10 px-2 py-0.5 rounded-full">
                                                            Ativo
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <label className="block text-xs font-medium text-graphite/70 mb-1">
                                                    Alterar local
                                                </label>
                                                <select
                                                    value={asset.location}
                                                    onChange={(e) => updateAssetLocation(asset.id, e.target.value)}
                                                    className="w-full px-2 py-1.5 text-sm border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                >
                                                    {assetLocationOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-graphite/70 mb-1">
                                                        Largura (px)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={assetSizeLimits.min}
                                                        max={assetSizeLimits.max}
                                                        value={editSize.width}
                                                        onChange={(e) => setAssetSizeEdits((prev) => ({
                                                            ...prev,
                                                            [asset.id]: { ...editSize, width: e.target.value }
                                                        }))}
                                                        className="w-full px-2 py-1.5 text-xs border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                        placeholder={String(getDefaultSizeForLocation(asset.location).width)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-graphite/70 mb-1">
                                                        Altura (px)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={assetSizeLimits.min}
                                                        max={assetSizeLimits.max}
                                                        value={editSize.height}
                                                        onChange={(e) => setAssetSizeEdits((prev) => ({
                                                            ...prev,
                                                            [asset.id]: { ...editSize, height: e.target.value }
                                                        }))}
                                                        className="w-full px-2 py-1.5 text-xs border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                        placeholder={String(getDefaultSizeForLocation(asset.location).height)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => setActiveAsset(asset)}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-olive-green hover:bg-olive-green/90 text-off-white text-xs font-medium rounded-md transition-colors"
                                                >
                                                    <CheckCircle2 size={14} className="mr-1.5" />
                                                    Definir como ativo
                                                </button>
                                                <button
                                                    onClick={() => updateAssetSize(asset.id, editSize.width, editSize.height)}
                                                    className="px-3 py-2 bg-warm-beige text-graphite text-xs font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                >
                                                    Salvar tamanho
                                                </button>
                                                <button
                                                    onClick={() => handleAssetDelete(asset)}
                                                    className="px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-xs font-medium rounded-md transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-semibold text-graphite mb-3">Ativos publicos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {publicBrandAssets.map((asset) => {
                                    const location = getPublicPlacement(asset.id)
                                    const size = getPublicSize(asset.id, location)

                                    return (
                                        <div key={asset.id} className="bg-white rounded-2xl border border-warm-beige/80 p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="relative w-14 h-14 bg-off-white rounded-md border border-warm-beige">
                                                <Image
                                                    src={asset.image_url}
                                                    alt={asset.title}
                                                    fill
                                                    className="object-contain p-2"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-graphite">{asset.title}</p>
                                                <p className="text-xs text-graphite/60 mt-0.5">Disponivel em /public</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-graphite/70 mb-1">
                                                Escolha o local
                                            </label>
                                            <select
                                                value={location}
                                                onChange={(e) => setPublicPlacement(asset.id, e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                            >
                                                {assetLocationOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[11px] font-medium text-graphite/70 mb-1">
                                                    Largura (px)
                                                </label>
                                                <input
                                                    type="number"
                                                    min={assetSizeLimits.min}
                                                    max={assetSizeLimits.max}
                                                    value={size.width}
                                                    onChange={(e) => updatePublicAssetSize(asset.id, { ...size, width: e.target.value })}
                                                    className="w-full px-2 py-1.5 text-xs border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-graphite/70 mb-1">
                                                    Altura (px)
                                                </label>
                                                <input
                                                    type="number"
                                                    min={assetSizeLimits.min}
                                                    max={assetSizeLimits.max}
                                                    value={size.height}
                                                    onChange={(e) => updatePublicAssetSize(asset.id, { ...size, height: e.target.value })}
                                                    className="w-full px-2 py-1.5 text-xs border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setPublicAssetActive(asset, location, size)}
                                            className="mt-3 w-full inline-flex items-center justify-center px-3 py-2 bg-olive-green hover:bg-olive-green/90 text-off-white text-xs font-medium rounded-md transition-colors"
                                        >
                                            <CheckCircle2 size={14} className="mr-1.5" />
                                            Definir como ativo
                                        </button>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-semibold text-graphite mb-3">Midias do site</h3>
                            {siteMediaLoading ? (
                                <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 text-graphite/70 shadow-sm">
                                    Carregando midias do site...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl border border-warm-beige/80 p-5 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-graphite">Textura de fundo</p>
                                                <p className="text-xs text-graphite/60">Usada na textura de papel.</p>
                                            </div>
                                            <div className="relative w-16 h-16 bg-off-white rounded-md border border-warm-beige overflow-hidden">
                                                {getSiteMedia('background_texture') ? (
                                                    <Image
                                                        src={getSiteMedia('background_texture')!.url}
                                                        alt={getSiteMedia('background_texture')!.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <Image
                                                        src={publicSiteMedia.background_texture.url}
                                                        alt={publicSiteMedia.background_texture.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleSiteMediaFileChange('background_texture', e.target.files?.[0] || null)}
                                                className="w-full text-sm text-graphite/70"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const file = siteMediaFiles.background_texture
                                                        if (file) {
                                                            uploadSiteMedia('background_texture', 'Textura de fundo', file)
                                                        } else {
                                                            alert('Selecione um arquivo de textura primeiro')
                                                        }
                                                    }}
                                                    disabled={siteMediaUploading === 'background_texture'}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-xs font-medium rounded-md transition-colors disabled:opacity-60"
                                                >
                                                    {siteMediaUploading === 'background_texture' ? 'Enviando...' : 'Enviar textura'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => usePublicSiteMedia('background_texture')}
                                                    className="px-3 py-2 bg-warm-beige text-graphite text-xs font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                >
                                                    Usar padrao
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-warm-beige/80 p-5 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-graphite">Video do hero</p>
                                                <p className="text-xs text-graphite/60">Video de fundo da secao hero.</p>
                                            </div>
                                            <div className="w-28 h-16 bg-off-white rounded-md border border-warm-beige overflow-hidden flex items-center justify-center">
                                                <video
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    playsInline
                                                    loop
                                                >
                                                    <source src={getSiteMedia('hero_video')?.url || publicSiteMedia.hero_video.url} type="video/mp4" />
                                                </video>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleSiteMediaFileChange('hero_video', e.target.files?.[0] || null)}
                                                className="w-full text-sm text-graphite/70"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const file = siteMediaFiles.hero_video
                                                        if (file) {
                                                            uploadSiteMedia('hero_video', 'Video do hero', file)
                                                        } else {
                                                            alert('Selecione um arquivo de video primeiro')
                                                        }
                                                    }}
                                                    disabled={siteMediaUploading === 'hero_video'}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-xs font-medium rounded-md transition-colors disabled:opacity-60"
                                                >
                                                    {siteMediaUploading === 'hero_video' ? 'Enviando...' : 'Enviar video'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => usePublicSiteMedia('hero_video')}
                                                    className="px-3 py-2 bg-warm-beige text-graphite text-xs font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                >
                                                    Usar padrao
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'portfolio' && (
                    <section className="mt-8">
                        <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                <div>
                            <h2 className="text-xl font-serif text-graphite">Imagens do Portfolio</h2>
                            <p className="text-sm text-graphite/70 mt-1">Gerencie sua galeria do portfolio.</p>
                                </div>
                                <div>
                                    <label className="inline-flex items-center px-5 py-2.5 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-button cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        <Upload className="mr-2" size={18} />
                                        {uploading ? 'Enviando...' : 'Enviar nova imagem'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUpload}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-graphite/60 mt-2">
                                        Tamanho maximo: 10MB. Formatos: JPG, PNG, GIF, WebP
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            {images.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-warm-beige/80 shadow-sm">
                                    <p className="text-graphite text-lg mb-2">Nenhuma imagem ainda.</p>
                                    <p className="text-sm text-graphite/60">
                                        Envie a primeira imagem para iniciar a galeria.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className={`bg-white rounded-2xl border border-warm-beige/80 overflow-hidden transition-all duration-200 shadow-sm ${
                                                !image.is_visible ? 'opacity-60' : ''
                                            } ${editingId === image.id ? 'ring-2 ring-olive-green' : ''}`}
                                        >
                                            {/* Image Preview */}
                                            <div className="relative h-56 bg-off-white">
                                                <Image
                                                    src={image.image_url}
                                                    alt={image.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                {!image.is_visible && (
                                                    <div className="absolute inset-0 bg-graphite/60 flex items-center justify-center">
                                                        <span className="text-off-white font-semibold px-3 py-1 bg-graphite/80 rounded-full text-xs">
                                                            Oculto
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
                                                            <label className="block text-sm font-medium text-graphite mb-1">
                                                                Titulo *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editForm.title}
                                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                                placeholder="Digite o titulo da imagem"
                                                                maxLength={100}
                                                            />
                                                            <p className="text-xs text-graphite/60 mt-1">
                                                                {editForm.title.length}/100 characters
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-graphite mb-1">
                                                                Descricao (opcional)
                                                            </label>
                                                            <textarea
                                                                value={editForm.description}
                                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white resize-none"
                                                                placeholder="Adicione uma descricao para esta imagem"
                                                                rows={4}
                                                                maxLength={500}
                                                            />
                                                            <p className="text-xs text-graphite/60 mt-1">
                                                                {editForm.description.length}/500 characters
                                                            </p>
                                                        </div>

                                                        {/* Save/Cancel Buttons */}
                                                        <div className="flex gap-2 pt-2">
                                                            <button
                                                                onClick={() => saveEdit(image.id)}
                                                                className="flex-1 flex items-center justify-center px-4 py-2 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-md transition-colors"
                                                            >
                                                                <Save size={16} className="mr-2" />
                                                                Salvar alteracoes
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="px-4 py-2 bg-warm-beige text-graphite font-medium rounded-md transition-colors hover:bg-warm-beige/80"
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
                                                            <h3 className="font-semibold text-lg text-graphite mb-1" title={image.title}>
                                                                {image.title}
                                                            </h3>
                                                            <p className="text-graphite/70 text-sm min-h-[2.5rem]">
                                                                {image.description || <span className="text-graphite/40 italic">Sem descricao</span>}
                                                            </p>
                                                        </div>

                                                        {/* Display Order */}
                                                        <div className="mb-4">
                                                            <label className="text-xs font-medium text-graphite/70 mb-1 block">
                                                                Ordem de exibicao
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={image.display_order}
                                                                onChange={(e) => updateOrder(image.id, parseInt(e.target.value) || 0)}
                                                                className="w-full px-3 py-1.5 text-sm border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                                min="0"
                                                            />
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <button
                                                                onClick={() => startEdit(image)}
                                                                className="flex items-center justify-center px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-sm font-medium rounded-md transition-colors"
                                                            >
                                                                <Edit2 size={16} className="mr-1.5" />
                                                                Editar info
                                                            </button>
                                                            <button
                                                                onClick={() => toggleVisibility(image.id, image.is_visible)}
                                                                className={`flex items-center justify-center px-3 py-2 text-off-white text-sm font-medium rounded-md transition-colors ${
                                                                    image.is_visible
                                                                        ? 'bg-graphite hover:bg-graphite/90'
                                                                        : 'bg-olive-green hover:bg-olive-green/90'
                                                                }`}
                                                                title={image.is_visible ? 'Ocultar imagem' : 'Mostrar imagem'}
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

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => handleDelete(image.id, image.image_url)}
                                                            className="w-full mt-2 flex items-center justify-center px-3 py-2 bg-warm-beige text-graphite text-sm font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                            title="Excluir imagem"
                                                        >
                                                            <Trash2 size={16} className="mr-1.5" />
                                                            Excluir imagem
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
