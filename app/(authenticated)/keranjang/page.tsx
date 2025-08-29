"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface CartRow {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image_url: string;
    user: { username: string; role: string; image_url: string | null };
  };
}

const formatPrice = (p: number) =>
  `Rp ${p.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CartPage: React.FC = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("keranjang")
      .select(
        `id, quantity, product:product ( id, name, price, stock, image_url, user:users ( username, role, image_url ) )`
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) setError(error.message); else setCart((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/Login");
        return;
      }
      setUserId(user.id);
    })();
  }, [router]);

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const total = useMemo(
    () => cart.reduce((sum, r) => sum + r.product.price * r.quantity, 0),
    [cart]
  );

  const adjustQuantity = async (row: CartRow, delta: number) => {
    const next = row.quantity + delta;
    if (next < 1) {
      setUpdatingId(row.id);
      await supabase.from("keranjang").delete().eq("id", row.id);
      setCart((c) => c.filter((i) => i.id !== row.id));
      setUpdatingId(null);
      return;
    }
    if (next > row.product.stock) return;
    setUpdatingId(row.id);
    const { error } = await supabase
      .from("keranjang")
      .update({ quantity: next, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (!error)
      setCart((c) => c.map((i) => (i.id === row.id ? { ...i, quantity: next } : i)));
    setUpdatingId(null);
  };

  const removeItem = async (row: CartRow) => {
    setUpdatingId(row.id);
    await supabase.from("keranjang").delete().eq("id", row.id);
    setCart(c => c.filter(i => i.id !== row.id));
    setUpdatingId(null);
  };

  const renderLoading = () => (
    <div className="flex-1 flex flex-col gap-4" aria-busy="true">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
            className="h-28 rounded-xl border animate-pulse bg-gray-50 flex items-center px-4 gap-4"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/4 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-6 h-4 bg-gray-200 rounded" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <p className="text-gray-500 text-lg font-medium">Oops, keranjang kamu masih kosong...</p>
      <button
        onClick={() => router.push("/toko")}
        className="mt-6 px-6 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800"
      >
        Mulai Belanja
      </button>
    </div>
  );

  const renderError = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <p className="text-red-600 font-medium">Terjadi kesalahan memuat keranjang.</p>
      <p className="text-sm text-gray-500 mt-1">{error}</p>
      <button
        onClick={fetchCart}
        className="mt-4 px-5 py-2 rounded-full border font-medium text-sm hover:bg-gray-50"
      >
        Coba Lagi
      </button>
    </div>
  );

  const renderList = () => (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {cart.map((row) => (
            <div
              key={row.id}
              className="flex items-start gap-4 border rounded-xl p-4 shadow-sm"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={row.product.image_url}
                  alt={row.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{row.product.name}</p>
                <p className="font-semibold mt-1">{formatPrice(row.product.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200">
                    {row.product.user.image_url && (
                      <Image
                        src={row.product.user.image_url}
                        alt={row.product.user.username}
                        width={28}
                        height={28}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium leading-tight">{row.product.user.username}</p>
                    <p className="text-gray-500 capitalize leading-tight">
                      {row.product.user.role}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustQuantity(row, -1)}
                  disabled={updatingId === row.id}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Kurangi"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center select-none font-medium">
                  {row.quantity}
                </span>
                <button
                  onClick={() => adjustQuantity(row, 1)}
                  disabled={row.quantity >= row.product.stock || updatingId === row.id}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Tambah"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(row)}
                  disabled={updatingId === row.id}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-red-50 text-red-500 disabled:opacity-40"
                  aria-label="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10" />
      <div className="border-t pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Harga</p>
            <p className="text-xl font-bold">{formatPrice(total)}</p>
          </div>
          <button
            onClick={() => router.push("/pembayaran")}
            className="w-full sm:w-auto px-10 bg-black text-white rounded-full py-3 font-semibold hover:bg-gray-800 transition-colors"
          >
            Lanjutkan Pembelian
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-6 w-full h-full flex flex-col">
	<button
            onClick={() => router.back()}
            className="p-2 rounded-full"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">
        {loading
          ? renderLoading()
          : error
          ? renderError()
          : cart.length === 0
          ? renderEmpty()
          : renderList()}
      </div>
    </div>
  );
};

export default CartPage;
