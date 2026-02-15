'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, PortfolioImage, GalleryProduct, GalleryExhibitor } from '@/lib/supabase'
import AdminPortfolioTab from '@/components/admin_dashboard/PortfolioTab'
import AdminProductsTab from '@/components/admin_dashboard/ProductsTab'
import AdminExhibitorsTab from '@/components/admin_dashboard/ExhibitorsTab'
import { parseImageList, parseGalleryImages } from '@/components/admin_dashboard/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const getPortfolioFilePath = (url: string) => {
    const urlParts = url.split('/portfolio/')
    return urlParts.length > 1 ? urlParts[1] : null
}

const getGalleryFilePath = (url: string) => {
    const urlParts = url.split('/gallery/')
    return urlParts.length > 1 ? urlParts[1] : null
}

export default function AdminDashboard() {
    const [images, setImages] = useState<PortfolioImage[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [authError, setAuthError] = useState<string | null>(null)
    const [authForm, setAuthForm] = useState({ email: '', password: '' })
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '' })
    const [editImages, setEditImages] = useState<string[]>([])
    const [editOriginalImages, setEditOriginalImages] = useState<string[]>([])
    const [editNewFiles, setEditNewFiles] = useState<File[]>([])
    const [editFilesKey, setEditFilesKey] = useState(0)
    const [newProject, setNewProject] = useState({ title: '', description: '' })
    const [newFiles, setNewFiles] = useState<File[]>([])
    const [newFilesKey, setNewFilesKey] = useState(0)
    const [products, setProducts] = useState<GalleryProduct[]>([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [productUploading, setProductUploading] = useState(false)
    const [editingProductId, setEditingProductId] = useState<string | null>(null)
    const [productEditForm, setProductEditForm] = useState({
        name: '',
        author: '',
        description: '',
        price_text: '',
        quantity: ''
    })
    const [productEditImages, setProductEditImages] = useState<string[]>([])
    const [productEditOriginalImages, setProductEditOriginalImages] = useState<string[]>([])
    const [productEditNewFiles, setProductEditNewFiles] = useState<File[]>([])
    const [productEditFilesKey, setProductEditFilesKey] = useState(0)
    const [newProduct, setNewProduct] = useState({
        name: '',
        author: '',
        description: '',
        price_text: '',
        quantity: ''
    })
    const [newProductFiles, setNewProductFiles] = useState<File[]>([])
    const [newProductFilesKey, setNewProductFilesKey] = useState(0)
    const [exhibitors, setExhibitors] = useState<GalleryExhibitor[]>([])
    const [exhibitorsLoading, setExhibitorsLoading] = useState(true)
    const [exhibitorUploading, setExhibitorUploading] = useState(false)
    const [editingExhibitorId, setEditingExhibitorId] = useState<string | null>(null)
    const [exhibitorEditForm, setExhibitorEditForm] = useState({
        name: '',
        title: '',
        instagram_path: ''
    })
    const [exhibitorEditFile, setExhibitorEditFile] = useState<File | null>(null)
    const [exhibitorEditFileKey, setExhibitorEditFileKey] = useState(0)
    const [newExhibitor, setNewExhibitor] = useState({
        name: '',
        title: '',
        instagram_path: ''
    })
    const [newExhibitorFile, setNewExhibitorFile] = useState<File | null>(null)
    const [newExhibitorFileKey, setNewExhibitorFileKey] = useState(0)
    const [activeTab, setActiveTab] = useState<'portfolio' | 'products' | 'exhibitors'>('portfolio')

    useEffect(() => {
        let isMounted = true

        const loadSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!isMounted) return
            setUser(data.session?.user ?? null)
            setAuthLoading(false)
        }

        loadSession()

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setAuthLoading(false)
        })

        return () => {
            isMounted = false
            subscription.subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (!user) return
        fetchImages()
        fetchProducts()
        fetchExhibitors()
    }, [user])

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

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_products')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products:', error)
            alert('Erro ao carregar produtos')
        } finally {
            setProductsLoading(false)
        }
    }

    const fetchExhibitors = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_exhibitors')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setExhibitors(data || [])
        } catch (error) {
            console.error('Error fetching exhibitors:', error)
            alert('Erro ao carregar expositores')
        } finally {
            setExhibitorsLoading(false)
        }
    }

    const validateFiles = (files: File[]) => {
        if (files.length === 0) return 'Selecione pelo menos uma imagem'
        for (const file of files) {
            if (!file.type.startsWith('image/')) return 'Envie apenas arquivos de imagem'
            if (file.size > MAX_FILE_SIZE) return 'Cada arquivo deve ter menos de 10MB'
        }
        return null
    }

    const uploadPortfolioFiles = async (files: File[]) => {
        const uploads = await Promise.all(
            files.map(async (file) => {
                const fileExt = file.name.split('.').pop() || 'bin'
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('portfolio')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(fileName)

                return publicUrl
            })
        )

        return uploads
    }

    const removePortfolioFiles = async (urls: string[]) => {
        const paths = urls
            .map(getPortfolioFilePath)
            .filter((path): path is string => Boolean(path))
        if (paths.length === 0) return

        const { error } = await supabase.storage
            .from('portfolio')
            .remove(paths)

        if (error) {
            console.warn('Storage delete error:', error)
        }
    }

    const uploadGalleryFiles = async (files: File[], folder: string) => {
        const uploads = await Promise.all(
            files.map(async (file) => {
                const fileExt = file.name.split('.').pop() || 'bin'
                const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('gallery')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(fileName)

                return publicUrl
            })
        )

        return uploads
    }

    const removeGalleryFiles = async (urls: string[]) => {
        const paths = urls
            .map(getGalleryFilePath)
            .filter((path): path is string => Boolean(path))
        if (paths.length === 0) return

        const { error } = await supabase.storage
            .from('gallery')
            .remove(paths)

        if (error) {
            console.warn('Storage delete error:', error)
        }
    }

    const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!newProject.title.trim()) {
            alert('O titulo nao pode ficar vazio')
            return
        }

        const validationError = validateFiles(newFiles)
        if (validationError) {
            alert(validationError)
            return
        }

        setUploading(true)
        try {
            const urls = await uploadPortfolioFiles(newFiles)

            const { error: insertError } = await supabase
                .from('portfolio_images')
                .insert({
                    title: newProject.title.trim(),
                    description: newProject.description.trim() || null,
                    image_url: urls[0],
                    images: JSON.stringify(urls),
                    display_order: images.length,
                    is_visible: true
                })

            if (insertError) throw insertError

            await fetchImages()
            setNewProject({ title: '', description: '' })
            setNewFiles([])
            setNewFilesKey((prev) => prev + 1)
            alert('Projeto criado com sucesso!')
        } catch (error: any) {
            console.error('Error uploading:', error)
            alert(`Erro ao enviar imagens: ${error.message || 'Erro desconhecido'}. Veja o console para mais detalhes.`)
        } finally {
            setUploading(false)
        }
    }

    const startEdit = (image: PortfolioImage) => {
        const imagesList = parseImageList(image)
        setEditingId(image.id)
        setEditForm({
            title: image.title,
            description: image.description || ''
        })
        setEditImages(imagesList)
        setEditOriginalImages(imagesList)
        setEditNewFiles([])
        setEditFilesKey((prev) => prev + 1)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({ title: '', description: '' })
        setEditImages([])
        setEditOriginalImages([])
        setEditNewFiles([])
    }

    const saveEdit = async (id: string) => {
        if (!editForm.title.trim()) {
            alert('O titulo nao pode ficar vazio')
            return
        }

        const validationError = editNewFiles.length ? validateFiles(editNewFiles) : null
        if (validationError) {
            alert(validationError)
            return
        }

        const finalImages = [...editImages]

        if (finalImages.length === 0 && editNewFiles.length === 0) {
            alert('Mantenha pelo menos uma imagem no projeto')
            return
        }

        setSavingId(id)
        try {
            let newUploads: string[] = []
            if (editNewFiles.length > 0) {
                newUploads = await uploadPortfolioFiles(editNewFiles)
                finalImages.push(...newUploads)
            }

            const { error } = await supabase
                .from('portfolio_images')
                .update({
                    title: editForm.title.trim(),
                    description: editForm.description.trim() || null,
                    image_url: finalImages[0],
                    images: JSON.stringify(finalImages)
                })
                .eq('id', id)

            if (error) throw error

            const removedImages = editOriginalImages.filter((url) => !editImages.includes(url))
            if (removedImages.length > 0) {
                await removePortfolioFiles(removedImages)
            }

            await fetchImages()
            cancelEdit()
            alert('Projeto atualizado com sucesso!')
        } catch (error) {
            console.error('Error updating:', error)
            alert('Erro ao atualizar projeto')
        } finally {
            setSavingId(null)
        }
    }

    const handleDelete = async (image: PortfolioImage) => {
        if (!confirm('Tem certeza que deseja excluir este projeto?')) return

        try {
            const imageList = parseImageList(image)
            if (imageList.length > 0) {
                await removePortfolioFiles(imageList)
            }

            const { error } = await supabase
                .from('portfolio_images')
                .delete()
                .eq('id', image.id)

            if (error) throw error

            await fetchImages()
            alert('Projeto excluido com sucesso!')
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Erro ao excluir projeto')
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

    const createProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!newProduct.name.trim()) {
            alert('O nome do produto nao pode ficar vazio')
            return
        }

        const validationError = validateFiles(newProductFiles)
        if (validationError) {
            alert(validationError)
            return
        }

        setProductUploading(true)
        try {
            const urls = await uploadGalleryFiles(newProductFiles, 'products')

            const { error } = await supabase
                .from('gallery_products')
                .insert({
                    name: newProduct.name.trim(),
                    author: newProduct.author.trim() || null,
                    description: newProduct.description.trim() || null,
                    price_text: newProduct.price_text.trim() || null,
                    quantity: newProduct.quantity ? Number.parseInt(newProduct.quantity, 10) : null,
                    images: JSON.stringify(urls),
                    display_order: products.length,
                    is_visible: true
                })

            if (error) throw error

            await fetchProducts()
            setNewProduct({ name: '', author: '', description: '', price_text: '', quantity: '' })
            setNewProductFiles([])
            setNewProductFilesKey((prev) => prev + 1)
            alert('Produto criado com sucesso!')
        } catch (error: any) {
            console.error('Error uploading product:', error)
            alert(`Erro ao salvar produto: ${error.message || 'Erro desconhecido'}`)
        } finally {
            setProductUploading(false)
        }
    }

    const startProductEdit = (product: GalleryProduct) => {
        const imagesList = parseGalleryImages(product)
        setEditingProductId(product.id)
        setProductEditForm({
            name: product.name,
            author: product.author || '',
            description: product.description || '',
            price_text: product.price_text || '',
            quantity: product.quantity !== null && product.quantity !== undefined ? String(product.quantity) : ''
        })
        setProductEditImages(imagesList)
        setProductEditOriginalImages(imagesList)
        setProductEditNewFiles([])
        setProductEditFilesKey((prev) => prev + 1)
    }

    const cancelProductEdit = () => {
        setEditingProductId(null)
        setProductEditForm({ name: '', author: '', description: '', price_text: '', quantity: '' })
        setProductEditImages([])
        setProductEditOriginalImages([])
        setProductEditNewFiles([])
    }

    const saveProductEdit = async (id: string) => {
        if (!productEditForm.name.trim()) {
            alert('O nome do produto nao pode ficar vazio')
            return
        }

        const validationError = productEditNewFiles.length ? validateFiles(productEditNewFiles) : null
        if (validationError) {
            alert(validationError)
            return
        }

        const finalImages = [...productEditImages]
        if (finalImages.length === 0 && productEditNewFiles.length === 0) {
            alert('Mantenha pelo menos uma imagem no produto')
            return
        }

        try {
            if (productEditNewFiles.length > 0) {
                const newUrls = await uploadGalleryFiles(productEditNewFiles, 'products')
                finalImages.push(...newUrls)
            }

            const { error } = await supabase
                .from('gallery_products')
                .update({
                    name: productEditForm.name.trim(),
                    author: productEditForm.author.trim() || null,
                    description: productEditForm.description.trim() || null,
                    price_text: productEditForm.price_text.trim() || null,
                    quantity: productEditForm.quantity ? Number.parseInt(productEditForm.quantity, 10) : null,
                    images: JSON.stringify(finalImages)
                })
                .eq('id', id)

            if (error) throw error

            const removed = productEditOriginalImages.filter((url) => !productEditImages.includes(url))
            if (removed.length > 0) {
                await removeGalleryFiles(removed)
            }

            await fetchProducts()
            cancelProductEdit()
            alert('Produto atualizado com sucesso!')
        } catch (error) {
            console.error('Error updating product:', error)
            alert('Erro ao atualizar produto')
        }
    }

    const deleteProduct = async (product: GalleryProduct) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return

        try {
            const imagesList = parseGalleryImages(product)
            if (imagesList.length > 0) {
                await removeGalleryFiles(imagesList)
            }

            const { data, error } = await supabase
                .from('gallery_products')
                .delete()
                .eq('id', product.id)
                .select('id')

            if (error) throw error
            if (!data || data.length === 0) {
                throw new Error('Nenhuma linha foi removida. Verifique políticas RLS de DELETE para gallery_products.')
            }

            await fetchProducts()
            alert('Produto excluido com sucesso!')
        } catch (error: any) {
            console.error('Error deleting product:', error)
            alert(`Erro ao excluir produto: ${error?.message || 'Erro desconhecido'}`)
        }
    }

    const createExhibitor = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!newExhibitor.name.trim()) {
            alert('O nome do expositor nao pode ficar vazio')
            return
        }

        if (!newExhibitorFile) {
            alert('Selecione uma foto do expositor')
            return
        }

        const fileValidation = validateFiles([newExhibitorFile])
        if (fileValidation) {
            alert(fileValidation)
            return
        }

        setExhibitorUploading(true)
        try {
            const [avatarUrl] = await uploadGalleryFiles([newExhibitorFile], 'exhibitors')

            const { error } = await supabase
                .from('gallery_exhibitors')
                .insert({
                    name: newExhibitor.name.trim(),
                    title: newExhibitor.title.trim() || null,
                    instagram_path: newExhibitor.instagram_path.trim() || null,
                    avatar_url: avatarUrl,
                    display_order: exhibitors.length,
                    is_visible: true
                })

            if (error) throw error

            await fetchExhibitors()
            setNewExhibitor({ name: '', title: '', instagram_path: '' })
            setNewExhibitorFile(null)
            setNewExhibitorFileKey((prev) => prev + 1)
            alert('Expositor salvo com sucesso!')
        } catch (error: any) {
            console.error('Error uploading exhibitor:', error)
            alert(`Erro ao salvar expositor: ${error.message || 'Erro desconhecido'}`)
        } finally {
            setExhibitorUploading(false)
        }
    }

    const startExhibitorEdit = (exhibitor: GalleryExhibitor) => {
        setEditingExhibitorId(exhibitor.id)
        setExhibitorEditForm({
            name: exhibitor.name,
            title: exhibitor.title || '',
            instagram_path: exhibitor.instagram_path || ''
        })
        setExhibitorEditFile(null)
        setExhibitorEditFileKey((prev) => prev + 1)
    }

    const cancelExhibitorEdit = () => {
        setEditingExhibitorId(null)
        setExhibitorEditForm({ name: '', title: '', instagram_path: '' })
        setExhibitorEditFile(null)
    }

    const saveExhibitorEdit = async (id: string) => {
        if (!exhibitorEditForm.name.trim()) {
            alert('O nome do expositor nao pode ficar vazio')
            return
        }

        try {
            let avatarUrl: string | null = null
            if (exhibitorEditFile) {
                const fileValidation = validateFiles([exhibitorEditFile])
                if (fileValidation) {
                    alert(fileValidation)
                    return
                }
                const [newUrl] = await uploadGalleryFiles([exhibitorEditFile], 'exhibitors')
                avatarUrl = newUrl
            }

            const updates: Record<string, any> = {
                name: exhibitorEditForm.name.trim(),
                title: exhibitorEditForm.title.trim() || null,
                instagram_path: exhibitorEditForm.instagram_path.trim() || null
            }

            if (avatarUrl) {
                updates.avatar_url = avatarUrl
            }

            const { error } = await supabase
                .from('gallery_exhibitors')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            await fetchExhibitors()
            cancelExhibitorEdit()
            alert('Expositor atualizado com sucesso!')
        } catch (error) {
            console.error('Error updating exhibitor:', error)
            alert('Erro ao atualizar expositor')
        }
    }

    const deleteExhibitor = async (exhibitor: GalleryExhibitor) => {
        if (!confirm('Tem certeza que deseja excluir este expositor?')) return

        try {
            if (exhibitor.avatar_url) {
                await removeGalleryFiles([exhibitor.avatar_url])
            }

            const { data, error } = await supabase
                .from('gallery_exhibitors')
                .delete()
                .eq('id', exhibitor.id)
                .select('id')

            if (error) throw error
            if (!data || data.length === 0) {
                throw new Error('Nenhuma linha foi removida. Verifique políticas RLS de DELETE para gallery_exhibitors.')
            }

            await fetchExhibitors()
            alert('Expositor excluido com sucesso!')
        } catch (error: any) {
            console.error('Error deleting exhibitor:', error)
            alert(`Erro ao excluir expositor: ${error?.message || 'Erro desconhecido'}`)
        }
    }

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setAuthError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email: authForm.email.trim(),
            password: authForm.password
        })

        if (error) {
            setAuthError('Credenciais inválidas. Verifique seu email e senha.')
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-lg font-medium text-graphite">Carregando painel...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white px-6">
                <div className="w-full max-w-md bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
                    <h1 className="text-2xl font-serif text-graphite mb-2">Entrar no painel</h1>
                    <p className="text-sm text-graphite/70 mb-6">Use seu email e senha do Supabase.</p>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Email</label>
                            <input
                                type="email"
                                value={authForm.email}
                                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Senha</label>
                            <input
                                type="password"
                                value={authForm.password}
                                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                required
                            />
                        </div>
                        {authError && (
                            <p className="text-sm text-red-600">{authError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-md transition-colors"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    if (loading || productsLoading || exhibitorsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-lg font-medium text-graphite">Carregando painel...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-off-white">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-widest text-graphite/70 font-sans">Admin</p>
                    <h1 className="text-3xl font-serif text-graphite">Painel</h1>
                    <p className="text-sm text-graphite/70 mt-1">
                        Gerencie o portfólio, produtos e expositores.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs">
                        <a
                            href="/"
                            className="text-graphite/60 hover:text-graphite underline"
                        >
                            Voltar ao site
                        </a>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-graphite/60 hover:text-graphite underline"
                        >
                            Sair
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 border-b border-warm-beige pb-4 mb-8">
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
                        Portfólio
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'products'
                                ? 'bg-olive-green text-off-white'
                                : 'bg-warm-beige/60 text-graphite hover:bg-warm-beige'
                        }`}
                        aria-pressed={activeTab === 'products'}
                        type="button"
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('exhibitors')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'exhibitors'
                                ? 'bg-olive-green text-off-white'
                                : 'bg-warm-beige/60 text-graphite hover:bg-warm-beige'
                        }`}
                        aria-pressed={activeTab === 'exhibitors'}
                        type="button"
                    >
                        Expositores
                    </button>
                </div>

                {activeTab === 'portfolio' && (
                    <AdminPortfolioTab
                        images={images}
                        newProject={newProject}
                        setNewProject={setNewProject}
                        newFilesKey={newFilesKey}
                        setNewFiles={setNewFiles}
                        uploading={uploading}
                        handleCreateProject={handleCreateProject}
                        editingId={editingId}
                        editForm={editForm}
                        setEditForm={setEditForm}
                        editImages={editImages}
                        setEditImages={setEditImages}
                        editFilesKey={editFilesKey}
                        setEditNewFiles={setEditNewFiles}
                        savingId={savingId}
                        saveEdit={saveEdit}
                        cancelEdit={cancelEdit}
                        startEdit={startEdit}
                        toggleVisibility={toggleVisibility}
                        updateOrder={updateOrder}
                        handleDelete={handleDelete}
                    />
                )}

                {activeTab === 'products' && (
                    <AdminProductsTab
                        products={products}
                        productsLoading={productsLoading}
                        newProduct={newProduct}
                        setNewProduct={setNewProduct}
                        newProductFilesKey={newProductFilesKey}
                        setNewProductFiles={setNewProductFiles}
                        productUploading={productUploading}
                        createProduct={createProduct}
                        editingProductId={editingProductId}
                        productEditForm={productEditForm}
                        setProductEditForm={setProductEditForm}
                        productEditImages={productEditImages}
                        setProductEditImages={setProductEditImages}
                        productEditFilesKey={productEditFilesKey}
                        setProductEditNewFiles={setProductEditNewFiles}
                        saveProductEdit={saveProductEdit}
                        cancelProductEdit={cancelProductEdit}
                        startProductEdit={startProductEdit}
                        deleteProduct={deleteProduct}
                    />
                )}

                {activeTab === 'exhibitors' && (
                    <AdminExhibitorsTab
                        exhibitors={exhibitors}
                        exhibitorsLoading={exhibitorsLoading}
                        newExhibitor={newExhibitor}
                        setNewExhibitor={setNewExhibitor}
                        newExhibitorFileKey={newExhibitorFileKey}
                        setNewExhibitorFile={setNewExhibitorFile}
                        exhibitorUploading={exhibitorUploading}
                        createExhibitor={createExhibitor}
                        editingExhibitorId={editingExhibitorId}
                        exhibitorEditForm={exhibitorEditForm}
                        setExhibitorEditForm={setExhibitorEditForm}
                        exhibitorEditFileKey={exhibitorEditFileKey}
                        setExhibitorEditFile={setExhibitorEditFile}
                        saveExhibitorEdit={saveExhibitorEdit}
                        cancelExhibitorEdit={cancelExhibitorEdit}
                        startExhibitorEdit={startExhibitorEdit}
                        deleteExhibitor={deleteExhibitor}
                    />
                )}
            </div>
        </div>
    )
}
