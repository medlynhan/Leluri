"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Image from 'next/image';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClassItem {
  id: string;
  name?: string;
  title?: string;
  image_url?: string;
  created_at: string;
}

const SelfClassesPage: React.FC = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ClassItem | null>(null);
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
    fetchClasses();
  }, [userId]);

  const fetchClasses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('class')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setClasses((data as any) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kelas ini?')) return;
    await supabase.from('class').delete().eq('id', id);
    setClasses(c => c.filter(x => x.id !== id));
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const newName = editing.name || editing.title || '';
    await supabase.from('class').update({ name: newName, title: newName }).eq('id', editing.id);
    setClasses(list => list.map(k => k.id === editing.id ? { ...k, name: newName, title: newName } : k));
    setEditing(null);
    setSaving(false);
  };

  return (
    <div className="p-6 w-full">
      <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mb-4" aria-label="Kembali">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Kelas ({classes.length})</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Belum ada kelas.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {classes.map(k => (
            <div key={k.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
              <div className="relative h-48">
                {k.image_url && (
                  <Image src={k.image_url} alt={k.name || k.title || 'Kelas'} fill className="object-cover" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.25rem]">{k.name || k.title || 'Tanpa Nama'}</h3>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(k)} className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 border rounded-full hover:bg-gray-50"><Edit className="w-3 h-3"/>Edit</button>
                  <button onClick={() => handleDelete(k.id)} className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 border rounded-full text-red-600 hover:bg-red-50"><Trash2 className="w-3 h-3"/>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-80">
            <h2 className="font-semibold mb-4 text-sm">Edit Kelas</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama / Judul</label>
                <input value={editing.name || editing.title || ''} onChange={e => setEditing({ ...editing, name: e.target.value, title: e.target.value })} className="w-full border rounded-md px-2 py-1 text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="flex-1 border rounded-full text-xs py-2 hover:bg-gray-50">Batal</button>
              <button disabled={saving} onClick={handleSave} className="flex-1 bg-black text-white rounded-full text-xs py-2 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800" aria-label="Tambah Kelas">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SelfClassesPage;
