'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { Star, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

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
                        className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                );
            })}
            <span className="ml-2 text-sm text-gray-600">{value.toFixed(1)}</span>
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
            <div className="p-4">
                <div className="flex justify-between items-center mb-6 ">
                    <div className="relative w-full max-w-lg">
                        <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="relative h-72 bg-gray-200 animate-pulse" />
                            <div className="p-4 w-64">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                                <div className="mt-2">
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <div key={s} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                        ))}
                                        <div className="h-4 w-8 bg-gray-200 rounded ml-2 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                                    <div className="ml-3 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        
        <div className='flex min-h-screen border-4 bg-white overflow-x-hidden border-5 border-blue-500'>
            {/*Sidebar */}
            <Sidebar />

            <div className="border w-full h-full ml-64 px-5">
            
                {/*Search Bar */}
                <div className="grid grid-cols-4 justify-between items-center border my-10 ">
                    <div className="relative col-span-2 w-full md:col-span-3 w-full border">
                        <input
                            type="text"
                            placeholder="Apa yang ingin kamu temukan?"
                            className="w-full py-3 pl-12 pr-4 border border-[var(--black)] rounded-full "
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="col-span-2 md:col-span-1 w-full border flex items-center  justify-end gap-6">
                        <button onClick={handleSearch} className="bg-[var(--yellow)] text-white py-3 px-8 rounded-full font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent font-semibold hover:text-[var(--black)]  transition-colors">Cari</button>
                        <button onClick={() => router.push('/keranjang')} aria-label="Keranjang" className="p-2  rounded-full transition-colors">
                            <ShoppingCart className="w-6 h-6 hover:text-[var(--yellow)]" />
                        </button>
                    </div>
                </div>


                {/*List of Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 border">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => router.push(`/toko/${product.id}`)}>
                            <div className="relative h-72">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-2xl"
                                />
                            </div>
                            <div className="p-4 w-64">
                                <h3 className="text-base font-semibold text-gray-800 truncate">
                                    {product.name}
                                </h3>

                                <div className="mt-2">
                                    <p className="text-lg font-bold text-gray-900">
                                    Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                    <div className="mt-1">
                                    <StarRating rating={product.rating} />
                                    </div>
                                </div>

                                {/*Information Profile*/}
                                <div className="flex items-center mt-4 pt-4 border-t border-gray-100 ">
                                    <Image
                                    src={product.user.image_url || '/placeholder.svg'}
                                    alt={product.user.username}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {product.user.username}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {product.user.role}
                                    </p>
                                    </div>
                                </div>


                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        
    );
};

export default StorePage;
