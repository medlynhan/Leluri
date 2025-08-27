'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useParams } from 'next/navigation';
import Image from 'next/image';

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

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

            if (error) {
                setError(error.message);
            } else if (data) {
                setProduct(data as Product);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    if (!product) {
        return <div className="container mx-auto p-4">Product not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Image src={product.image_url} alt={product.name} width={500} height={500} className="rounded-lg" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold text-gray-800 mb-4">Rp {product.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center mb-4">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-600">{product.rating}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <Image src={product.user.image_url || '/default-avatar.png'} alt={product.user.username} width={40} height={40} className="rounded-full" />
                        <div className="ml-4">
                            <p className="font-semibold">{product.user.username}</p>
                            <p className="text-sm text-gray-500">{product.user.role}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
                    <div className="text-sm text-gray-600">
                        <p>Dimensions:</p>
                        <ul className="list-disc list-inside">
                            <li>Length: {product.length} cm</li>
                            <li>Width: {product.width} cm</li>
                            <li>Thickness: {product.thickness} cm</li>
                        </ul>
                    </div>
                    <div className="mt-6">
                        <button className="bg-blue-500 text-white py-2 px-6 rounded-full mr-4">Add to Cart</button>
                        <button className="bg-green-500 text-white py-2 px-6 rounded-full">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
