'use client'

import type React from 'react'
import Image from 'next/image'
import { Upload, Trash2, Save, X, Edit2, ImagePlus } from 'lucide-react'
import { GalleryProduct } from '@/lib/supabase'
import { parseGalleryImages } from '@/components/admin_dashboard/utils'

type ProductForm = {
    name: string
    author: string
    description: string
    price_text: string
    quantity: string
}

type ProductsTabProps = {
    products: GalleryProduct[]
    productsLoading: boolean
    newProduct: ProductForm
    setNewProduct: React.Dispatch<React.SetStateAction<ProductForm>>
    newProductFilesKey: number
    setNewProductFiles: React.Dispatch<React.SetStateAction<File[]>>
    productUploading: boolean
    createProduct: (event: React.FormEvent<HTMLFormElement>) => void
    editingProductId: string | null
    productEditForm: ProductForm
    setProductEditForm: React.Dispatch<React.SetStateAction<ProductForm>>
    productEditImages: string[]
    setProductEditImages: React.Dispatch<React.SetStateAction<string[]>>
    productEditFilesKey: number
    setProductEditNewFiles: React.Dispatch<React.SetStateAction<File[]>>
    saveProductEdit: (id: string) => void
    cancelProductEdit: () => void
    startProductEdit: (product: GalleryProduct) => void
    deleteProduct: (product: GalleryProduct) => void
}

export default function ProductsTab({
    products,
    productsLoading,
    newProduct,
    setNewProduct,
    newProductFilesKey,
    setNewProductFiles,
    productUploading,
    createProduct,
    editingProductId,
    productEditForm,
    setProductEditForm,
    productEditImages,
    setProductEditImages,
    productEditFilesKey,
    setProductEditNewFiles,
    saveProductEdit,
    cancelProductEdit,
    startProductEdit,
    deleteProduct
}: ProductsTabProps) {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-serif text-graphite">Produtos (Galeria)</h2>
                <p className="text-sm text-graphite/70 mt-1">Gerencie os produtos exibidos na Galeria.</p>
            </div>

            <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
                <form onSubmit={createProduct} className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-graphite">
                        <ImagePlus size={18} />
                        Novo produto
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Nome *</label>
                            <input
                                type="text"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                placeholder="Ex: Uma dança de vida"
                                maxLength={120}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Autor</label>
                            <input
                                type="text"
                                value={newProduct.author}
                                onChange={(e) => setNewProduct({ ...newProduct, author: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                placeholder="Ex: Nathalia Malinowski"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1">Descricao</label>
                        <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white resize-none"
                            rows={3}
                            maxLength={500}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Valor (ex: 249,99)</label>
                            <input
                                type="text"
                                value={newProduct.price_text}
                                onChange={(e) => setNewProduct({ ...newProduct, price_text: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                placeholder="250,00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1">Quantidade</label>
                            <input
                                type="number"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1">Fotos do produto *</label>
                        <input
                            key={newProductFilesKey}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setNewProductFiles(Array.from(e.target.files || []))}
                            className="w-full text-sm text-graphite/70"
                        />
                        <p className="text-xs text-graphite/60 mt-1">
                            Selecione uma ou mais imagens. Maximo 10MB por arquivo.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={productUploading}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-button transition-colors disabled:opacity-60"
                    >
                        <Upload className="mr-2" size={18} />
                        {productUploading ? 'Salvando...' : 'Salvar produto'}
                    </button>
                </form>
            </div>

            <div className="mt-6">
                {productsLoading ? (
                    <p className="text-sm text-graphite/70">Carregando produtos...</p>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-warm-beige/80 shadow-sm">
                        <p className="text-graphite text-lg mb-2">Nenhum produto ainda.</p>
                        <p className="text-sm text-graphite/60">
                            Crie o primeiro produto para iniciar a Galeria.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => {
                            const imagesList = parseGalleryImages(product)
                            const coverImage = imagesList[0]
                            return (
                                <div
                                    key={product.id}
                                    className={`bg-white rounded-2xl border border-warm-beige/80 overflow-hidden transition-all duration-200 shadow-sm ${
                                        editingProductId === product.id ? 'ring-2 ring-olive-green' : ''
                                    }`}
                                >
                                    <div className="relative h-56 bg-off-white">
                                        {coverImage ? (
                                            <Image
                                                src={coverImage}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-sm text-graphite/60">
                                                Sem imagem
                                            </div>
                                        )}
                                        {imagesList.length > 1 && (
                                            <span className="absolute top-3 right-3 bg-graphite/80 text-off-white text-xs px-2 py-1 rounded-full">
                                                {imagesList.length} fotos
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        {editingProductId === product.id ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Nome *</label>
                                                    <input
                                                        type="text"
                                                        value={productEditForm.name}
                                                        onChange={(e) => setProductEditForm({ ...productEditForm, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Autor</label>
                                                    <input
                                                        type="text"
                                                        value={productEditForm.author}
                                                        onChange={(e) => setProductEditForm({ ...productEditForm, author: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-graphite mb-1">Descricao</label>
                                                    <textarea
                                                        value={productEditForm.description}
                                                        onChange={(e) => setProductEditForm({ ...productEditForm, description: e.target.value })}
                                                        className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white resize-none"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-graphite mb-1">Valor</label>
                                                        <input
                                                            type="text"
                                                            value={productEditForm.price_text}
                                                            onChange={(e) => setProductEditForm({ ...productEditForm, price_text: e.target.value })}
                                                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-graphite mb-1">Quantidade</label>
                                                        <input
                                                            type="number"
                                                            value={productEditForm.quantity}
                                                            onChange={(e) => setProductEditForm({ ...productEditForm, quantity: e.target.value })}
                                                            className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-graphite mb-2">Fotos atuais</p>
                                                    {productEditImages.length === 0 ? (
                                                        <p className="text-xs text-graphite/60">Nenhuma foto restante.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {productEditImages.map((url) => (
                                                                <div key={url} className="relative group">
                                                                    <div className="relative h-20 rounded-md overflow-hidden">
                                                                        <Image
                                                                            src={url}
                                                                            alt="Foto do produto"
                                                                            fill
                                                                            className="object-cover"
                                                                            unoptimized
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setProductEditImages((prev) => prev.filter((item) => item !== url))}
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
                                                        key={productEditFilesKey}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => setProductEditNewFiles(Array.from(e.target.files || []))}
                                                        className="w-full text-sm text-graphite/70"
                                                    />
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => saveProductEdit(product.id)}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-md transition-colors"
                                                    >
                                                        <Save size={16} className="mr-2" />
                                                        Salvar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelProductEdit}
                                                        className="px-4 py-2 bg-warm-beige text-graphite font-medium rounded-md transition-colors hover:bg-warm-beige/80"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-3">
                                                    <h3 className="font-semibold text-lg text-graphite mb-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-graphite/70 text-sm min-h-[2.5rem]">
                                                        {product.description || <span className="text-graphite/40 italic">Sem descricao</span>}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startProductEdit(product)}
                                                        className="flex items-center justify-center px-3 py-2 bg-soft-terracotta hover:bg-coffee-brown text-off-white text-sm font-medium rounded-md transition-colors"
                                                    >
                                                        <Edit2 size={16} className="mr-1.5" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteProduct(product)}
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
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
