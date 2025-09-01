"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Image from 'next/image';
import { ArrowLeft, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  created_at: string;
  description?: string | null;
  stock?: number | null;
  length?: number | null;
  width?: number | null;
  thickness?: number | null;
}

const StarRating = ({ rating }: { rating: number }) => {
  const value = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  return (
    <div className="flex items-center gap-1 text-[10px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = value >= i + 1;
        return (
          <Star key={i} className={`w-3 h-3 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        );
      })}
      <span className="ml-1 text-xs text-gray-600">{value.toFixed(1)}</span>
    </div>
  );
};

const SelfStorePage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [editFields, setEditFields] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    length: '',
    width: '',
    thickness: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/Login'); return; }
      setUserId(user.id);
    })();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('product')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setProducts((data as any) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    await supabase.from('product').delete().eq('id', id);
    setProducts(p => p.filter(x => x.id !== id));
  };

  const handleSave = async () => {
    if (!editing) return;
    // Build update payload only with changed (non-empty) fields
    const payload: any = {};
    if (editFields.name.trim() !== '') payload.name = editFields.name.trim();
    if (editFields.price.trim() !== '') payload.price = Number(editFields.price);
    if (editFields.description.trim() !== '') payload.description = editFields.description.trim();
    if (editFields.stock.trim() !== '') payload.stock = Number(editFields.stock);
    if (editFields.length.trim() !== '') payload.length = Number(editFields.length);
    if (editFields.width.trim() !== '') payload.width = Number(editFields.width);
    if (editFields.thickness.trim() !== '') payload.thickness = Number(editFields.thickness);

    if (Object.keys(payload).length === 0) { // nothing changed
      setEditing(null);
      return;
    }

    setSaving(true);
    await supabase.from('product').update(payload).eq('id', editing.id);
    setProducts(list => list.map(p => p.id === editing.id ? { ...p, ...payload } : p));
    setEditing(null);
    setSaving(false);
  };

  return (
    <div className="p-6 w-full">
      <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mb-4" aria-label="Kembali">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Produk ({products.length})</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Belum ada produk.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
              <div className="relative h-56">
                {p.image_url && (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.25rem]">{p.name}</h3>
                <p className="text-sm font-bold">Rp {Number(p.price).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</p>
                <StarRating rating={p.rating} />
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setEditing(p); setEditFields({ name:'', price:'', description:'', stock:'', length:'', width:'', thickness:'' }); }} className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 border rounded-full hover:bg-gray-50"><Edit className="w-3 h-3"/>Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 border rounded-full text-red-600 hover:bg-red-50"><Trash2 className="w-3 h-3"/>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-96 max-w-md">
            <h2 className="font-semibold mb-4 text-sm">Edit Produk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="block font-medium text-gray-600">Nama</label>
                <input
                  value={editFields.name}
                  placeholder={editing.name}
                  onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium text-gray-600">Harga</label>
                <input
                  type="number"
                  value={editFields.price}
                  placeholder={editing.price?.toString()}
                  onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium text-gray-600">Stok</label>
                <input
                  type="number"
                  value={editFields.stock}
                  placeholder={editing.stock?.toString() || '-'}
                  onChange={e => setEditFields(f => ({ ...f, stock: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium text-gray-600">Panjang (cm)</label>
                <input
                  type="number"
                  value={editFields.length}
                  placeholder={editing.length?.toString() || '-'}
                  onChange={e => setEditFields(f => ({ ...f, length: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium text-gray-600">Lebar (cm)</label>
                <input
                  type="number"
                  value={editFields.width}
                  placeholder={editing.width?.toString() || '-'}
                  onChange={e => setEditFields(f => ({ ...f, width: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium text-gray-600">Ketebalan (cm)</label>
                <input
                  type="number"
                  value={editFields.thickness}
                  placeholder={editing.thickness?.toString() || '-'}
                  onChange={e => setEditFields(f => ({ ...f, thickness: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="block font-medium text-gray-600">Deskripsi</label>
                <textarea
                  value={editFields.description}
                  placeholder={editing.description || 'Deskripsi'}
                  onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                  className="w-full border rounded-md px-2 py-1 h-24 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5 text-xs">
              <button onClick={() => setEditing(null)} className="flex-1 border rounded-full py-2 hover:bg-gray-50">Batal</button>
              <button disabled={saving} onClick={handleSave} className="flex-1 bg-black text-white rounded-full py-2 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800" aria-label="Tambah Produk">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SelfStorePage;
