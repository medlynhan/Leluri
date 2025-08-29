"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; image_url: string; stock: number; user: { username: string; role: string; image_url: string | null } };
}

const formatPrice = (p: number) => `Rp ${p.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const paymentOptions = {
  "E-Wallet": [
    { id: "shopeepay", name: "Shopee Pay", logo: "/shopee.png" },
    { id: "gopay", name: "Gopay", logo: "/gopay.png" },
    { id: "ovo", name: "Ovo", logo: "/ovo.png" }
  ],
  "Virtual Account": [
    { id: "bca", name: "BCA Virtual Account", logo: "/bca.png" },
    { id: "mandiri", name: "Mandiri Virtual Account", logo: "/mandiri.png" }
  ]
};

const PembayaranPage: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((s, r) => s + r.product.price * r.quantity, 0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/Login'); return; }
      setUserId(user.id);
    })();
  }, [router]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('keranjang')
        .select(`id, quantity, product:product ( id, name, price, stock, image_url, user:users ( username, role, image_url ) )`)
        .eq('user_id', userId);
      setCart((data as any) || []);
    };
    fetchCart();
  }, [userId]);

  const confirmPayment = async () => {
    if (!selectedOption || !userId || processing || cart.length === 0) return;
    setProcessing(true);

    for (const row of cart) {
      const newStock = Math.max(0, row.product.stock - row.quantity);
      await supabase.from('product').update({ stock: newStock }).eq('id', row.product.id);
    }
    await supabase.from('keranjang').delete().eq('user_id', userId);

    setSuccess(true);
    setProcessing(false);
  };

  return (
    <div className="w-full p-6">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-semibold">Pembayaran</h1>
      </header>

  <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,640px)_480px] gap-12">
        <div className="bg-white flex flex-col min-h-[520px]">
          <div className="p-6 flex-1 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 px-4 py-3 border rounded-xl">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="font-semibold mt-1">{formatPrice(item.product.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200">
                      {item.product.user.image_url && (
                        <Image src={item.product.user.image_url} alt={item.product.user.username} width={28} height={28} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium leading-tight">{item.product.user.username}</p>
                      <p className="text-gray-500 capitalize leading-tight">{item.product.user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">x {item.quantity}</div>
              </div>
            ))}
          </div>
          <div className="border-t px-6 py-5">
            <p className="text-sm text-gray-500 mb-1">Total Harga</p>
            <p className="text-xl font-bold">{formatPrice(total)}</p>
          </div> 
        </div>

  <div className="flex flex-col gap-8 xl:pl-12">
          {Object.entries(paymentOptions).map(([group, opts]) => (
            <div key={group}>
              <h2 className="text-sm font-semibold mb-3">{group}</h2>
              <div className="flex flex-col">
                {opts.map(opt => {
                  const active = selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 relative ${active ? 'bg-gray-50' : ''}`}
                    >
                      <div className="w-10 h-10 relative">
                        <Image src={opt.logo} alt={opt.name} fill className="object-contain" />
                      </div>
                      <span className="text-sm font-medium">{opt.name}</span>
                      {active && <Check className="w-4 h-4 text-green-600 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={confirmPayment}
            disabled={!selectedOption || cart.length === 0 || processing}
            className="bg-black text-white rounded-full py-3 font-semibold disabled:opacity-40 hover:bg-gray-800"
          >
            {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
          </button>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setSuccess(false); router.push('/toko'); }}>
          <div className="bg-white rounded-2xl p-8 w-[420px] max-w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Pembayaran Kamu Berhasil</h3>
            <p className="text-xs text-gray-500 mb-6">Terimakasih telah mensupport pengrajin Indonesia !</p>
            <div className="w-40 h-32 mx-auto mb-6 relative">
              <Image src="/images/pay/success.png" alt="Success" fill className="object-contain" />
            </div>
            <button onClick={() => { setSuccess(false); router.push('/toko'); }} className="w-full py-2 border rounded-full text-sm font-medium hover:bg-gray-50">Lanjutkan</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PembayaranPage;
