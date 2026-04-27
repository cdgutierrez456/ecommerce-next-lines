'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'ADMIN') {
        router.push('/');
        return;
      }
      fetchProducts();
      fetchCategories();
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload to Cloudinary
        const uploadRes = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          toast.error('Error al subir imagen');
          continue;
        }

        const { url } = await uploadRes.json();
        newImages.push(url);
      }

      setUploadedImages([...uploadedImages, ...newImages]);
      toast.success('Imágenes subidas exitosamente');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error al subir imágenes');
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    reset({ name: '', description: '', price: undefined, stock: undefined, categoryId: '' });
    setUploadedImages([]);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.id,
    });
    setUploadedImages(product.images || []);
    setShowModal(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: uploadedImages }),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setShowModal(false);
        fetchProducts();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar producto');
    }
  };

  const requestDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Producto eliminado');
        fetchProducts();
      } else {
        toast.error('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center body-gradient">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen body-gradient py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
              className="gap-2 text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-4xl font-bold text-white">Gestionar Productos</h1>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-primary hover:bg-primary-hover gap-2"
          >
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map?.((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden bg-gray-100">
                {product?.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {product.description}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Categoría: {product?.category?.name}
              </p>
              <p className="text-xl font-bold text-primary mb-2">
                ${product.price?.toFixed?.(2) ?? '0.00'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Stock: {product.stock}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => openEditModal(product)}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  onClick={() => requestDelete(product.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )) || null}
        </div>
      </div>

      {/* Modal confirmación eliminar */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Eliminar producto</h2>
            <p className="text-gray-500 text-sm mb-6">
              Esta acción es permanente y no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                disabled={deleting}
                onClick={confirmDelete}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <Input
                  type="text"
                  {...register('name', { required: 'El nombre es requerido' })}
                  placeholder="Nombre del producto"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register('description', { required: 'La descripción es requerida' })}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Descripción del producto"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('price', {
                      required: 'El precio es requerido',
                      valueAsNumber: true,
                      min: { value: 0, message: 'El precio debe ser mayor a 0' },
                    })}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <Input
                    type="number"
                    {...register('stock', {
                      required: 'El stock es requerido',
                      valueAsNumber: true,
                      min: { value: 0, message: 'El stock no puede ser negativo' },
                    })}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  {...register('categoryId', { required: 'La categoría es requerida' })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories?.map?.((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  )) || null}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">
                    {uploading ? 'Subiendo...' : 'Sube imágenes del producto'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      className="cursor-pointer"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Seleccionar Imágenes
                    </Button>
                  </label>
                </div>
                {uploadedImages?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                        <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  {isSubmitting ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
