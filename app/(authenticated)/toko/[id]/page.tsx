'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  stock: number;
  length: number;
  width: number;
  thickness: number;
  rating: number;
  user: {
    username: string;
    role: string;
    image_url: string;
  };
}

const formatPrice = (price: number) =>
  `Rp ${price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id); else router.push('/Login');
    })();
    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('product')
        .select(`
          *,
          user:users (
            username,
            role,
            image_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) setError(error.message); else if (data) setProduct(data as Product);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    setQuantity(q => {
      const next = q + delta;
      if (next < 1) return 1;
      if (next > product.stock) return product.stock;
      return next;
    });
  };

  const addToCart = async (buyNow?: boolean) => {
    if (!product || !userId || adding) return;
    setAdding(true);
    const { data: existing } = await supabase
      .from('keranjang')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .maybeSingle();
    if (existing) {
      const newQty = Math.min(product.stock, existing.quantity + quantity);
      await supabase.from('keranjang').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('keranjang').insert([{ user_id: userId, product_id: product.id, quantity }]);
    }
    setAdding(false);
    if (buyNow) router.push('/pembayaran'); else router.push('/keranjang');
  };

  const containerWidth = 'max-w-[1100px]';
  const gridCols = 'grid grid-cols-1 xl:grid-cols-[520px_540px] gap-10 w-full';

  if (loading) {
    return (
      <div className="w-full p-4 animate-pulse">
        <header className={`flex justify-between items-center mb-6 w-full ${containerWidth} mx-auto`}>
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </header>
        <div className={`${gridCols} ${containerWidth} mx-auto`}>
          <div className="flex flex-col gap-5 w-full max-w-[520px]">
            <div className="aspect-square w-full bg-gray-200 rounded-xl" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded-full w-3/5" />
            <div className="flex gap-5 w-full">
              <div className="h-12 bg-gray-200 rounded-full flex-1" />
              <div className="h-12 bg-gray-200 rounded-full flex-1" />
            </div>
          </div>
          <div className="flex flex-col gap-8 w-full">
            <div className="h-12 bg-gray-200 rounded w-3/4" />
            <div className="h-10 bg-gray-200 rounded w-2/5" />
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-20 bg-gray-200 rounded w-full" />
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-32" />
              <div className="h-16 bg-gray-200 rounded w-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4">Error: {error}</div>;
  if (!product) return <div className="p-4">Product not found.</div>;

  return (
    <div className="w-full p-4">
      <header className={`flex justify-between items-center mb-6 w-full ${containerWidth} mx-auto`}>
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={() => router.push('/keranjang')} aria-label="Keranjang" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6" />
        </button>
      </header>

      <div className={`${gridCols} ${containerWidth} mx-auto`}>
        <div className="flex flex-col gap-5 w-full max-w-[520px]">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100">
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Stok Barang: {product.stock}</p>
            <div className="flex">
              <div className="flex items-center border rounded-full px-2 py-1 w-full max-w-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-semibold select-none">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-5 w-full max-w-md">
            <button onClick={() => addToCart(false)} disabled={adding} className="flex-1 py-3 border border-black rounded-full font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">{adding ? '...' : 'Keranjang'}</button>
            <button onClick={() => addToCart(true)} disabled={adding} className="flex-1 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors">{adding ? '...' : 'Beli Langsung'}</button>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <h1 className="text-4xl font-semibold leading-tight break-words">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Deskripsi Produk</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line break-words">{product.description}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Ukuran</h2>
            <ul className="text-gray-600 space-y-1">
              <li>Panjang: {product.length} cm</li>
              <li>Lebar: {product.width} cm</li>
              <li>Tebal: {product.thickness} cm</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Penjual</h2>
            <div className="flex items-center gap-3">
              <Image src={product.user.image_url || '/default-avatar.png'} alt={product.user.username} width={48} height={48} className="rounded-full object-cover" />
              <div>
                <p className="font-semibold">{product.user.username}</p>
                <p className="text-sm text-gray-500 capitalize">{product.user.role}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
