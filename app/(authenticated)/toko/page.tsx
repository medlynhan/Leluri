'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import { Star, ShoppingCart, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    rating: number;
    user: {
        username: string;
        role: string;
        image_url: string;
    };
}

const StarRating = ({ rating }: { rating: number }) => {
    const value = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = value >= i + 1; 
                return (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--medium-grey)]'}`}
                    />
                );
            })}
            <span className="ml-2 text-sm text-[var(--black)]">{value.toFixed(1)}</span>
        </div>
    );
};

const StorePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const fetchProducts = async (search = '') => {
        setLoading(true);
        let query = supabase
            .from('product')
            .select(`
                *,
                user:users (
                    username,
                    role,
                    image_url
                )
            `)
            .order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            setError(error.message);
        } else if (data) {
            setProducts(data as Product[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = () => {
        fetchProducts(searchTerm);
    };

    if (loading) {
        return (
            <div className="flex flex-col w-full h-full px-12 py-6">
                <div className="h-14 w-full mb-8 bg-[var(--light-grey)] rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-[var(--medium-grey)] overflow-hidden">
                            <div className="aspect-square bg-[var(--light-grey)] animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 w-3/4 bg-[var(--light-grey)] rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-[var(--light-grey)] rounded animate-pulse" />
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <div key={s} className="w-4 h-4 bg-[var(--light-grey)] rounded animate-pulse" />
                                    ))}
                                    <div className="h-4 w-10 bg-[var(--light-grey)] rounded animate-pulse" />
                                </div>
                                <div className="flex items-center pt-3 border-t border-[var(--light-grey)] gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--light-grey)] animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-24 bg-[var(--light-grey)] rounded animate-pulse" />
                                        <div className="h-3 w-16 bg-[var(--light-grey)] rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="sticky top-0 flex flex-row items-center gap-4 p-6 z-10 bg-white border-b border-[var(--light-grey)]">
                <div className="relative w-full ml-20">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        placeholder="Apa yang ingin kamu temukan ?"
                        className="pl-12 py-3 text-base border border-gray-300 bg-white rounded-full w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {searchTerm.length > 0 && (
                        <button
                            type="button"
                            onClick={() => { setSearchTerm(''); fetchProducts(''); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-100 p-1 rounded-full"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    className="px-8 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-full"
                >
                    Cari
                </button>
                <button
                    onClick={() => router.push('/keranjang')}
                    aria-label="Keranjang"
                    className="p-3 rounded-full hover:bg-gray-100"
                >
                    <ShoppingCart className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-col w-full px-12 pb-12 pt-6">
                <span className="font-bold text-lg mb-4">Produk ({products.length})</span>
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                        <Image src="/no_result.png" width={160} height={160} alt="No Products" />
                        <p className="mt-4">Belum ada produk yang tersedia ...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="bg-white w-full rounded-2xl overflow-hidden border border-[var(--medium-grey)] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                                onClick={() => router.push(`/toko/${product.id}`)}
                            >
                                <div className="relative aspect-square">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-2xl"
                                    />
                                </div>
                                <div className="w-full grid p-4">
                                    <h3 className="w-full text-lg font-semibold truncate">
                                        {product.name}
                                    </h3>
                                    <div className="my-2">
                                        <p className="text-sm font-semibold">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </p>
                                        <div className="mt-1">
                                            <StarRating rating={product.rating} />
                                        </div>
                                    </div>
                                    <div className="flex items-center pt-4 border-t border-[var(--medium-grey)]">
                                        <Image
                                            src={product.user.image_url || '/placeholder.svg'}
                                            alt={product.user.username}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="ml-3">
                                            <p className="text-xs font-semibold text-[var(--dark-grey)]">
                                                {product.user.username}
                                            </p>
                                            <p className="text-xs text-[var(--dark-grey)] capitalize">
                                                {product.user.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
};

export default StorePage;
