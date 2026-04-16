'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, PortfolioImage, GalleryProduct, GalleryExhibitor } from '@/lib/supabase'
import AdminPortfolioTab from '@/components/admin_dashboard/PortfolioTab'
import AdminProductsTab from '@/components/admin_dashboard/ProductsTab'
import AdminExhibitorsTab from '@/components/admin_dashboard/ExhibitorsTab'
import { parseImageList, parseGalleryImages } from '@/components/admin_dashboard/utils'

const MAX_IMAGE_DIMENSION = 2400
const TARGET_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
const MIN_IMAGE_QUALITY = 0.5

const getPortfolioFilePath = (url: string) => {
    const urlParts = url.split('/portfolio/')
    return urlParts.length > 1 ? urlParts[1] : null
}

const getGalleryFilePath = (url: string) => {
    const urlParts = url.split('/gallery/')
    return urlParts.length > 1 ? urlParts[1] : null
}

const readImageDimensions = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file)
        const image = new Image()

        image.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(image)
        }
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Nao foi possivel carregar a imagem'))
        }

        image.src = objectUrl
    })

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Nao foi possivel otimizar a imagem'))
                    return
                }
                resolve(blob)
            },
            'image/webp',
            quality
        )
    })

const optimizeImageFile = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) return file

    try {
        const image = await readImageDimensions(file)
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
        const width = Math.max(1, Math.round(image.width * scale))
        const height = Math.max(1, Math.round(image.height * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        if (!context) return file
        context.drawImage(image, 0, 0, width, height)

        let quality = 0.88
        let blob = await canvasToBlob(canvas, quality)

        while (blob.size > TARGET_IMAGE_SIZE_BYTES && quality > MIN_IMAGE_QUALITY) {
            quality = Math.max(MIN_IMAGE_QUALITY, quality - 0.1)
            blob = await canvasToBlob(canvas, quality)
        }

        const fileBaseName = file.name.replace(/\.[^/.]+$/, '')
        return new File([blob], `${fileBaseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now()
        })
    } catch (error) {
        console.warn('Image optimization failed, uploading original file', error)
        return file
    }
}

const getUploadErrorMessage = (error: any) => {
    const rawMessage = String(error?.message || '').toLowerCase()
    if (rawMessage.includes('maximum allowed size') || rawMessage.includes('object exceeded')) {
        return 'A imagem excede o limite do bucket do Supabase mesmo apos compressao. Tente uma imagem menor.'
    }
    return error?.message || 'Erro desconhecido'
}

export default function AdminDashboard() {
    const [images, setImages] = useState<PortfolioImage[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [authError, setAuthError] = useState<string | null>(null)
    const [authForm, setAuthForm] = useState({ email: '', password: '' })
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '', phrase: '' })
    const [editCoverUrl, setEditCoverUrl] = useState('')
    const [editCoverFile, setEditCoverFile] = useState<File | null>(null)
    const [editImages, setEditImages] = useState<string[]>([])
    const [editOriginalImages, setEditOriginalImages] = useState<string[]>([])
    const [editNewFiles, setEditNewFiles] = useState<File[]>([])
    const [editFilesKey, setEditFilesKey] = useState(0)
    const [editCoverKey, setEditCoverKey] = useState(0)
    const [newProject, setNewProject] = useState({ title: '', description: '', phrase: '' })
    const [newCoverFile, setNewCoverFile] = useState<File | null>(null)
    const [newFiles, setNewFiles] = useState<File[]>([])
    const [newFilesKey, setNewFilesKey] = useState(0)
    const [newCoverKey, setNewCoverKey] = useState(0)
    const [products, setProducts] = useState<GalleryProduct[]>([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [productUploading, setProductUploading] = useState(false)
    const [editingProductId, setEditingProductId] = useState<string | null>(null)
    const [productEditForm, setProductEditForm] = useState({
        name: '',
        author: '',
        description: '',
        price_text: '',
        quantity: '',
        package_weight_grams: '',
        package_height_cm: '',
        package_width_cm: '',
        package_length_cm: ''
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
        quantity: '',
        package_weight_grams: '',
        package_height_cm: '',
        package_width_cm: '',
        package_length_cm: ''
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
        description: '',
        instagram_path: '',
        brand_member: false
    })
    const [exhibitorEditFile, setExhibitorEditFile] = useState<File | null>(null)
    const [exhibitorEditFileKey, setExhibitorEditFileKey] = useState(0)
    const [newExhibitor, setNewExhibitor] = useState({
        name: '',
        title: '',
        description: '',
        instagram_path: '',
        brand_member: false
    })
    const [newExhibitorFile, setNewExhibitorFile] = useState<File | null>(null)
    const [newExhibitorFileKey, setNewExhibitorFileKey] = useState(0)
    const [activeTab, setActiveTab] = useState<'portfolio' | 'products' | 'exhibitors'>('portfolio')

    useEffect(() => {
        let isMounted = true

        const loadSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!isMounted) return
            const sessionUser = data.session?.user ?? null
            setUser(sessionUser)
            if (sessionUser) {
                const { data: adminRow } = await supabase
                    .from('admin_users')
                    .select('id')
                    .eq('id', sessionUser.id)
                    .maybeSingle()
                if (isMounted) setIsAdmin(!!adminRow)
            } else {
                setIsAdmin(null)
            }
            setAuthLoading(false)
        }

        loadSession()

        const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const sessionUser = session?.user ?? null
            setUser(sessionUser)
            if (sessionUser) {
                const { data: adminRow } = await supabase
                    .from('admin_users')
                    .select('id')
                    .eq('id', sessionUser.id)
                    .maybeSingle()
                setIsAdmin(!!adminRow)
            } else {
                setIsAdmin(null)
            }
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
        }
        return null
    }

    const validateProductShipping = (form: {
        package_weight_grams: string
        package_height_cm: string
        package_width_cm: string
        package_length_cm: string
    }) => {
        if (!form.package_weight_grams || Number.parseInt(form.package_weight_grams, 10) <= 0) {
            return 'Informe o peso do pacote em gramas'
        }
        if (!form.package_height_cm || Number.parseFloat(form.package_height_cm) <= 0) {
            return 'Informe a altura do pacote em centímetros'
        }
        if (!form.package_width_cm || Number.parseFloat(form.package_width_cm) <= 0) {
            return 'Informe a largura do pacote em centímetros'
        }
        if (!form.package_length_cm || Number.parseFloat(form.package_length_cm) <= 0) {
            return 'Informe o comprimento do pacote em centímetros'
        }
        return null
    }

    const uploadPortfolioFiles = async (files: File[]) => {
        const uploads = await Promise.all(
            files.map(async (file) => {
                const optimizedFile = await optimizeImageFile(file)
                const fileExt = optimizedFile.name.split('.').pop() || 'bin'
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('portfolio')
                    .upload(fileName, optimizedFile, {
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
                const optimizedFile = await optimizeImageFile(file)
                const fileExt = optimizedFile.name.split('.').pop() || 'bin'
                const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('gallery')
                    .upload(fileName, optimizedFile, {
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

        if (!newCoverFile) {
            alert('Selecione a imagem de capa')
            return
        }

        const coverValidation = validateFiles([newCoverFile])
        if (coverValidation) {
            alert(coverValidation)
            return
        }

        const validationError = validateFiles(newFiles)
        if (validationError) {
            alert(validationError)
            return
        }

        setUploading(true)
        try {
            const [coverUrl] = await uploadPortfolioFiles([newCoverFile])
            const urls = await uploadPortfolioFiles(newFiles)

            const { error: insertError } = await supabase
                .from('portfolio_images')
                .insert({
                    title: newProject.title.trim(),
                    description: newProject.description.trim() || null,
                    phrase: newProject.phrase.trim() || null,
                    image_url: coverUrl,
                    cover_url: coverUrl,
                    images: urls,
                    display_order: images.length,
                    is_visible: true
                })

            if (insertError) throw insertError

            await fetchImages()
            setNewProject({ title: '', description: '', phrase: '' })
            setNewCoverFile(null)
            setNewFiles([])
            setNewFilesKey((prev) => prev + 1)
            setNewCoverKey((prev) => prev + 1)
            alert('Projeto criado com sucesso!')
        } catch (error: any) {
            console.error('Error uploading:', error)
            alert(`Erro ao enviar imagens: ${getUploadErrorMessage(error)}. Veja o console para mais detalhes.`)
        } finally {
            setUploading(false)
        }
    }

    const startEdit = (image: PortfolioImage) => {
        const imagesList = parseImageList(image)
        setEditingId(image.id)
        setEditForm({
            title: image.title,
            description: image.description || '',
            phrase: image.phrase || ''
        })
        setEditCoverUrl(image.cover_url || image.image_url || imagesList[0] || '')
        setEditCoverFile(null)
        setEditImages(imagesList)
        setEditOriginalImages(imagesList)
        setEditNewFiles([])
        setEditFilesKey((prev) => prev + 1)
        setEditCoverKey((prev) => prev + 1)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({ title: '', description: '', phrase: '' })
        setEditCoverUrl('')
        setEditCoverFile(null)
        setEditImages([])
        setEditOriginalImages([])
        setEditNewFiles([])
    }

    const saveEdit = async (id: string) => {
        if (!editForm.title.trim()) {
            alert('O titulo nao pode ficar vazio')
            return
        }

        const coverValidation = editCoverFile ? validateFiles([editCoverFile]) : null
        if (coverValidation) {
            alert(coverValidation)
            return
        }

        const validationError = editNewFiles.length ? validateFiles(editNewFiles) : null
        if (validationError) {
            alert(validationError)
            return
        }

        const finalImages = [...editImages]
        const previousCover = editCoverUrl

        setSavingId(id)
        try {
            let newUploads: string[] = []
            if (editNewFiles.length > 0) {
                newUploads = await uploadPortfolioFiles(editNewFiles)
                finalImages.push(...newUploads)
            }

            let finalCoverUrl = editCoverUrl
            if (editCoverFile) {
                const [uploadedCover] = await uploadPortfolioFiles([editCoverFile])
                finalCoverUrl = uploadedCover
            }

            if (!finalCoverUrl) {
                alert('Mantenha ou selecione uma imagem de capa')
                return
            }

            const { error } = await supabase
                .from('portfolio_images')
                .update({
                    title: editForm.title.trim(),
                    description: editForm.description.trim() || null,
                    phrase: editForm.phrase.trim() || null,
                    image_url: finalCoverUrl,
                    cover_url: finalCoverUrl,
                    images: finalImages
                })
                .eq('id', id)

            if (error) throw error

            const removedImages = editOriginalImages.filter((url) => !editImages.includes(url))
            if (removedImages.length > 0) {
                await removePortfolioFiles(removedImages)
            }
            if (editCoverFile && previousCover && previousCover !== finalCoverUrl && !finalImages.includes(previousCover)) {
                await removePortfolioFiles([previousCover])
            }

            await fetchImages()
            cancelEdit()
            alert('Projeto atualizado com sucesso!')
        } catch (error) {
            console.error('Error updating:', error)
            alert(`Erro ao atualizar projeto: ${getUploadErrorMessage(error)}`)
        } finally {
            setSavingId(null)
        }
    }

    const handleDelete = async (image: PortfolioImage) => {
        if (!confirm('Tem certeza que deseja excluir este projeto?')) return

        try {
            const imageList = parseImageList(image)
            const coverImage = image.cover_url || image.image_url
            const filesToRemove = [...imageList]
            if (coverImage && !filesToRemove.includes(coverImage)) {
                filesToRemove.push(coverImage)
            }

            if (filesToRemove.length > 0) {
                await removePortfolioFiles(filesToRemove)
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

        const shippingValidationError = validateProductShipping(newProduct)
        if (shippingValidationError) {
            alert(shippingValidationError)
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
                    package_weight_grams: newProduct.package_weight_grams ? Number.parseInt(newProduct.package_weight_grams, 10) : null,
                    package_height_cm: newProduct.package_height_cm ? Number.parseFloat(newProduct.package_height_cm) : null,
                    package_width_cm: newProduct.package_width_cm ? Number.parseFloat(newProduct.package_width_cm) : null,
                    package_length_cm: newProduct.package_length_cm ? Number.parseFloat(newProduct.package_length_cm) : null,
                    images: JSON.stringify(urls),
                    display_order: products.length,
                    is_visible: true
                })

            if (error) throw error

            await fetchProducts()
            setNewProduct({
                name: '',
                author: '',
                description: '',
                price_text: '',
                quantity: '',
                package_weight_grams: '',
                package_height_cm: '',
                package_width_cm: '',
                package_length_cm: ''
            })
            setNewProductFiles([])
            setNewProductFilesKey((prev) => prev + 1)
            alert('Produto criado com sucesso!')
        } catch (error: any) {
            console.error('Error uploading product:', error)
            alert(`Erro ao salvar produto: ${getUploadErrorMessage(error)}`)
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
            quantity: product.quantity !== null && product.quantity !== undefined ? String(product.quantity) : '',
            package_weight_grams:
                product.package_weight_grams !== null && product.package_weight_grams !== undefined
                    ? String(product.package_weight_grams)
                    : '',
            package_height_cm:
                product.package_height_cm !== null && product.package_height_cm !== undefined
                    ? String(product.package_height_cm)
                    : '',
            package_width_cm:
                product.package_width_cm !== null && product.package_width_cm !== undefined
                    ? String(product.package_width_cm)
                    : '',
            package_length_cm:
                product.package_length_cm !== null && product.package_length_cm !== undefined
                    ? String(product.package_length_cm)
                    : ''
        })
        setProductEditImages(imagesList)
        setProductEditOriginalImages(imagesList)
        setProductEditNewFiles([])
        setProductEditFilesKey((prev) => prev + 1)
    }

    const cancelProductEdit = () => {
        setEditingProductId(null)
        setProductEditForm({
            name: '',
            author: '',
            description: '',
            price_text: '',
            quantity: '',
            package_weight_grams: '',
            package_height_cm: '',
            package_width_cm: '',
            package_length_cm: ''
        })
        setProductEditImages([])
        setProductEditOriginalImages([])
        setProductEditNewFiles([])
    }

    const saveProductEdit = async (id: string) => {
        if (!productEditForm.name.trim()) {
            alert('O nome do produto nao pode ficar vazio')
            return
        }

        const shippingValidationError = validateProductShipping(productEditForm)
        if (shippingValidationError) {
            alert(shippingValidationError)
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
                    package_weight_grams: productEditForm.package_weight_grams ? Number.parseInt(productEditForm.package_weight_grams, 10) : null,
                    package_height_cm: productEditForm.package_height_cm ? Number.parseFloat(productEditForm.package_height_cm) : null,
                    package_width_cm: productEditForm.package_width_cm ? Number.parseFloat(productEditForm.package_width_cm) : null,
                    package_length_cm: productEditForm.package_length_cm ? Number.parseFloat(productEditForm.package_length_cm) : null,
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
            alert(`Erro ao atualizar produto: ${getUploadErrorMessage(error)}`)
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
                    description: newExhibitor.description.trim() || null,
                    brand_member: newExhibitor.brand_member,
                    instagram_path: newExhibitor.instagram_path.trim() || null,
                    avatar_url: avatarUrl,
                    display_order: exhibitors.length,
                    is_visible: true
                })

            if (error) throw error

            await fetchExhibitors()
            setNewExhibitor({ name: '', title: '', description: '', instagram_path: '', brand_member: false })
            setNewExhibitorFile(null)
            setNewExhibitorFileKey((prev) => prev + 1)
            alert('Expositor salvo com sucesso!')
        } catch (error: any) {
            console.error('Error uploading exhibitor:', error)
            alert(`Erro ao salvar expositor: ${getUploadErrorMessage(error)}`)
        } finally {
            setExhibitorUploading(false)
        }
    }

    const startExhibitorEdit = (exhibitor: GalleryExhibitor) => {
        setEditingExhibitorId(exhibitor.id)
        setExhibitorEditForm({
            name: exhibitor.name,
            title: exhibitor.title || '',
            description: exhibitor.description || '',
            instagram_path: exhibitor.instagram_path || '',
            brand_member: Boolean(exhibitor.brand_member)
        })
        setExhibitorEditFile(null)
        setExhibitorEditFileKey((prev) => prev + 1)
    }

    const cancelExhibitorEdit = () => {
        setEditingExhibitorId(null)
        setExhibitorEditForm({ name: '', title: '', description: '', instagram_path: '', brand_member: false })
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
                description: exhibitorEditForm.description.trim() || null,
                brand_member: exhibitorEditForm.brand_member,
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
            alert(`Erro ao atualizar expositor: ${getUploadErrorMessage(error)}`)
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

    if (user && isAdmin === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white px-6">
                <div className="text-center">
                    <p className="text-lg font-medium text-graphite">Acesso não autorizado.</p>
                    <button
                        type="button"
                        onClick={() => supabase.auth.signOut()}
                        className="mt-4 text-sm text-graphite/60 underline"
                    >
                        Sair
                    </button>
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
                        newCoverKey={newCoverKey}
                        setNewCoverFile={setNewCoverFile}
                        newFilesKey={newFilesKey}
                        setNewFiles={setNewFiles}
                        uploading={uploading}
                        handleCreateProject={handleCreateProject}
                        editingId={editingId}
                        editForm={editForm}
                        setEditForm={setEditForm}
                        editCoverUrl={editCoverUrl}
                        editCoverKey={editCoverKey}
                        setEditCoverFile={setEditCoverFile}
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
