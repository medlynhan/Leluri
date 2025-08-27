'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    rating: number;
    user: {
        username: string;
        role: string;
    };
}

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
                    role
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
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Apa yang ingin kamu temukan?"
                        className="w-full py-2 pl-10 pr-4 border rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleSearch} className="bg-yellow-500 text-white py-2 px-4 rounded-full">Cari</button>
                    <FaShoppingCart className="text-2xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => router.push(`/Store/${product.id}`)}>
                        <div className="relative h-64">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-800 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                            <div className="flex items-center mt-2">
                                <div className="flex items-center">
                                    {/* Placeholder for rating stars */}
                                    <span className="text-yellow-500">★</span>
                                    <span className="ml-1 text-gray-600">{product.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                {/* Placeholder for user avatar */}
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="ml-2">
                                    <p className="text-sm font-semibold">{product.user.username}</p>
                                    <p className="text-xs text-gray-500">{product.user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StorePage;
